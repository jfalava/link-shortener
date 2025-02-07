# Link Shortener

KV database studies and proofs of concept

## My implementation: "JFA Link Shortener" [Terms of Use](https://link-shortener.jfa.dev/tos)

## What it requires

Core components:

- A KV-like NoSQL database service, like AWS DynamoDB or Cloudflare KV
- A serverless functions provider, like AWS Lambda or Cloudflare Workers
- A way to interact with the API, like cURL or a frontend UI of any kind

## How it works

### [API docs](/cloudflare/README.md)

### [Example frontend docs](/www/README.md)

## How to deploy

<details>
<summary>Cloudflare</summary>

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
name = "<your project name>"
main = "src/index.ts"
compatibility_date = "2025-01-29"
compatibility_flags = ["nodejs_compat"]
routes = [{ pattern = "<your-domain>", custom_domain = true }]

[observability]
enabled = true

[placement]
mode = "smart"

[[kv_namespaces]]
binding = "URL_STORAGE"
id = "<URL_STORAGE id>"

[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "<RATE_LIMIT id>"

```

4. Deploy to Cloudflare:

```bash
$ pnpm run deploy
```

After deployment, your worker will be available at `your-worker.your-subdomain.workers.dev`

</details>

## TODO

- [ ] AWS Lambda version of the API endpoint
- [ ] IBM Cloud Functions version of the API endpoint
- [ ] Self-hosted version of the code and the infrastructure required
- [ ] IaaC deployments for AWS and IBM Cloud
