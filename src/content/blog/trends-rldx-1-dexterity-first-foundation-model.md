---
title: "RLDX-1: 로봇 손을 위한 Dexterity-First 모델"
description: "RLWRLD의 RLDX-1이 로봇 파운데이션 모델 경쟁에서 보여주는 새로운 방향을 정리합니다."
category: "trends"
pubDate: "May 11 2026"
heroImage: "/blog-placeholder-3.jpg"
---

RLWRLD가 공개한 [RLDX-1](https://www.rlwrld.ai/en/rldx-1)은 고자유도 로봇 손을 위한 dexterity-first 파운데이션 모델입니다. 기존 VLA(Vision-Language-Action) 모델이 시각과 언어 중심으로 일반화 능력을 키워왔다면, RLDX-1은 실제 산업 현장의 조작 과제에서 필요한 물리 신호를 모델 구조 안으로 끌어들입니다.

핵심 메시지는 단순합니다. 로봇이 컵을 잡고, 커피를 따르고, 컨베이어 위 물체를 집고, 손가락 끝으로 물체를 돌리려면 “무엇을 해야 하는가”만 알아서는 부족합니다. 언제 접촉했는지, 힘이 어떻게 변하는지, 물체가 얼마나 빨리 움직이는지, 이전 단계에서 무엇을 끝냈는지를 함께 기억해야 합니다.

## 왜 중요한가

로봇 파운데이션 모델의 주류 가정은 더 큰 모델과 더 많은 데이터가 dexterous manipulation까지 자연스럽게 열어줄 것이라는 쪽에 가까웠습니다. RLDX-1은 이 가정에 다른 질문을 던집니다. 픽셀에 들어 있지 않은 신호는 스케일만으로 복원할 수 없다는 것입니다.

예를 들어 커피포트가 점점 가벼워지는 변화는 이미지보다 손목 토크에 더 잘 나타납니다. 컨베이어 위 물체를 집는 일은 한 장의 이미지보다 시간에 따른 움직임을 봐야 합니다. 여러 단계의 작업은 현재 프레임만으로는 충분하지 않고, 이전 상태를 기억해야 합니다.

## 모델 구조의 신호

RLDX-1은 MSAT(Multi-Stream Action Transformer)를 사용해 vision-language, proprioception, action, memory, tactile, torque를 각각 별도 스트림으로 처리한 뒤 self-attention으로 상호작용하게 합니다. 하나의 큰 입력으로 뭉개기보다, 물리적으로 다른 성격의 신호를 독립적으로 보존하려는 설계입니다.

또한 Qwen3-VL 8B를 로봇 VQA 데이터로 fine-tuning한 RLDX-1-VLM을 시각 추론 백본으로 사용합니다. 일반 VLM이 장면을 잘 설명하는 것과, 로봇 제어에 필요한 접촉 위치와 중간 하위 작업을 이해하는 것은 다르다는 판단입니다.

RLDX-1의 또 다른 흥미로운 부분은 cognition token입니다. VLM의 풍부한 출력을 그대로 action model에 넘기지 않고 64개 cognition token으로 압축합니다. 이 표현은 추론 속도를 높이는 동시에, 과거 cognition feature를 저장하는 memory substrate로도 쓰입니다.

## 데이터 전략

RLDX-1은 실제 teleoperation만으로는 다섯 손가락 로봇 손의 조작 공간을 충분히 덮기 어렵다고 봅니다. 그래서 작은 실제 demonstration set에서 출발해 video generation model로 synthetic robot data를 늘리고, inverse dynamics model로 action label을 붙인 뒤 품질 필터를 통과시킵니다.

또 하나의 축은 human hand data입니다. 사람이 맨손으로 수행한 조작을 추적하고, 3D Gaussian Splatting으로 작업 공간을 복원한 뒤, robot hand로 retargeting합니다. 하드웨어 장치를 사람 손에 붙이는 방식보다 소프트웨어 retargeting으로 morphology gap을 줄이려는 접근입니다.

## 성능에서 볼 점

RLWRLD는 RLDX-1이 RoboCasa Kitchen에서 70.6, RoboCasa GR-1 Tabletop에서 58.7, RoboCasa 365에서 32.1을 기록했다고 설명합니다. 특히 RoboCasa 계열은 장기 과제와 접촉이 많은 kitchen-scale benchmark라서, 단순한 visual generalization보다 memory, contact, embodiment 설계가 더 잘 드러나는 영역입니다.

실제 로봇 평가에서도 ALLEX humanoid 기준 conveyor pick-and-place, object-in-box selection, pot-to-cup pouring에서 기존 VLA baseline 대비 큰 격차를 보였다고 제시합니다. DROID 환경에서는 mid-training을 거친 모델이 memory task와 sensory task에서 더 나은 결과를 냈습니다.

## Ingus Lab 메모

RLDX-1의 흥미로운 지점은 “로봇 모델도 결국 큰 멀티모달 모델이 된다”가 아니라, 어떤 모달리티를 모델 안에서 동등한 시민으로 대우할 것인가에 있습니다. vision-language는 여전히 중요하지만, 접촉과 힘, 시간, 기억은 물리 세계에서 행동하는 모델의 1차 신호입니다.

이 흐름은 로봇뿐 아니라 AI agent 설계에도 힌트를 줍니다. 웹이나 코드 환경의 agent도 화면만 보는 모델보다 로그, 상태, 실패 이력, 도구 실행 결과를 구조적으로 분리해서 다루는 쪽이 더 강해질 가능성이 큽니다. RLDX-1은 embodied AI 쪽 사례지만, 더 넓게 보면 “모델을 크게 만드는 일”에서 “상태와 신호를 어떻게 구조화할 것인가”로 관심이 이동하고 있다는 신호로 읽힙니다.

## Source

- RLWRLD, [RLDX-1: A Dexterity-First Foundation Model for Robot Hands](https://www.rlwrld.ai/en/rldx-1), 2026-05-07
