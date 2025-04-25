
export const GET = async (request) => {
  const API_KEY = process.env.ACCESS_KEY;
  const LIMIT = 10;
  const TIMEOUT = 5000;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  const searchParams = request.nextUrl.searchParams;
  const cat = searchParams.get('cat');
  const offset = searchParams.get('offset');
  
  let returnedPosts;
  let statusCode = 200;

  try {
    returnedPosts = await fetch(
      `https://api.mediastack.com/v1/news?limit=${LIMIT}&offset=${offset}&access_key=${API_KEY}&categories=${cat}`,
      { signal: controller.signal }
    );
    if (!returnedPosts.ok) {
      throw new Error(`HTTP error! Status: ${returnedPosts.status}`);
    }
    
    returnedPosts = await returnedPosts.json();
    
    if (!returnedPosts || !Array.isArray(returnedPosts.data)) {
      throw new Error('Unexpected response format');
    }

  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error('Failed to get posts:', err);
    }
    returnedPosts = null;
    statusCode = 500;

  } finally {
    clearTimeout(timeoutId);
  }

  return new Response(JSON.stringify(returnedPosts), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });

}