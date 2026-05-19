export interface ConceptBookMediaItem {
	title: string;
	paperUrl: string;
	sourceUrl: string;
	imageUrl?: string;
	imageAlt?: string;
	youtubeId?: string;
	videoUrl?: string;
	note?: string;
}

export const llmVlmVlaRoboticsMedia: Record<string, ConceptBookMediaItem[]> = {
	"language-conditioned-policy": [
		{
			title: "Language-Conditioned Imitation Learning for Robot Manipulation Tasks",
			paperUrl: "https://arxiv.org/abs/2010.12083",
			sourceUrl: "https://simonstepputtis.com/publication/neurips2020/",
			imageUrl: "https://img.youtube.com/vi/k6DUkuT5SjY/hqdefault.jpg",
			imageAlt: "Language-conditioned imitation learning demonstration thumbnail",
			youtubeId: "k6DUkuT5SjY",
		},
		{
			title: "CLIPort: What and Where Pathways for Robotic Manipulation",
			paperUrl: "https://arxiv.org/abs/2109.12098",
			sourceUrl: "https://cliport.github.io/",
			imageUrl: "https://cliport.github.io/media/images/affordances.png",
			imageAlt: "CLIPort affordance prediction examples",
			youtubeId: "UdzoagBgWTA",
		},
		{
			title: "PerAct: Perceiver-Actor",
			paperUrl: "https://arxiv.org/abs/2209.05451",
			sourceUrl: "https://peract.github.io/",
			imageUrl: "https://peract.github.io/media/figures/arch.png",
			imageAlt: "PerAct architecture diagram",
			youtubeId: "TB0g52N-3_Y",
		},
	],
	"llm-planner": [
		{
			title: "SayCan: Do As I Can, Not As I Say",
			paperUrl: "https://arxiv.org/abs/2204.01691",
			sourceUrl: "https://say-can.github.io/",
			imageUrl: "https://img.youtube.com/vi/ysFav0b472w/hqdefault.jpg",
			imageAlt: "SayCan supplementary video thumbnail",
			youtubeId: "ysFav0b472w",
		},
		{
			title: "Inner Monologue",
			paperUrl: "https://arxiv.org/abs/2207.05608",
			sourceUrl: "https://innermonologue.github.io/",
			imageUrl: "https://img.youtube.com/vi/0sJjdxn5kcI/hqdefault.jpg",
			imageAlt: "Inner Monologue supplementary video thumbnail",
			youtubeId: "0sJjdxn5kcI",
		},
	],
	"llm-programs": [
		{
			title: "Code as Policies",
			paperUrl: "https://arxiv.org/abs/2209.07753",
			sourceUrl: "https://code-as-policies.github.io/",
			imageUrl: "https://code-as-policies.github.io/img/share_image.png",
			imageAlt: "Code as Policies representative diagram",
			videoUrl: "https://code-as-policies.github.io/",
			note: "공식 페이지가 여러 데모 비디오를 직접 호스팅합니다.",
		},
		{
			title: "ProgPrompt",
			paperUrl: "https://arxiv.org/abs/2209.11302",
			sourceUrl: "https://progprompt.github.io/",
			videoUrl: "https://progprompt.github.io/",
			note: "공식 YouTube 임베드 대신 프로젝트 페이지 링크를 연결했습니다.",
		},
	],
	"vlm-grounding": [
		{
			title: "MOO: Open-World Object Manipulation",
			paperUrl: "https://arxiv.org/abs/2303.00905",
			sourceUrl: "https://robot-moo.github.io/",
			imageUrl: "https://robot-moo.github.io/img/figure1.png",
			imageAlt: "MOO open-world manipulation overview",
			youtubeId: "KyvHTbLRovI",
		},
		{
			title: "PaLM-E",
			paperUrl: "https://arxiv.org/abs/2303.03378",
			sourceUrl: "https://palm-e.github.io/",
			imageUrl: "https://palm-e.github.io/img/approach.png",
			imageAlt: "PaLM-E approach diagram",
			videoUrl: "https://palm-e.github.io/",
			note: "공식 페이지가 프로젝트 데모를 직접 제공합니다.",
		},
		{
			title: "VoxPoser",
			paperUrl: "https://arxiv.org/abs/2307.05973",
			sourceUrl: "https://voxposer.github.io/index.html",
			imageUrl: "https://voxposer.github.io/media/figures/method.jpg",
			imageAlt: "VoxPoser method diagram",
			youtubeId: "Yvn4eR05A3M",
		},
		{
			title: "MOKA",
			paperUrl: "https://arxiv.org/abs/2403.03174",
			sourceUrl: "https://moka-manipulation.github.io/",
			imageUrl: "https://moka-manipulation.github.io/images/model.png",
			imageAlt: "MOKA mark-based visual prompting overview",
			youtubeId: "L571UpVYenE",
		},
	],
	"vla-models": [
		{
			title: "RT-1",
			paperUrl: "https://arxiv.org/abs/2212.06817",
			sourceUrl: "https://robotics-transformer1.github.io/",
			imageUrl: "https://robotics-transformer1.github.io/img/rt1_teaser.png",
			imageAlt: "RT-1 teaser figure",
			youtubeId: "UuKAp9a6wMs",
		},
		{
			title: "RT-2",
			paperUrl: "https://arxiv.org/abs/2307.15818",
			sourceUrl: "https://robotics-transformer2.github.io/",
			imageUrl: "https://robotics-transformer2.github.io/img/fig1.png",
			imageAlt: "RT-2 vision-language-action overview",
			videoUrl: "https://robotics-transformer2.github.io/",
			note: "공식 페이지의 Demo/Videos 섹션을 연결했습니다.",
		},
		{
			title: "Open X-Embodiment / RT-X",
			paperUrl: "https://arxiv.org/abs/2310.08864",
			sourceUrl: "https://robotics-transformer-x.github.io/",
			imageUrl: "https://robotics-transformer-x.github.io/img/logos.png",
			imageAlt: "Open X-Embodiment collaboration logos",
			videoUrl: "https://robotics-transformer-x.github.io/",
			note: "공식 페이지가 로봇별 rollout 비디오를 직접 제공합니다.",
		},
		{
			title: "Octo",
			paperUrl: "https://arxiv.org/abs/2405.12213",
			sourceUrl: "https://octo-models.github.io/",
			videoUrl: "https://octo-models.github.io/",
			note: "공식 페이지의 rollout 미디어와 코드 링크를 연결했습니다.",
		},
		{
			title: "OpenVLA",
			paperUrl: "https://arxiv.org/abs/2406.09246",
			sourceUrl: "https://openvla.github.io/",
			imageUrl: "https://openvla.github.io/static/images/openvla_teaser.jpg",
			imageAlt: "OpenVLA teaser figure",
			videoUrl: "https://openvla.github.io/",
			note: "공식 페이지가 rollout 비디오를 직접 제공합니다.",
		},
		{
			title: "SmolVLA",
			paperUrl: "https://arxiv.org/abs/2506.01844",
			sourceUrl: "https://smolvla.net/index_en.html",
			videoUrl: "https://smolvla.net/index_en.html",
			note: "공식 페이지의 YouTube demo 영역을 연결했습니다.",
		},
	],
	"robot-foundation-models": [
		{
			title: "π0",
			paperUrl: "https://arxiv.org/abs/2410.24164",
			sourceUrl: "https://www.physicalintelligence.company/blog/pi0",
			videoUrl: "https://www.physicalintelligence.company/blog/pi0",
			note: "Physical Intelligence 공식 글의 demo media를 연결했습니다.",
		},
		{
			title: "π0.7",
			paperUrl: "https://arxiv.org/abs/2604.15483",
			sourceUrl: "https://www.physicalintelligence.company/blog/pi07",
			videoUrl: "https://www.physicalintelligence.company/blog/pi07",
			note: "Physical Intelligence 공식 글의 demo media를 연결했습니다.",
		},
		{
			title: "RDT-1B",
			paperUrl: "https://arxiv.org/abs/2410.07864",
			sourceUrl: "https://rdt-robotics.github.io/",
			videoUrl: "https://rdt-robotics.github.io/",
			note: "공식 프로젝트 페이지 링크를 연결했습니다.",
		},
		{
			title: "Gemini Robotics",
			paperUrl: "https://arxiv.org/html/2503.20020v1",
			sourceUrl: "https://deepmind.google/discover/blog/gemini-robotics-brings-ai-into-the-physical-world/",
			imageUrl: "https://img.youtube.com/vi/4MvGnmmP3c0/hqdefault.jpg",
			imageAlt: "Gemini Robotics video thumbnail",
			youtubeId: "4MvGnmmP3c0",
		},
		{
			title: "GR00T N1",
			paperUrl: "https://arxiv.org/abs/2503.14734",
			sourceUrl: "https://research.nvidia.com/labs/lpr/publication/gr00tn1_2025/",
			videoUrl: "https://developer.nvidia.com/project-gr00t",
			note: "NVIDIA 공식 연구/개발자 페이지를 연결했습니다.",
		},
		{
			title: "Helix",
			paperUrl: "https://www.figure.ai/news/helix",
			sourceUrl: "https://www.figure.ai/news/helix",
			videoUrl: "https://www.figure.ai/news/helix",
			note: "Figure AI 공식 기술 소개와 데모 미디어를 연결했습니다.",
		},
	],
	"data-tooling": [
		{
			title: "ALOHA / ACT",
			paperUrl: "https://arxiv.org/abs/2304.13705",
			sourceUrl: "https://tonyzhaozh.github.io/aloha/",
			videoUrl: "https://tonyzhaozh.github.io/aloha/",
			note: "공식 프로젝트 페이지의 task demo media를 연결했습니다.",
		},
		{
			title: "Mobile ALOHA",
			paperUrl: "https://arxiv.org/abs/2401.02117",
			sourceUrl: "https://mobile-aloha.github.io/",
			videoUrl: "https://mobile-aloha.github.io/",
			note: "공식 프로젝트 페이지의 mobile manipulation demo media를 연결했습니다.",
		},
		{
			title: "DROID",
			paperUrl: "https://arxiv.org/abs/2403.12945",
			sourceUrl: "https://droid-dataset.github.io/",
			videoUrl: "https://droid-dataset.github.io/",
			note: "공식 데이터셋 페이지를 연결했습니다.",
		},
		{
			title: "LeRobot",
			paperUrl: "https://arxiv.org/abs/2602.22818",
			sourceUrl: "https://github.com/huggingface/lerobot",
			videoUrl: "https://huggingface.co/lerobot",
			note: "Hugging Face LeRobot 프로젝트와 모델/데이터 허브를 연결했습니다.",
		},
	],
	"safe-system-design": [
		{
			title: "ASIMOV Benchmark",
			paperUrl: "https://arxiv.org/abs/2503.08663",
			sourceUrl: "https://asimov-benchmark.github.io/",
			videoUrl: "https://asimov-benchmark.github.io/",
			note: "공식 benchmark/project page를 연결했습니다.",
		},
	],
};
