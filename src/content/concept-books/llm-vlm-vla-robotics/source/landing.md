---
title: "언어 모델은 어떻게 로봇을 움직이게 되었나"
description: "LLM 기반 계획에서 VLM grounding, VLA action model, 그리고 안전한 로봇 시스템 설계까지"
slug: "llm-vlm-vla-robotics"
date: "2026-05-19"
draft: false
tags: ["Robotics", "LLM", "VLM", "VLA"]
---

# 언어 모델은 어떻게 로봇을 움직이게 되었나

**LLM 기반 계획에서 VLM grounding, VLA action model, 그리고 안전한 로봇 시스템 설계까지**

이 책은 LLM, VLM, VLA를 로봇 시스템에 적용하는 연구 흐름과 실제 구현 구조를 정리합니다. 핵심 관점은 단순합니다.

> 언어 모델이 로봇 controller를 대체하는 것이 아니라, 언어·시각·행동 모델을 안전한 로봇 시스템 스택 안에 어떻게 배치할지 설계해야 합니다.

![LLM/VLM/VLA 로봇 시스템의 진화](../assets/figures/fig01_evolution_timeline.svg)

## 목차

1. LLM 이전: 언어 조건 로봇 정책
2. LLM as Planner: skill을 선택하는 언어 모델
3. LLM as Program Generator: code와 API로 로봇을 다루기
4. VLM Grounding: 보고, 찾고, 좌표로 연결하기
5. VLA의 등장: image+language에서 action으로
6. 최신 Robot Foundation Model: diffusion, flow, humanoid
7. 데이터와 툴체인: VLA 성능을 만드는 실제 파이프라인
8. 안전한 시스템 설계: 문자열을 로봇 명령으로 바꾸는 법
9. Ingus Lab/SDL 적용 로드맵

## 핵심 메시지

```text
LLM:
    작업 순서와 recovery를 제안한다.

VLM:
    장면 상태와 위험을 판단한다.

VLA:
    action proposal을 만든다.

Controller:
    실제 motion을 책임진다.

Safety layer:
    실행 허가권을 가진다.
```
