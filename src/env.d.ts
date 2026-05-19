type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface Env {
  PRIVATE_ALLOWED_EMAIL?: string;
  PRIVATE_CONTENT_USERNAME?: string;
  PRIVATE_CONTENT_PASSWORD?: string;
}
