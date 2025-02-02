# Link Shortener

KV database studies and proofs of concept

## [Terms of Use](https://link-shortener.jfa.dev/tos)

## The code

- [Backend](/cloudflare/src/index.ts)

- [Web Page](/www/)

## What it requires

Core components:

- Key-Value storage system for URL mappings and rate limiting
- Serverless function or API endpoint capability
- NodeJS `v18.17.1` or later for development

Optional components:

- Web hosting for the frontend UI
- Reverse proxy for custom domain routing

## How it works

1. User submits a URL through the web interface
2. Request validation occurs in two stages:
   - Client-side: Checks for empty input
   - Server-side: Validates URL format and rate limiting
3. System checks for existing shortened URLs to prevent duplicates
4. For new URLs:
   - Generates a unique `XXX-XXX-XXX` format key
   - Stores URL with `90-day` expiration
   - Returns key in `JSON` response
5. Frontend constructs final shortened URL (`domain`/`key`)
6. User receives copyable shortened URL with status notification

## How to deploy

### Cloudflare

#### Prerequisites

- Cloudflare account with Workers enabled
- Wrangler CLI (`npm install -g wrangler`)
- Two KV namespaces created in Cloudflare:
  - One for URL storage
  - One for rate limiting

#### Steps

1. Clone and setup:

```bash
$ git clone https://github.com/jfalava/link-shortener.git
$ cd link-shortener/cloudflare
$ npm install -g pnpm
$ pnpm install
```

2. Create KV namespaces in Cloudflare dashboard or via Wrangler:

```bash
$ pnpx wrangler kv:namespace create "URL_STORAGE"
$ pnpx wrangler kv:namespace create "RATE_LIMIT"
```

3. Configure wrangler.toml:

```toml
routes = [{ pattern = "<your endpoint domain>", custom_domain = true }]

[[kv_namespaces]];
binding = "URL_STORAGE";
id = "your-url-storage-kv-id"

[[kv_namespaces]];
binding = "RATE_LIMIT";
id = "your-rate-limit-kv-id";
```

4. Deploy to Cloudflare:

```bash
$ pnpm run deploy
```

After deployment, your worker will be available at `your-worker.your-subdomain.workers.dev`

## TODO

- [ ] AWS Lambda version of the API endpoint
- [ ] IBM Cloud Functions version of the API endpoint
- [ ] Terraform for required infrastructure in AWS and IBM Cloud
