# Link Shortener API

## Overview

The Link Shortener API provides endpoints for creating and retrieving shortened URLs. It supports rate limiting and CORS for secure and efficient usage.

## Base URL

`https://jfa.ovh/api`

## Endpoints

### Shorten a URL

- Metho: `POST`
- Pat: `/api`
- Header: `Content-Type: application/json`
- Body:

  ```json
  {
  	"url": "https://example.com"
  }
  ```

- Response:

  - Success (Status: 200):

  ```json
  {
  	"key": "abc123"
  }
  ```

  - Error (Status: 400, 422, 429, 500):

    - Missing URL: "Missing URL"
    - Invalid URL format: "Invalid URL format"
    - Missing protocol: "URL must include http:// or https://"
    - Rate limit exceeded: "Too Many Requests"

### Retrieve Original URL

- Method: `GET`
- Path: `/api?key=<short_key>`
- Response:

  - Success (Status: 200):

  ```json
  {
  	"url": "https://example.com"
  }
  ```

- Error (Status: 400, 404):
  - Missing key: `Missing key`
  - Key not found: `Key not found`

## Rate Limiting

- Maximum requests: `200` per `172800` seconds (2 days).
- Headers:
  - `X-RateLimit-Remaining`: Number of remaining requests.
  - `X-RateLimit-Reset`: Timestamp when the rate limit resets.

## CORS

- Allowed origins: `*.jfa.ovh`, `*.jfa.dev`.
- Allowed methods: `GET`, `POST`, `OPTIONS`.

## Example Usage with cURL

### Shorten a URL with cURL

```bash
curl -X POST https://jfa.ovh/api \
 -H "Content-Type: application/json" \
 -d '{"url": "https://example.com"}'
```

### Retrieve Original URL with cURL

```bash
curl -X GET "https://jfa.ovh/api?key=abc123"
```
