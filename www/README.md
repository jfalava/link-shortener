## `link.jfa.dev`

### Overview

This is an example of a frontend UI for the Link Shortener API.  
It allows users to shorten URLs, view shortened links, and receive status feedback through toast notifications.

## Features

- Basic input validation:
  - Checks if the input URL is valid and includes a protocol (http:// or https://).
  - Displays error messages for invalid or missing inputs.
- Local Storage:
  - Caches previously shortened URLs for faster access.
  - Avoids unnecessary API calls by checking local storage first.
- Dynamic UI Updates:
  - Transitions between input and result sections smoothly.
  - Displays the shortened URL after successful submission.
- Toast Notifications:
  - Provides feedback for errors (e.g., missing protocol, invalid URL).

## How It Works

1. User Input:

- The user enters a URL in the input field and submits it.

2. Validation:

- The frontend checks if the URL is valid and includes a protocol.

3. Local Storage Check:

- If the URL has been shortened before, the frontend retrieves the shortened URL from local storage.

4. API Call:

- If the URL is not found in local storage, the frontend sends a request to the API to shorten the URL.

5. UI Update:

- The frontend updates the UI to display the shortened URL.

6. Error Handling:

- Displays appropriate error messages for invalid inputs or API failures.

## Usage

1. Enter a URL in the input field.
2. Click the "Shorten" button.
3. View the shortened URL in the result section.

## Example Workflow

1. User enters `https://example.com` in the input field.
2. The frontend checks local storage and finds no match.
3. The frontend sends a POST request to the API:

```json
{
  "url": "https://example.com"
}
```

4. The API responds with:

```json
{
  "key": "abc123"
}
```

5. The frontend displays the shortened URL: `https://jfa.ovh/abc123`.

## Dependencies

- Toast Notifications: Managed by showToastWithTimeout utility.
- Local Storage: Used for caching shortened URLs.
