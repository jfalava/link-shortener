const generateRandomString = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return `${result.slice(0, 3)}-${result.slice(3)}`;
};

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  return origin.endsWith('.jfa.ovh') ||
         origin === 'https://jfa.ovh' ||
         origin.endsWith('.jfa.dev');
};

const getCorsHeaders = (request: Request): HeadersInit => {
  const origin = request.headers.get('Origin');
  if (!isAllowedOrigin(origin)) {
    return {
      'Access-Control-Allow-Origin': '',
      'Access-Control-Allow-Methods': '',
      'Access-Control-Allow-Headers': ''
    };
  }

  return {
    'Access-Control-Allow-Origin': origin || '',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
};

export default {
async fetch(request: Request, env: { "link-shortener-kv": KVNamespace }): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: getCorsHeaders(request),
      });
    }

    try {
          if (request.method === 'POST') {
            const body: { url?: string } = await request.json();

            if (!body.url || !/^https?:\/\/.+/.test(body.url)) {
              return new Response('Valid URL is required', {
                status: 400,
                headers: getCorsHeaders(request)
              });
            }

            const key = generateRandomString();
            await env["link-shortener-kv"].put(key, body.url);

            return new Response(JSON.stringify({ key }), {
              headers: {
                'Content-Type': 'application/json',
                ...getCorsHeaders(request)
              },
            });
          }

          if (request.method === 'GET') {
            const url = new URL(request.url);
            const key = url.searchParams.get('key');

            if (!key) {
              return new Response('Key is required', {
                status: 400,
                headers: getCorsHeaders(request)
              });
            }

            const storedUrl = await env["link-shortener-kv"].get(key);
            if (!storedUrl) {
              return new Response('Key not found', {
                status: 404,
                headers: getCorsHeaders(request)
              });
            }

        return new Response(JSON.stringify({ url: storedUrl }), {
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(request)
          },
        });
      }

      return new Response('Method Not Allowed', {
        status: 405,
        headers: getCorsHeaders(request)
      });
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response('Internal Server Error', {
        status: 500,
        headers: getCorsHeaders(request)
      });
    }
  },
};
