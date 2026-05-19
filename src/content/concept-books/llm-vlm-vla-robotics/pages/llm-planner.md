---
title: "LLM as Planner: skill을 선택하는 언어 모델"
description: "SayCan과 Inner Monologue를 중심으로 LLM 기반 로봇 planning 구조 정리"
slug: "llm-vlm-vla-robotics/llm-planner"
date: "2026-05-19"
draft: false
order: 2
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---

LLM을 로봇에 붙이는 첫 번째 성공적인 방식은 LLM을 **제어기**로 쓰는 것이 아니라 **planner**로 쓰는 것이었습니다. 이 구분이 매우 중요합니다.

LLM은 웹 텍스트에서 얻은 절차적 지식과 상식은 풍부하지만, 특정 로봇의 workspace, grasp 가능성, collision, joint limit, 장비 상태를 직접 알지 못합니다. 그래서 초기 연구는 LLM에게 “무엇을 해야 하는지”를 맡기고, “실제로 가능한지”는 로봇 쪽 affordance model이나 skill executor가 판단하게 했습니다.

![LLM planner와 skill library 구조](/concept-books/llm-vlm-vla-robotics/figures/fig02_llm_planner_skill_library.svg)

## 2.1 SayCan: “그럴듯한 행동”과 “가능한 행동”을 곱하다

<div class="paper-media-inline">
  <a class="paper-media-thumb" href="https://say-can.github.io/" target="_blank" rel="noreferrer">
    <img src="https://img.youtube.com/vi/ysFav0b472w/hqdefault.jpg" alt="SayCan representative video thumbnail" loading="lazy" />
  </a>
  <div class="paper-media-links">
    <strong>대표 미디어</strong>
    <a href="https://arxiv.org/abs/2204.01691" target="_blank" rel="noreferrer">Paper</a>
    <a href="https://say-can.github.io/" target="_blank" rel="noreferrer">Project</a>
    <a href="https://www.youtube.com/watch?v=ysFav0b472w" target="_blank" rel="noreferrer">YouTube</a>
  </div>
  <div class="paper-video-embed">
    <iframe src="https://www.youtube.com/embed/ysFav0b472w" title="SayCan video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
  </div>
</div>

SayCan의 질문은 다음과 같았습니다.

> LLM이 제안하는 행동이 로봇에게 실제로 가능한지 어떻게 알 수 있을까?

SayCan은 두 점수를 결합했습니다.

```text
LLM score:
    현재 명령과 문맥에서 이 skill이 의미적으로 적절한가?

Affordance score:
    현재 환경에서 로봇이 이 skill을 실제로 성공시킬 수 있는가?

선택:
    argmax(LLM score × affordance score)
```

즉, 사용자가 “쏟은 음료를 치워줘”라고 하면 LLM은 “걸레를 찾아라”, “걸레를 집어라”, “음료가 있는 곳으로 이동해라” 같은 절차를 알고 있을 수 있습니다. 하지만 로봇이 걸레를 잡을 수 있는지, 현재 걸레가 보이는지, 해당 skill이 학습되어 있는지는 affordance model이 판단합니다. [Ahn et al. (2022), Do As I Can, Not As I Say / SayCan](https://arxiv.org/abs/2204.01691)

이 구조의 핵심은 **LLM output을 로봇 capability로 제한**하는 것입니다. LLM은 자유롭게 말을 만들 수 있지만, 실행 가능한 후보 skill은 allowlist 안에 있어야 합니다.

## 2.2 Inner Monologue: feedback을 언어로 다시 넣다

<div class="paper-media-inline">
  <a class="paper-media-thumb" href="https://innermonologue.github.io/" target="_blank" rel="noreferrer">
    <img src="https://img.youtube.com/vi/0sJjdxn5kcI/hqdefault.jpg" alt="Inner Monologue representative video thumbnail" loading="lazy" />
  </a>
  <div class="paper-media-links">
    <strong>대표 미디어</strong>
    <a href="https://arxiv.org/abs/2207.05608" target="_blank" rel="noreferrer">Paper</a>
    <a href="https://innermonologue.github.io/" target="_blank" rel="noreferrer">Project</a>
    <a href="https://www.youtube.com/watch?v=0sJjdxn5kcI" target="_blank" rel="noreferrer">YouTube</a>
  </div>
  <div class="paper-video-embed">
    <iframe src="https://www.youtube.com/embed/0sJjdxn5kcI" title="Inner Monologue video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
  </div>
</div>

SayCan류의 planner는 open-loop로 동작하면 문제가 생깁니다. 실제 로봇은 명령을 실행하다가 물체를 놓칠 수 있고, perception이 틀릴 수 있고, 사람이 중간에 수정 요청을 할 수 있습니다.

Inner Monologue는 environment feedback을 자연어 형태로 LLM에 다시 넣어 closed-loop planning을 수행했습니다. feedback source에는 success detection, scene description, object recognition, human interaction 등이 포함됩니다. [Huang et al. (2022), Inner Monologue](https://arxiv.org/abs/2207.05608)

```text
Instruction
    ↓
LLM plan
    ↓
Robot executes skill
    ↓
Perception / success detector / human feedback
    ↓
Text feedback to LLM
    ↓
Replanning
```

이 접근은 실제 시스템에서 매우 중요합니다. 로봇은 한 번 계획하고 끝나는 기계가 아니라, 실행 중 계속 상태를 확인하고 복구해야 하는 시스템입니다.

## 2.3 시스템 설계 패턴

LLM planner 구조는 다음과 같습니다.

```text
[Input]
- user instruction
- current task state
- available skills
- known objects
- previous execution feedback

[LLM output]
- next skill
- arguments
- reason
- stop/ask_human/retry decision

[Execution]
- skill precondition check
- motion planner / controller
- feedback logging
```

실제 구현에서는 자유로운 문자열보다 구조화된 출력이 좋습니다.

```json
{
  "skill": "pick_object",
  "arguments": {
    "object": "red cup",
    "grasp_mode": "top_grasp"
  },
  "preconditions": [
    "object_visible",
    "gripper_empty"
  ],
  "failure_policy": "retry_once_then_ask_human"
}
```

여기서 `reason`은 사람이 읽기 위한 설명이고, 실제 로봇 실행에는 `skill`, `arguments`, `preconditions`, `failure_policy`만 사용해야 합니다.

## 2.4 장점과 한계

LLM planner의 장점은 다음입니다.

- 긴 작업을 단계별로 분해할 수 있습니다.
- 사람이 자연어로 명령을 줄 수 있습니다.
- 실패 시 recovery plan을 만들 수 있습니다.
- 기존 skill library를 재사용할 수 있습니다.
- 직접 joint command를 내지 않기 때문에 비교적 안전합니다.

한계도 있습니다.

- skill library가 없으면 실행할 수 없습니다.
- LLM이 물리적 가능성을 착각할 수 있습니다.
- perception 결과가 잘못되면 planner도 잘못됩니다.
- structured output과 validation이 없으면 hallucination이 실행 명령으로 이어질 수 있습니다.

## 2.5 이 장의 핵심 정리

```text
LLM as Planner의 핵심:
    LLM은 skill을 고르고, controller는 motion을 만든다.

가장 중요한 설계 원칙:
    LLM이 말한 것을 바로 실행하지 말고,
    capability, affordance, safety, state로 반드시 제한한다.
```
