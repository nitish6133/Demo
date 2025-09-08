# Local HTTPS for Dev only (Vite + mkcert)

To use browser features that require a secure context (like microphone recording) on a custom local domain, you can run the Vite dev server over HTTPS using a locally trusted certificate. This is for local development only. Docker containers and deployed environments use HTTP.

Important:

- HTTPS is disabled by default. It’s enabled only when you set `VITE_HTTPS=true` and the `certs/dev.crt` and `certs/dev.key` files exist.
- The Docker image does not include certs and serves over HTTP.

## 1) Pick a local domain

Choose a domain you will use for development, e.g.

- dev.aipujari.local
- aipujari.localhost
- aipujari.test

We will map it to 127.0.0.1 in /etc/hosts.

## 2) Install mkcert and trust its local CA (macOS)

- Install mkcert and nss tools:
  - Homebrew: `brew install mkcert nss`
- Create and trust a local CA:
  - `mkcert -install`

This installs a local CA into your System Keychain so certificates it signs are trusted by your browsers.

## 3) Generate a cert and key for your domain

From the `ui` folder (so files land in `ui/certs`):

```sh
mkdir -p certs
mkcert -key-file certs/dev.key -cert-file certs/dev.crt dev.aipujari.local

Then run the dev server with HTTPS:

VITE_HTTPS=true npm run dev

Or with a host override:

VITE_HTTPS=true VITE_DEV_HOST=dev.aipujari.local npm run dev
```

You can include SANs too, e.g. `localhost 127.0.0.1 ::1`:

```sh
mkcert -key-file certs/dev.key -cert-file certs/dev.crt dev.aipujari.local localhost 127.0.0.1 ::1
```

## 4) Map your domain to localhost

Edit /etc/hosts (requires sudo) and add:

```text
127.0.0.1   dev.aipujari.local
```

## 5) Configure Vite dev server for HTTPS

We’ll configure `vite.config.ts` to use the cert and key. After generating the files above, run:

```sh
npm run dev
```

Then open `https://dev.aipujari.local:5173/`.

If your browser still complains, ensure:

- The mkcert CA is installed (`mkcert -install`) and trusted.
- You’re visiting the exact host you generated the cert for.
- No proxy/extension is rewriting requests.

## 6) Backend API proxy

`/api` requests are already proxied to `VITE_API_BASE_URL`. For HTTPS dev, make sure that variable points to your backend (http or https). If your backend uses self-signed certs, configure trust or run it on http for dev.

## 7) Troubleshooting mic access

- Must be HTTPS or localhost for getUserMedia.
- Check browser site permissions (lock icon → Allow Microphone) and macOS System Settings → Privacy & Security → Microphone.
- Close other apps using the mic (Zoom/Teams/Meet/QuickTime).
- Use Chrome/Edge/Firefox for the most reliable MediaRecorder support.
