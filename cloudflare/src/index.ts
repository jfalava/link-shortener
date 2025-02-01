const generateRandomString = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	// Format the string with a hyphen after every 3 characters
	return `${result.slice(0, 3)}-${result.slice(3)}`;
};

export default {
	async fetch(request: Request, env: { MY_KV_NAMESPACE: KVNamespace }): Promise<Response> {
		try {
			// Handle POST request
			if (request.method === 'POST') {
				const body: { url?: string } = await request.json();

				// Validate the URL
				if (!body.url || !/^https?:\/\/.+/.test(body.url)) {
					return new Response('Valid URL is required', { status: 400 });
				}

				// Generate a random 6-character string with hyphen formatting
				const key = generateRandomString();

				// Store the URL in KV with the generated key
				await env.MY_KV_NAMESPACE.put(key, body.url);

				// Return the formatted key as the response
				return new Response(JSON.stringify({ key }), {
					headers: { 'Content-Type': 'application/json' },
				});
			}

			// Handle GET request
			if (request.method === 'GET') {
				const url = new URL(request.url);
				const key = url.searchParams.get('key');

				if (!key) {
					return new Response('Key is required', { status: 400 });
				}

				const storedUrl = await env.MY_KV_NAMESPACE.get(key);
				if (!storedUrl) {
					return new Response('Key not found', { status: 404 });
				}

				return new Response(JSON.stringify({ url: storedUrl }), {
					headers: { 'Content-Type': 'application/json' },
				});
			}

			// Handle other HTTP methods
			return new Response('Method Not Allowed', { status: 405 });
		} catch (error) {
			console.error('Error processing request:', error);
			return new Response('Internal Server Error', { status: 500 });
		}
	},
};
