---
title: "최신 Robot Foundation Model: diffusion, flow, humanoid"
description: "π0, π0.7, RDT-1B, Gemini Robotics, GR00T, Helix 등 최신 프로젝트 정리"
slug: "llm-vlm-vla-robotics/robot-foundation-models"
date: "2026-05-19"
draft: false
order: 6
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 6장. 최신 Robot Foundation Model: diffusion, flow, humanoid

2024년 이후의 흐름은 단순히 “VLA를 만들었다”에서 끝나지 않습니다. 최신 연구와 산업 프로젝트는 **robot foundation model**이라는 더 큰 방향으로 가고 있습니다. 여기에는 VLA action model, diffusion/flow 기반 continuous control, multi-embodiment data, humanoid, memory, safety, online adaptation이 함께 들어갑니다.

## 6.1 π0: VLM 위에 flow matching action model을 올리다

π0는 pretrained VLM 위에 flow matching architecture를 얹어 general robot control을 수행하는 VLA입니다. 이 접근은 인터넷 규모 semantic knowledge를 가진 VLM을 기반으로 하면서, 로봇 action은 continuous flow model로 생성하려는 방향입니다. [Black et al. (2024), π0](https://arxiv.org/abs/2410.24164)

이 구조가 중요한 이유는 RT-2/OpenVLA처럼 action을 token으로만 보는 방식과 다르게, continuous action distribution을 직접 다루려 한다는 점입니다. 정밀 조작, dexterous manipulation, high-frequency action에서는 continuous distribution이 더 자연스러울 수 있습니다.

## 6.2 π0.7: steerable generalist robotic foundation model

2026년 4월 공개된 π0.7은 language command뿐 아니라 task performance metadata, subgoal image 같은 다양한 multimodal context conditioning을 prompt에 포함해 모델 행동을 steer하는 방향을 제안했습니다. 논문은 unseen environments, multi-stage tasks, cross-embodiment generalization, dexterous tasks에서 strong out-of-the-box performance를 목표로 한다고 설명합니다. [Physical Intelligence et al. (2026), π0.7](https://arxiv.org/abs/2604.15483)

시스템적으로는 다음 변화가 중요합니다.

```text
기존 VLA:
    instruction + image → action

π0.7류:
    instruction + image + subgoal + metadata + strategy context → action
```

즉, 최신 모델은 “무엇을 할지”뿐 아니라 “어떤 전략으로 할지”를 prompt와 context로 조절하려고 합니다.

## 6.3 RDT-1B: diffusion transformer와 bimanual manipulation

RDT-1B는 diffusion-based foundation model로, bimanual manipulation을 주요 대상으로 합니다. 논문은 multi-modal input, high-frequency robot data, heterogeneous action space를 다루기 위해 Robotics Diffusion Transformer를 제안하고, 1M+ multi-robot episodes와 6K+ ALOHA dual-arm fine-tuning data를 활용했다고 설명합니다. [Liu et al. (2024), RDT-1B](https://arxiv.org/abs/2410.07864)

RDT 계열은 VLA가 항상 autoregressive token prediction이어야 하는 것은 아니라는 점을 보여줍니다. 로봇 action은 본질적으로 continuous, multi-modal, temporally correlated하기 때문에 diffusion/flow 계열이 잘 맞는 경우가 많습니다.

## 6.4 Gemini Robotics와 Gemini Robotics-ER

Google DeepMind의 Gemini Robotics는 Gemini 기반 모델을 physical action까지 확장한 VLA 계열로 소개되었습니다. 반면 Gemini Robotics-ER은 visual/spatial understanding, task planning, success detection 등 embodied reasoning에 초점을 둔 VLM/ER 모델입니다. [Google DeepMind (2025), Gemini Robotics](https://arxiv.org/html/2503.20020v1) [Google DeepMind (2026), Gemini Robotics-ER 1.6](https://deepmind.google/blog/gemini-robotics-er-1-6/)

실무적으로는 이 구분이 중요합니다.

```text
Gemini Robotics:
    visual information + instruction → motor command

Gemini Robotics-ER:
    physical-world reasoning, planning, inspection, tool calling
```

따라서 실험 자동화 환경에서는 Gemini Robotics-ER 같은 모델을 먼저 inspection/planning/safety layer로 쓰고, 실제 motion은 기존 controller가 담당하게 하는 방식이 더 안전합니다.

## 6.5 GR00T N1: humanoid용 dual-system VLA

NVIDIA GR00T N1은 humanoid robot을 위한 open foundation model입니다. 논문은 GR00T N1을 dual-system VLA로 설명합니다. vision-language module, 즉 System 2가 환경과 instruction을 해석하고, diffusion transformer module, 즉 System 1이 real-time motor action을 생성합니다. [NVIDIA et al. (2025), GR00T N1](https://arxiv.org/abs/2503.14734)

이 구조는 최신 로봇 모델의 큰 방향을 잘 보여줍니다.

```text
느리지만 의미를 잘 이해하는 reasoning/perception module
+
빠르고 연속적인 motor action module
```

사람의 인지 시스템처럼, high-level reasoning과 low-level action generation을 분리하되 end-to-end로 연결하려는 흐름입니다.

## 6.6 Helix: humanoid upper-body continuous control

Figure AI의 Helix는 humanoid를 위한 generalist VLA로 소개되었습니다. Figure는 Helix가 perception, language understanding, learned control을 통합하고, wrists, torso, head, individual fingers까지 포함하는 full-upper-body high-rate continuous control을 출력한다고 설명합니다. [Figure AI (2025), Helix](https://www.figure.ai/news/helix)

다만 Helix는 공개 논문보다 회사의 기술 소개 성격이 강하므로, 재현 가능한 연구 자료로는 OpenVLA, Octo, SmolVLA, LeRobot, openpi 계열이 더 접근하기 쉽습니다. 산업 프로젝트는 방향성을 이해하는 데 유용하지만, 구현 참고는 공개 코드와 데이터가 있는 프로젝트를 우선하는 것이 좋습니다.

## 6.7 산업 적용 관점의 냉정한 평가

2026년 기준으로도 robot foundation model의 산업 적용은 아직 초기 단계입니다. 산업용 control에서는 실시간성, 안전성, 반복 정밀도, 장비 interlock, 검증 가능성, 감사 가능성이 중요합니다. 2026년 survey는 industrial robotic foundation model의 maturity가 아직 제한적이며, isolated benchmark success보다 safety, real-time feasibility, robust perception, auditable deployment stack이 중요하다고 평가합니다. [Kube et al. (2026), Robotic Foundation Models for Industrial Control](https://arxiv.org/abs/2603.06749)

따라서 실제 시스템에는 다음 원칙이 필요합니다.

```text
1. 모델은 proposal을 낸다.
2. validator가 허가한다.
3. controller가 실행한다.
4. safety monitor가 감시한다.
5. logger가 기록한다.
6. 실패 데이터가 다음 학습으로 들어간다.
```

## 6.8 이 장의 핵심 정리

```text
최신 흐름:
    VLA → robot foundation model → agentic embodied system

주요 기술:
    action token, diffusion, flow matching, dual-system architecture, context conditioning

현실적 결론:
    최신 모델도 안전한 시스템 스택 없이는 실제 장비 제어에 바로 투입하기 어렵다.
```
