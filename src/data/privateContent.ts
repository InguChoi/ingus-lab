export const PRIVATE_CONCEPT_BOOK_SLUGS = new Set(["inguslab-sdl-roadmap"]);

export function isPrivateConceptBookSlug(slug: string) {
	return PRIVATE_CONCEPT_BOOK_SLUGS.has(slug);
}

export function isPrivatePathname(pathname: string) {
	return (
		pathname === "/concept/llm-vlm-vla-robotics/inguslab-sdl-roadmap" ||
		pathname === "/concept/llm-vlm-vla-robotics/inguslab-sdl-roadmap/"
	);
}
