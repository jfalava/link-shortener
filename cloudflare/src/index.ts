const RATE_LIMIT = {
	MAX_REQUESTS: 100,
	WINDOW_SECONDS: 600,
};

const generateRandomString = (): string => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 6; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

const isAllowedOrigin = (origin: string | null): boolean => {
	if (!origin) return false;
	return origin.endsWith('.jfa.ovh') || origin.endsWith('.jfa.dev');
};

const getCorsHeaders = (request: Request): HeadersInit => {
	const origin = request.headers.get('Origin');
	if (!isAllowedOrigin(origin)) {
		return {
			'Access-Control-Allow-Origin': '',
			'Access-Control-Allow-Methods': '',
			'Access-Control-Allow-Headers': '',
		};
	}

	return {
		'Access-Control-Allow-Origin': origin || '',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	};
};

const getClientIdentifier = (request: Request): string => {
	return request.headers.get('CF-Connecting-IP') || 'unknown';
};

const checkRateLimit = async (
	env: { 'link-shortener-ratelimit': KVNamespace },
	identifier: string,
): Promise<{ allowed: boolean; remaining: number }> => {
	const key = `rate-limit:${identifier}`;
	const currentTimestamp = Math.floor(Date.now() / 1000);

	const data = await env['link-shortener-ratelimit'].get(key);
	const { count = 0, timestamp = currentTimestamp } = data ? JSON.parse(data) : {};

	if (currentTimestamp - timestamp >= RATE_LIMIT.WINDOW_SECONDS) {
		await env['link-shortener-ratelimit'].put(key, JSON.stringify({ count: 1, timestamp: currentTimestamp }));
		return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1 };
	}

	if (count >= RATE_LIMIT.MAX_REQUESTS) {
		return { allowed: false, remaining: 0 };
	}

	await env['link-shortener-ratelimit'].put(key, JSON.stringify({ count: count + 1, timestamp }));
	return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - (count + 1) };
};

export default {
	async fetch(request: Request, env: { 'link-shortener-kv': KVNamespace; 'link-shortener-ratelimit': KVNamespace }): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: getCorsHeaders(request) });
		}

		if (url.pathname === '/api') {
			const identifier = getClientIdentifier(request);
			const { allowed, remaining } = await checkRateLimit(env, identifier);

			if (!allowed) {
				return new Response('Too Many Requests', {
					status: 429,
					headers: {
						...getCorsHeaders(request),
						'Retry-After': RATE_LIMIT.WINDOW_SECONDS.toString(),
						'X-RateLimit-Remaining': '0',
						'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + RATE_LIMIT.WINDOW_SECONDS).toString(),
					},
				});
			}

			const headers = {
				...getCorsHeaders(request),
				'X-RateLimit-Remaining': remaining.toString(),
				'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + RATE_LIMIT.WINDOW_SECONDS).toString(),
			};

			try {
				if (request.method === 'POST') {
					const body: { url?: string } = await request.json();
					const headers = getCorsHeaders(request);

					if (!body?.url) {
						return new Response('Missing URL', { status: 400, headers });
					}

					try {
						new URL(body.url);
					} catch {
						return new Response('Invalid URL', { status: 400, headers });
					}

					const existingKey = await env['link-shortener-kv'].list({ prefix: '', limit: 1000 });
					for (const item of existingKey.keys) {
						const storedUrl = await env['link-shortener-kv'].get(item.name);
						if (storedUrl === body.url) {
							return new Response(JSON.stringify({ key: item.name }), {
								headers: { 'Content-Type': 'application/json', ...headers },
							});
						}
					}

					let key: string, exists: string | null;
					do {
						key = generateRandomString();
						exists = await env['link-shortener-kv'].get(key);
					} while (exists);

					await env['link-shortener-kv'].put(
						key,
						body.url,
						{ expirationTtl: 60 * 60 * 24 * 90 }, // 90 days TTL
					);

					return new Response(JSON.stringify({ key }), {
						headers: { 'Content-Type': 'application/json', ...headers },
					});
				}

				if (request.method === 'GET') {
					const key = url.searchParams.get('key');
					const headers = getCorsHeaders(request);

					if (!key) {
						return new Response('Missing key', { status: 400, headers });
					}

					const storedUrl = await env['link-shortener-kv'].get(key);
					return storedUrl
						? new Response(JSON.stringify({ url: storedUrl }), {
								headers: { 'Content-Type': 'application/json', ...headers },
							})
						: new Response('Key not found', { status: 404, headers });
				}

				return new Response('Method Not Allowed', { status: 405 });
			} catch (error) {
				console.error('Error:', error);
				return new Response('Internal Server Error', { status: 500 });
			}
		}

		const key = url.pathname.slice(1).split('/')[0]; // ignore trailing paths
		if (key) {
			const storedUrl = await env['link-shortener-kv'].get(key);
			if (storedUrl) {
				return Response.redirect(storedUrl, 302);
			}
		}

		if (url.hostname === 'jfa.ovh' && !key) {
			return Response.redirect('https://link-shortener.jfa.dev/', 302);
		}

		return new Response('Not Found', { status: 404 });
	},
};
