import { defineMiddleware } from "astro:middleware";
import { isPrivatePathname } from "./data/privateContent";

type PrivateEnv = {
	PRIVATE_ALLOWED_EMAIL?: string;
	PRIVATE_CONTENT_USERNAME?: string;
	PRIVATE_CONTENT_PASSWORD?: string;
};

function getPrivateEnv(locals: App.Locals): PrivateEnv {
	return (locals.runtime?.env ?? {}) as PrivateEnv;
}

function getAllowedEmails(value?: string) {
	return (value ?? "")
		.split(",")
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean);
}

function parseBasicAuth(header: string | null) {
	if (!header?.startsWith("Basic ")) {
		return undefined;
	}

	try {
		const decoded = atob(header.slice("Basic ".length));
		const separatorIndex = decoded.indexOf(":");

		if (separatorIndex < 0) {
			return undefined;
		}

		return {
			username: decoded.slice(0, separatorIndex),
			password: decoded.slice(separatorIndex + 1),
		};
	} catch {
		return undefined;
	}
}

function isAuthorized(request: Request, env: PrivateEnv) {
	const allowedEmails = getAllowedEmails(env.PRIVATE_ALLOWED_EMAIL);
	const accessEmail = request.headers
		.get("cf-access-authenticated-user-email")
		?.trim()
		.toLowerCase();

	if (accessEmail && allowedEmails.includes(accessEmail)) {
		return true;
	}

	if (!env.PRIVATE_CONTENT_PASSWORD) {
		return false;
	}

	const credentials = parseBasicAuth(request.headers.get("authorization"));
	const expectedUsername = env.PRIVATE_CONTENT_USERNAME ?? "ingu";

	return (
		credentials?.username === expectedUsername &&
		credentials.password === env.PRIVATE_CONTENT_PASSWORD
	);
}

function unauthorizedResponse() {
	return new Response("Private content", {
		status: 401,
		headers: {
			"Cache-Control": "no-store",
			"WWW-Authenticate": 'Basic realm="Ingus Lab private content", charset="UTF-8"',
		},
	});
}

export const onRequest = defineMiddleware((context, next) => {
	const { pathname } = new URL(context.request.url);

	if (!isPrivatePathname(pathname)) {
		return next();
	}

	if (isAuthorized(context.request, getPrivateEnv(context.locals))) {
		return next();
	}

	return unauthorizedResponse();
});
