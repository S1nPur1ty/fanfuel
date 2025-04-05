import { NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';

// Initialize Pinata client
const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY || '',
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY || ''
});

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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
        
        // Return both the original data and the IPFS hash
        return NextResponse.json({
          ...data,
          ipfsHash,
          ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
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