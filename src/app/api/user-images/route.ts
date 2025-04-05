import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: Request) {
  try {
    // Get the user_id from the URL query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('API Route - Request URL:', request.url);
    console.log('API Route - User ID from params:', userId);
    console.log('API Route - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('API Route - Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    if (!userId) {
      console.log('API Route - Missing userId parameter');
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }
    
    console.log('API Route - Fetching images for user:', userId);
    
    // Query Supabase for images by user_id
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('API Route - Error fetching images from Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      );
    }
    
    console.log(`API Route - Found ${data.length} images for user ${userId}`);
    console.log('API Route - First image data:', data.length > 0 ? JSON.stringify(data[0]) : 'No images');
    
    return NextResponse.json({ images: data });
  } catch (error) {
    console.error('API Route - Error in user-images API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
} 