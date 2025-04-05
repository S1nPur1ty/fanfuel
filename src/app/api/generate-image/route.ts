import { NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { createClient } from '@supabase/supabase-js';

// Initialize Pinata client
const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY || '',
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY || ''
});

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Function to upload image to IPFS
async function uploadToIPFS(imageUrl: string, name: string) {
  try {
    console.log('Starting IPFS upload process for:', name);
    console.log('Image URL:', imageUrl);
    
    // Fetch the image from the URL
    console.log('Fetching image from URL...');
    const response = await fetch(imageUrl);
    console.log('Image fetch response status:', response.status);
    
    const imageBuffer = await response.arrayBuffer();
    console.log('Image buffer size:', imageBuffer.byteLength, 'bytes');
    
    // Create a readable stream from the buffer
    console.log('Creating readable stream from buffer...');
    const stream = require('stream');
    const readableStream = new stream.Readable();
    readableStream.push(Buffer.from(imageBuffer));
    readableStream.push(null);
    console.log('Readable stream created successfully');
    
    // Upload to IPFS
    console.log('Uploading to IPFS via Pinata...');
    const result = await pinata.pinFileToIPFS(readableStream, {
      pinataMetadata: {
        name: name
      }
    });
    
    console.log('IPFS upload successful!');
    console.log('IPFS hash:', result.IpfsHash);
    console.log('IPFS URL:', `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}

// Function to save image data to Supabase
async function saveImageToSupabase(imageData: {
  userId: string;
  prompt: string;
  originalUrl: string;
  ipfsHash: string;
  ipfsUrl: string;
}) {
  try {
    console.log('Saving image data to Supabase...');
    
    const { data, error } = await supabase
      .from('generated_images')
      .insert([
        {
          user_id: imageData.userId,
          prompt: imageData.prompt,
          original_url: imageData.originalUrl,
          ipfs_hash: imageData.ipfsHash,
          ipfs_url: imageData.ipfsUrl,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }
    
    console.log('Image data saved to Supabase successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in saveImageToSupabase:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    // Extract prompt and userId from the request body
    // If they're not in the root of the body, check if they're in the input object
    const prompt = body.input.prompt;
    const userId = body.input.userId;
    
    console.log('body:', body);
    console.log('Extracted prompt:', prompt);
    console.log('Extracted userId:', userId);
    
    // Make the request to Replicate API
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Replicate API error: ${errorData.detail || response.statusText}` },
        { status: response.status },
      );
    }
    
    const data = await response.json();
    
    // If the image was generated successfully, upload it to IPFS
    if (data.output && data.output.length > 0) {
      const imageUrl = data.output[0];
      const imageName = `generated-image-${Date.now()}`;
      
      try {
        const ipfsHash = await uploadToIPFS(imageUrl, imageName);
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        
        // Save the image data to Supabase
        await saveImageToSupabase({
          userId,
          prompt: prompt || 'No prompt provided',
          originalUrl: imageUrl,
          ipfsHash,
          ipfsUrl
        });
        
        // Return both the original data and the IPFS hash
        return NextResponse.json({
          ...data,
          ipfsHash,
          ipfsUrl
        });
      } catch (ipfsError) {
        console.error('IPFS upload error:', ipfsError);
        // Still return the original data even if IPFS upload fails
        return NextResponse.json(data);
      }
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in generate-image API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 