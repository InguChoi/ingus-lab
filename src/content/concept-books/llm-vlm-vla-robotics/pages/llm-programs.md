---
title: "LLM as Program Generator: code와 API로 로봇을 다루기"
description: "Code as Policies와 ProgPrompt를 중심으로 LLM이 로봇 프로그램을 생성하는 방식 정리"
slug: "llm-vlm-vla-robotics/llm-programs"
date: "2026-05-19"
draft: false
order: 3
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---

LLM planner가 “다음 skill”을 고르는 방식이라면, 다음 흐름은 LLM이 **실행 가능한 프로그램**을 생성하는 방식입니다. 이때 LLM은 자연어 답변을 내는 것이 아니라, 로봇 시스템이 제공하는 API를 호출하는 code-like policy를 만듭니다.

## 3.1 Code as Policies

<div class="paper-media-inline">
  <a class="paper-media-thumb" href="https://code-as-policies.github.io/" target="_blank" rel="noreferrer">
    <img src="https://code-as-policies.github.io/img/share_image.png" alt="Code as Policies representative diagram" loading="lazy" />
  </a>
  <div class="paper-media-links">
    <strong>대표 미디어</strong>
    <a href="https://arxiv.org/abs/2209.07753" target="_blank" rel="noreferrer">Paper</a>
    <a href="https://code-as-policies.github.io/" target="_blank" rel="noreferrer">Project</a>
    <a href="https://code-as-policies.github.io/" target="_blank" rel="noreferrer">Demo</a>
  </div>
  <p class="paper-media-note">공식 프로젝트 페이지의 demo video 영역을 연결했습니다.</p>
</div>

Code as Policies는 LLM이 Python-like policy code를 생성하고, 이 코드가 perception output을 처리하거나 control primitive API를 호출하도록 설계했습니다. 중요한 점은 LLM이 직접 motor torque를 계산하는 것이 아니라, 이미 존재하는 controller, waypoint primitive, impedance primitive, perception API 등을 조합한다는 점입니다. [Liang et al. (2022), Code as Policies](https://arxiv.org/abs/2209.07753)

예시는 다음과 같은 방향입니다.

```python
objects = detect_objects()
target = objects["apple"]
bowl = objects["bowl"]

move_to_pose(pregrasp_pose(target))
close_gripper()
move_to_pose(place_pose(bowl))
open_gripper()
```

이 방식의 장점은 LLM이 공간적 계산, 조건문, 반복문, 함수 조합을 코드로 표현할 수 있다는 것입니다. 예를 들어 “조금 더 빠르게”, “가장 가까운 물체”, “왼쪽에 있는 물체” 같은 모호한 표현을 수치 계산이나 perception result 기반 로직으로 바꿀 수 있습니다.

## 3.2 ProgPrompt

<div class="paper-media-inline">
  <div class="paper-media-links">
    <strong>대표 미디어</strong>
    <a href="https://arxiv.org/abs/2209.11302" target="_blank" rel="noreferrer">Paper</a>
    <a href="https://progprompt.github.io/" target="_blank" rel="noreferrer">Project</a>
    <a href="https://progprompt.github.io/" target="_blank" rel="noreferrer">Demo</a>
  </div>
  <p class="paper-media-note">공식 프로젝트 페이지의 video/demo 영역을 연결했습니다.</p>
</div>

ProgPrompt는 LLM에게 available actions, objects, example programs를 prompt로 제공하고, situated task plan을 program-like 형태로 생성하도록 했습니다. 이 접근의 핵심은 LLM이 존재하지 않는 행동을 만들어내지 않도록, prompt 안에 로봇 capability와 환경 context를 명시하는 것입니다. [Singh et al. (2022), ProgPrompt](https://arxiv.org/abs/2209.11302)

```text
Available actions:
- open_gripper()
- close_gripper()
- move_to(object)
- pick(object)
- place(object, receptacle)

Known objects:
- cup
- plate
- spoon
```

이렇게 하면 LLM은 자유 문장보다 제한된 action space 안에서 계획을 생성합니다.

## 3.3 왜 code generation이 유용한가

로봇 작업에는 단순한 skill sequence만으로 표현하기 어려운 경우가 많습니다.

```text
- 물체가 보이지 않으면 다른 카메라로 확인
- grasp 실패 시 pose를 조금 바꿔 retry
- force threshold가 넘으면 즉시 후퇴
- object가 두 개 이상이면 가장 가까운 것 선택
- 특정 조건이 만족될 때까지 visual servoing 반복
```

이런 로직은 code 형태가 자연스럽습니다. LLM은 자연어 명령을 프로그램 구조로 바꿀 수 있기 때문에, 단순 plan보다 더 유연한 정책을 만들 수 있습니다.

## 3.4 그러나 code를 그대로 실행하면 위험하다

가장 중요한 위험은 다음입니다.

> LLM이 만든 코드는 그럴듯해 보여도, 안전하지 않거나 존재하지 않는 API를 호출할 수 있습니다.

따라서 code generation 방식에서는 다음이 필수입니다.

```text
1. 허용된 API만 호출 가능하게 한다.
2. sandbox에서 syntax/type check를 한다.
3. 실제 로봇 실행 전에 dry-run을 한다.
4. motion feasibility check를 한다.
5. collision/safety check를 한다.
6. 사람이 승인해야 하는 작업을 분리한다.
```

로봇에서는 “코드가 실행된다”가 곧 “물체가 움직인다”는 뜻입니다. 따라서 일반 소프트웨어보다 훨씬 보수적인 검증 구조가 필요합니다.

## 3.5 구현 패턴

실무적으로는 code 자체를 직접 실행하기보다, LLM이 아래와 같은 제한된 JSON 또는 DSL을 출력하게 하는 것이 더 안전합니다.

```json
{
  "program": [
    {"call": "detect_object", "args": {"name": "vial"}},
    {"call": "move_to_pregrasp", "args": {"object": "vial"}},
    {"call": "close_gripper", "args": {}},
    {"call": "move_to_station", "args": {"station": "capping_station"}},
    {"call": "align_with_visual_servo", "args": {"target": "hole_center"}},
    {"call": "insert_with_force_limit", "args": {"max_force_N": 5.0}}
  ]
}
```

이 구조는 code-like flexibility와 schema validation을 동시에 얻을 수 있습니다.

## 3.6 이 장의 핵심 정리

```text
LLM as Program Generator의 핵심:
    자연어를 실행 가능한 API 호출 순서로 바꾼다.

장점:
    조건문, 반복문, recovery logic을 표현하기 쉽다.

위험:
    LLM이 생성한 코드를 그대로 로봇에서 실행하면 안 된다.

실무 원칙:
    code generation보다 structured DSL + validator가 안전하다.
```
