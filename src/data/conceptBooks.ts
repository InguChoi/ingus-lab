export interface ConceptBookPage {
	slug: string;
	file: string;
	label: string;
	title: string;
	description: string;
	order: number;
	kind: "landing" | "chapter" | "appendix";
}

export interface ConceptBook {
	slug: string;
	href: string;
	title: string;
	subtitle: string;
	description: string;
	language: string;
	createdAt: string;
	heroImage: string;
	tags: string[];
	pages: ConceptBookPage[];
}

export const llmVlmVlaRoboticsBook: ConceptBook = {
	slug: "llm-vlm-vla-robotics",
	href: "/concept/llm-vlm-vla-robotics/",
	title: "언어 모델은 어떻게 로봇을 움직이게 되었나",
	subtitle:
		"LLM 기반 계획에서 VLM grounding, VLA action model, 그리고 안전한 로봇 시스템 설계까지",
	description:
		"LLM, VLM, VLA를 로봇 시스템에 적용하는 연구 흐름과 실제 구현 구조를 정리한 배경지식 책입니다.",
	language: "ko",
	createdAt: "2026-05-19",
	heroImage: "/concept-books/llm-vlm-vla-robotics/figures/fig01_evolution_timeline.svg",
	tags: ["robotics", "llm", "vlm", "vla", "robot-foundation-model"],
	pages: [
		{
			slug: "",
			file: "index.md",
			label: "Landing",
			title: "언어 모델은 어떻게 로봇을 움직이게 되었나",
			description:
				"LLM 기반 계획에서 VLM grounding, VLA action model, 그리고 안전한 로봇 시스템 설계까지",
			order: -1,
			kind: "landing",
		},
		{
			slug: "intro",
			file: "intro.md",
			label: "00",
			title: "프롤로그: 왜 LLM/VLM/VLA를 로봇에 붙이는가",
			description:
				"LLM, VLM, VLA를 로봇 시스템에 붙일 때의 큰 그림과 안전한 인터페이스 원칙",
			order: 0,
			kind: "chapter",
		},
		{
			slug: "language-conditioned-policy",
			file: "language-conditioned-policy.md",
			label: "01",
			title: "LLM 이전: 언어 조건 로봇 정책",
			description: "LLM planner 이전의 language-conditioned visuomotor policy 흐름",
			order: 1,
			kind: "chapter",
		},
		{
			slug: "llm-planner",
			file: "llm-planner.md",
			label: "02",
			title: "LLM as Planner: skill을 선택하는 언어 모델",
			description: "SayCan과 Inner Monologue를 중심으로 LLM 기반 로봇 planning 구조 정리",
			order: 2,
			kind: "chapter",
		},
		{
			slug: "llm-programs",
			file: "llm-programs.md",
			label: "03",
			title: "LLM as Program Generator: code와 API로 로봇을 다루기",
			description:
				"Code as Policies와 ProgPrompt를 중심으로 LLM이 로봇 프로그램을 생성하는 방식 정리",
			order: 3,
			kind: "chapter",
		},
		{
			slug: "vlm-grounding",
			file: "vlm-grounding.md",
			label: "04",
			title: "VLM Grounding: 보고, 찾고, 좌표로 연결하기",
			description:
				"VLM이 장면 이해, affordance, keypoint, 3D value map을 통해 로봇 행동과 연결되는 방식",
			order: 4,
			kind: "chapter",
		},
		{
			slug: "vla-models",
			file: "vla-models.md",
			label: "05",
			title: "VLA의 등장: image+language에서 action으로",
			description:
				"RT-1, RT-2, Open X-Embodiment, OpenVLA, Octo, SmolVLA를 중심으로 VLA 구조 정리",
			order: 5,
			kind: "chapter",
		},
		{
			slug: "robot-foundation-models",
			file: "robot-foundation-models.md",
			label: "06",
			title: "최신 Robot Foundation Model: diffusion, flow, humanoid",
			description: "π0, π0.7, RDT-1B, Gemini Robotics, GR00T, Helix 등 최신 프로젝트 정리",
			order: 6,
			kind: "chapter",
		},
		{
			slug: "data-tooling",
			file: "data-tooling.md",
			label: "07",
			title: "데이터와 툴체인: VLA 성능을 만드는 실제 파이프라인",
			description:
				"ALOHA, Mobile ALOHA, DROID, LeRobot을 중심으로 데이터 수집과 학습 파이프라인 정리",
			order: 7,
			kind: "chapter",
		},
		{
			slug: "safe-system-design",
			file: "safe-system-design.md",
			label: "08",
			title: "안전한 시스템 설계: 문자열을 로봇 명령으로 바꾸는 법",
			description: "LLM/VLM/VLA 출력에서 실제 robot controller 입력까지의 validation pipeline",
			order: 8,
			kind: "chapter",
		},
		{
			slug: "inguslab-sdl-roadmap",
			file: "inguslab-sdl-roadmap.md",
			label: "09",
			title: "Ingus Lab/SDL 적용 로드맵",
			description: "실험 자동화 로봇에 LLM/VLM/VLA를 안전하게 적용하기 위한 단계별 전략",
			order: 9,
			kind: "chapter",
		},
		{
			slug: "glossary",
			file: "glossary.md",
			label: "Glossary",
			title: "용어집: LLM/VLM/VLA Robotics",
			description: "LLM, VLM, VLA, robot foundation model 관련 핵심 용어",
			order: 10,
			kind: "appendix",
		},
		{
			slug: "references",
			file: "references.md",
			label: "Sources",
			title: "참고문헌",
			description: "언어 모델과 로봇 시스템 관련 참고문헌",
			order: 11,
			kind: "appendix",
		},
	],
};

export const conceptBooks = [llmVlmVlaRoboticsBook];

export function getConceptBookPageHref(book: ConceptBook, page: ConceptBookPage) {
	return page.slug ? `${book.href}${page.slug}/` : book.href;
}
