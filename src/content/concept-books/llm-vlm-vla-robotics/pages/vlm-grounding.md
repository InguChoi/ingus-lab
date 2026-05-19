---
title: "VLM Grounding: 보고, 찾고, 좌표로 연결하기"
description: "VLM이 장면 이해, affordance, keypoint, 3D value map을 통해 로봇 행동과 연결되는 방식"
slug: "llm-vlm-vla-robotics/vlm-grounding"
date: "2026-05-19"
draft: false
order: 4
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---

LLM은 텍스트 기반 추론에는 강하지만, 로봇이 실제로 보고 있는 장면을 직접 이해하지 못합니다. 그래서 VLM이 등장하면서 로봇 시스템은 이미지와 언어를 함께 사용해 object, affordance, keypoint, constraint, 위험 상황을 판단하기 시작했습니다.

![VLM grounding 구조](/concept-books/llm-vlm-vla-robotics/figures/fig03_vlm_grounding.svg)

## 4.1 VLM은 제어기가 아니라 grounding layer다

VLM을 로봇에 붙일 때 가장 안전한 역할은 다음입니다.

```text
- 물체가 있는가?
- 어떤 물체인가?
- 어느 부분을 잡아야 하는가?
- 목표 위치가 어디인가?
- 현재 상태가 성공/실패/위험 중 무엇인가?
- 다음 skill을 실행해도 되는가?
```

즉, VLM은 “상황 판단”과 “시각적 grounding”을 담당합니다. 실제 움직임은 motion planner, IK, visual servoing, impedance controller가 담당하는 편이 안전합니다.

## 4.2 MOO: pretrained VLM으로 open-world object를 찾다

MOO는 pretrained VLM이 가진 semantic knowledge를 robot policy에 연결하려 했습니다. 로봇이 직접 본 적 없는 object category라도, VLM이 이미지와 언어에서 object-identifying information을 추출하고, policy가 이를 활용해 open-world object manipulation을 수행하도록 설계했습니다. [Stone et al. (2023), Open-World Object Manipulation using Pre-trained VLMs / MOO](https://arxiv.org/abs/2303.00905)

이 연구의 시스템적 의미는 큽니다. 로봇 policy가 모든 물체를 직접 경험할 수는 없습니다. 따라서 인터넷 규모 이미지-언어 데이터에서 얻은 semantic knowledge를 perception 쪽에 활용하고, 실제 조작은 robot policy가 맡는 구조가 현실적입니다.

## 4.3 PaLM-E: embodied multimodal language model

PaLM-E는 visual input, continuous state estimation, text input을 하나의 embodied multimodal language model 안에 interleave하는 방향을 제안했습니다. 이 모델은 sequential robotic manipulation planning, VQA, captioning 등을 하나의 multimodal model로 다루며, 다양한 observation modality와 embodiment를 다루는 방향을 보였습니다. [Driess et al. (2023), PaLM-E](https://arxiv.org/abs/2303.03378)

PaLM-E의 핵심은 로봇 상태와 시각 관측을 언어 모델 내부로 직접 연결하려는 시도입니다. 즉, LLM이 text-only planner에서 embodied multimodal planner로 확장되는 중요한 지점입니다.

## 4.4 VoxPoser: LLM/VLM에서 3D value map으로

VoxPoser는 VLM grounding을 시스템적으로 매우 잘 보여주는 연구입니다. LLM/VLM이 affordance와 constraint를 추론하고, 이를 3D value map으로 구성합니다. 그 다음 model-based planner가 이 value map을 이용해 6-DoF end-effector waypoint trajectory를 생성합니다. [Huang et al. (2023), VoxPoser](https://arxiv.org/abs/2307.05973)

구조는 다음과 같습니다.

```text
Free-form instruction
    ↓
LLM infers affordances and constraints
    ↓
VLM grounds them in observation
    ↓
3D value maps
    ↓
Model-based planner
    ↓
6-DoF waypoint trajectory
```

이 구조가 중요한 이유는 VLM이 바로 robot action을 내지 않는다는 점입니다. VLM의 지식은 3D 공간상의 value/cost representation으로 바뀌고, 실제 trajectory는 planner가 만듭니다.

## 4.5 MOKA: mark-based visual prompting과 keypoint affordance

MOKA는 이미지 위에 candidate points, grids, captions 같은 mark를 올려 VLM이 keypoint affordance를 고르게 하는 방식입니다. VLM의 답변을 compact point-based representation으로 바꾸고, 이를 robot motion으로 연결합니다. [Liu et al. (2024), MOKA](https://arxiv.org/abs/2403.03174)

이 방식은 실험 자동화 로봇에도 잘 맞습니다. 예를 들어 vial tray의 hole, capping station의 center, smartcap 위치처럼 “정확히 어느 점을 기준으로 움직일지”가 중요한 경우, VLM이 자유롭게 문장으로 답하는 것보다 point/keypoint를 고르게 하는 편이 훨씬 실행 가능성이 높습니다.

## 4.6 Gemini Robotics-ER: embodied reasoning model

Google DeepMind의 Gemini Robotics-ER 계열은 VLA가 아니라, physical world understanding과 planning을 위한 embodied reasoning model에 가깝습니다. 2026년 4월 공개된 Gemini Robotics-ER 1.6은 공간 추론, multi-view understanding, task planning, success detection 같은 robotics-critical reasoning capability를 강조합니다. [Google DeepMind (2026), Gemini Robotics-ER 1.6](https://deepmind.google/blog/gemini-robotics-er-1-6/)

실무적으로는 이런 모델을 바로 motor command generator로 쓰기보다, 다음과 같이 쓰는 것이 안전합니다.

```text
VLM/ER model:
    "현재 장면에서 vial이 hole 중심에 정렬되어 있는가?"
    "장비 상태가 안전한가?"
    "다음 skill을 실행해도 되는가?"

Robot stack:
    visual servoing
    force-limited insertion
    collision checking
    device interlock
```

## 4.7 이 장의 핵심 정리

```text
VLM grounding의 핵심:
    이미지와 언어를 object, keypoint, affordance, constraint, 3D target으로 바꾼다.

좋은 설계:
    VLM → structured perception result → planner/controller

나쁜 설계:
    VLM의 자유 문장 → 바로 로봇 명령 실행
```
