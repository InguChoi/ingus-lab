---
title: "프롤로그: 왜 LLM/VLM/VLA를 로봇에 붙이는가"
description: "LLM, VLM, VLA를 로봇 시스템에 붙일 때의 큰 그림과 안전한 인터페이스 원칙"
slug: "llm-vlm-vla-robotics/intro"
date: "2026-05-19"
draft: false
order: 0
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---

로봇은 원래부터 “언어”와 잘 맞는 시스템이 아니었습니다. 로봇은 관절각, 속도, 힘, 좌표계, 센서 프레임, 충돌 조건, 장비 interlock 같은 물리적 제약 안에서 움직입니다. 반면 LLM은 문장과 지식을 다루고, VLM은 이미지와 언어를 함께 다루고, VLA는 이미지·언어·상태로부터 action을 직접 예측하려고 합니다.

따라서 이 책의 핵심 질문은 하나입니다.

> **언어 모델의 출력을 어떻게 물리적으로 안전하고 실행 가능한 로봇 입력으로 바꿀 것인가?**

초기 연구의 답은 명확했습니다. LLM에게 바로 joint command를 만들게 하지 않았습니다. 대신 LLM은 “무엇을 해야 하는지”를 고르고, 로봇의 기존 skill, motion planner, controller가 “어떻게 움직일지”를 담당했습니다. 대표적으로 SayCan은 LLM의 언어적 적절성과 로봇 skill의 affordance를 곱해 다음 행동을 선택했습니다. 이 연구는 “LLM이 그럴듯한 말을 하는 것”과 “로봇이 실제로 할 수 있는 것”을 분리한 것이 중요합니다. [Ahn et al. (2022), Do As I Can, Not As I Say / SayCan](https://arxiv.org/abs/2204.01691)

![LLM/VLM/VLA 로봇 시스템의 진화](/concept-books/llm-vlm-vla-robotics/figures/fig01_evolution_timeline.svg)

VLM이 들어오면서 로봇은 단순히 명령을 읽는 것이 아니라, 장면을 보고 물체, 상태, 위험, 정렬 여부를 판단할 수 있게 되었습니다. PaLM-E는 시각, 연속 상태 추정, 텍스트 입력을 하나의 embodied multimodal language model 안에 넣으려 했고, VoxPoser는 LLM/VLM을 이용해 3D value map을 만들고 이를 motion planner가 사용하게 했습니다. [Driess et al. (2023), PaLM-E](https://arxiv.org/abs/2303.03378) [Huang et al. (2023), VoxPoser](https://arxiv.org/abs/2307.05973)

VLA는 한 단계 더 나아가 이미지와 언어에서 로봇 action을 직접 예측합니다. RT-2는 robot action을 text token처럼 표현해서 VLM을 로봇 trajectory data와 함께 fine-tuning했고, OpenVLA는 970k real-world robot demonstration으로 학습한 7B open-source VLA를 제안했습니다. [Brohan et al. (2023), RT-2](https://arxiv.org/abs/2307.15818) [Kim et al. (2024), OpenVLA](https://arxiv.org/abs/2406.09246)

하지만 중요한 점은 바뀌지 않습니다.

> **VLA가 등장했다고 해서 safety filter, controller, calibration, data pipeline이 사라지는 것은 아닙니다.**

오히려 최신 시스템은 모델 하나가 아니라, reasoning model, action model, safety layer, memory, dataset, simulator, logging pipeline이 결합된 형태로 발전하고 있습니다. GR00T N1은 vision-language module과 diffusion transformer action module의 dual-system 구조를 사용하고, π0는 pretrained VLM 위에 flow matching 기반 action model을 올리는 방향을 제시했습니다. [NVIDIA et al. (2025), GR00T N1](https://arxiv.org/abs/2503.14734) [Black et al. (2024), π0](https://arxiv.org/abs/2410.24164)

이 책은 다음 순서로 읽으시면 됩니다.

1. **LLM 이전**: 언어 조건 imitation learning은 어떤 문제를 풀었는가?
2. **LLM planner**: LLM은 왜 skill selector로 먼저 쓰였는가?
3. **LLM program**: 자연어를 code/API 호출로 바꾸면 무엇이 좋아지는가?
4. **VLM grounding**: VLM의 시각 추론을 좌표계, keypoint, affordance로 어떻게 바꾸는가?
5. **VLA**: action token, diffusion, flow matching은 로봇 제어를 어떻게 바꾸었는가?
6. **시스템 설계**: 실제 로봇에서는 어떤 validation과 safety layer가 필요한가?

이 책의 관점은 연구 소개에만 머물지 않습니다. 목표는 `/concept/`에 배포할 수 있는 배경지식 글이면서, 동시에 실제 구현을 시작할 수 있는 시스템 설계 문서가 되는 것입니다.
