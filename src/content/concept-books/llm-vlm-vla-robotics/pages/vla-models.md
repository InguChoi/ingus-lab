---
title: "VLA의 등장: image+language에서 action으로"
description: "RT-1, RT-2, Open X-Embodiment, OpenVLA, Octo, SmolVLA를 중심으로 VLA 구조 정리"
slug: "llm-vlm-vla-robotics/vla-models"
date: "2026-05-19"
draft: false
order: 5
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---

VLA, 즉 Vision-Language-Action model은 이미지와 언어를 보고 로봇 action을 직접 예측하는 모델 계열입니다. 기존 LLM/VLM 기반 시스템이 planner, perception, controller를 분리했다면, VLA는 이 과정을 하나의 학습된 policy로 통합하려고 합니다.

![VLA policy 구조](/concept-books/llm-vlm-vla-robotics/figures/fig04_vla_policy.svg)

## 5.1 RT-1: real-world robot data로 Transformer policy를 키우다

RT-1은 대규모 real-world robot data로 multi-task robot policy를 학습하는 흐름을 대표합니다. RT-1은 language instruction과 image observation을 입력으로 받아 robot action을 출력하는 Robotics Transformer 계열 모델입니다. 핵심 메시지는 “로봇에서도 data size, model size, data diversity가 generalization에 중요하다”는 것이었습니다. [Brohan et al. (2022), RT-1](https://arxiv.org/abs/2212.06817)

RT-1은 엄밀히 말해 web-scale VLM을 action model로 전환한 RT-2와는 다르지만, generalist robot policy의 중요한 시작점입니다.

## 5.2 RT-2: action을 text token처럼 표현하다

RT-2는 VLA라는 표현을 널리 알린 대표 연구입니다. RT-2는 vision-language model을 web-scale vision-language task와 robot trajectory data에 함께 fine-tuning했고, robot action을 text token처럼 표현했습니다. [Brohan et al. (2023), RT-2](https://arxiv.org/abs/2307.15818)

```text
Input:
    image + language instruction

Model:
    VLM backbone

Output:
    action tokens

Post-process:
    tokens → robot action
```

이 구조가 중요한 이유는 VLM의 semantic knowledge를 robot control로 전이하려 했기 때문입니다. 예를 들어 “가장 작은 물체를 집어라”, “피곤한 사람에게 적절한 음료를 가져와라” 같은 명령은 단순한 object label matching을 넘어 semantic reasoning을 요구합니다.

하지만 RT-2는 “일반 VLM에게 joint command를 물어본 것”이 아닙니다. 로봇 trajectory data로 fine-tuning되고, action token format으로 학습되었기 때문에 가능한 구조입니다.

## 5.3 Open X-Embodiment와 RT-X: 데이터가 곧 확장성이다

VLA가 일반화되려면 다양한 로봇, 다양한 환경, 다양한 작업의 데이터가 필요합니다. Open X-Embodiment는 여러 기관의 robot datasets를 통합해 1M+ real robot trajectories와 22개 robot embodiments를 포함하는 대규모 데이터셋을 구성했습니다. [O'Neill et al. (2023/2024), Open X-Embodiment / RT-X](https://arxiv.org/abs/2310.08864)

이 흐름의 핵심은 cross-embodiment learning입니다.

```text
한 로봇 데이터만 학습:
    특정 embodiment와 workspace에 과적합

여러 로봇 데이터로 학습:
    공통 physical pattern과 task structure를 학습할 가능성 증가
```

RT-X는 이런 통합 데이터셋을 기반으로 여러 robot embodiment에서 positive transfer를 보이려는 방향입니다.

## 5.4 OpenVLA: open-source VLA

OpenVLA는 7B parameter open-source VLA로, 970k real-world robot demonstration에서 학습되었습니다. 기존 VLA들이 대부분 closed model이어서 연구자가 직접 적용하기 어려웠던 문제를 줄이고, efficient fine-tuning까지 다루려는 시도입니다. [Kim et al. (2024), OpenVLA](https://arxiv.org/abs/2406.09246)

OpenVLA의 의미는 다음입니다.

```text
- 공개된 VLA backbone
- real-world robot demonstration 기반 학습
- 새로운 로봇/작업에 fine-tuning 가능성
- 연구자가 재현 가능한 VLA 실험 기반 제공
```

## 5.5 Octo: open-source generalist robot policy

Octo는 Open X-Embodiment에서 가져온 800k trajectories로 pretrained된 transformer-based diffusion policy입니다. 언어 명령 또는 goal image로 지시할 수 있고, 새로운 observation/action space로 fine-tuning할 수 있도록 설계되었습니다. [Octo Model Team et al. (2024), Octo](https://arxiv.org/abs/2405.12213)

Octo의 장점은 “처음부터 모든 것을 학습하지 않고, generalist policy initialization을 가져와 내 로봇에 fine-tuning한다”는 실용적 접근입니다.

## 5.6 SmolVLA: 작고 접근 가능한 VLA

SmolVLA는 450M parameter 규모의 compact open-source VLA입니다. 이 모델은 기존 VLA가 너무 크고 비용이 높다는 문제를 줄이기 위해, consumer-grade hardware에서도 deploy 가능한 효율성을 목표로 했습니다. 또한 asynchronous inference stack을 통해 action prediction과 execution을 분리해 control responsiveness를 높이는 방향을 제시했습니다. [Shukor et al. (2025), SmolVLA](https://arxiv.org/abs/2506.01844)

실험실이나 개인 프로젝트 관점에서는 SmolVLA가 중요합니다. 큰 기업 모델을 바로 사용할 수 없는 상황에서, 작고 공개된 모델로 VLA pipeline을 실험할 수 있기 때문입니다.

## 5.7 Action representation

VLA에서 가장 중요한 설계 중 하나는 action representation입니다.

| 표현 | 예시 | 장점 | 주의점 |
|---|---|---|---|
| Skill token | `pick(vial)` | 안전하고 해석 가능 | skill library 필요 |
| Task-space delta | `Δx, Δy, Δz, Δr, gripper` | embodiment 차이를 줄이기 좋음 | 좌표계/캘리브레이션 중요 |
| Joint action | `q_target`, `dq` | low-level 직접 제어 가능 | 특정 로봇에 강하게 묶임 |
| Action token | RT-2/OpenVLA류 | language model 구조와 결합 쉬움 | 연속 제어 정밀도 손실 가능 |
| Diffusion/Flow action | Octo/π0류 | multi-modal continuous action 표현에 강함 | 추론/안정성/제어주기 설계 필요 |

## 5.8 이 장의 핵심 정리

```text
VLA의 핵심:
    image + language + robot state → action

중요한 변화:
    VLM의 semantic knowledge를 robot action prediction에 직접 연결

주의:
    VLA도 safety filter, controller, calibration, logging이 필요하다.
```
