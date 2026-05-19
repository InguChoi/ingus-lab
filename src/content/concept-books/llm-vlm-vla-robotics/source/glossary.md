---
title: "용어집: LLM/VLM/VLA Robotics"
description: "LLM, VLM, VLA, robot foundation model 관련 핵심 용어"
slug: "llm-vlm-vla-robotics/glossary"
date: "2026-05-19"
draft: false
order: 10
---

# 용어집

## A

### Action Chunk
한 번에 하나의 action을 예측하지 않고, 짧은 미래 구간의 action sequence를 묶어서 예측하는 방식입니다. ACT, SmolVLA, 여러 VLA/IL 계열에서 temporal consistency와 inference efficiency를 위해 사용됩니다.

### Affordance
현재 환경에서 특정 행동이 가능한 정도입니다. 예를 들어 컵이 보이고 gripper가 접근 가능하면 `pick(cup)` affordance가 높습니다.

## C

### Code as Policies
LLM이 자연어 명령을 Python-like policy code로 변환하고, 그 code가 perception API와 control primitive를 호출하는 방식입니다.

### Command Validator
LLM/VLM/VLA가 제안한 명령을 schema, allowlist, range, state, IK, collision, safety 기준으로 검사하는 모듈입니다.

## D

### Diffusion Policy
로봇 action을 확률적 생성 모델로 다루는 policy 계열입니다. multi-modal continuous action distribution을 표현하는 데 강점이 있습니다.

## E

### Embodied Reasoning
물리 세계에서의 물체, 공간, 상태, 작업 절차, 안전 조건을 함께 고려하는 추론입니다.

## F

### Flow Matching
연속 action distribution을 생성하기 위한 generative modeling 방식입니다. π0, SmolVLA, 일부 최신 VLA/RFM 계열에서 action generation에 사용됩니다.

## J

### Joint Space
로봇의 각 관절 좌표계입니다. `q`, `dq`, torque 등이 여기에 속합니다. LLM/VLM이 직접 출력하기에는 위험하므로 보통 controller 내부에서 다룹니다.

## L

### LLM as Planner
LLM이 로봇의 low-level 제어를 직접 하지 않고, high-level skill sequence 또는 task plan을 생성하는 구조입니다.

## R

### Robot Foundation Model
다양한 로봇, 작업, 환경 데이터로 학습되어 여러 task와 embodiment에 일반화하려는 대규모 로봇 모델입니다.

## S

### Skill Library
로봇이 안전하게 실행할 수 있는 동작 primitive의 목록입니다. 예: `pick_vial`, `place_vial`, `align_to_hole`, `insert_with_force_limit`.

### Structured Output
모델 출력이 자유 문장이 아니라 JSON schema, DSL, API call 형태로 제한되는 방식입니다.

## T

### Task Space
end-effector pose, object pose, workspace coordinate처럼 작업 공간에서 표현되는 좌표계입니다. VLM/VLA와 motion planner 사이의 중간 표현으로 자주 쓰입니다.

## V

### VLA
Vision-Language-Action model. 이미지, 언어, 로봇 상태를 입력으로 받아 action을 출력하는 모델 계열입니다.

### VLM
Vision-Language Model. 이미지와 텍스트를 함께 입력받아 scene understanding, visual question answering, spatial reasoning 등을 수행하는 모델입니다.
