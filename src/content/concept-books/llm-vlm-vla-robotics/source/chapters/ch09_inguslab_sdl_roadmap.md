---
title: "Ingus Lab/SDL 적용 로드맵"
description: "실험 자동화 로봇에 LLM/VLM/VLA를 안전하게 적용하기 위한 단계별 전략"
slug: "llm-vlm-vla-robotics/inguslab-sdl-roadmap"
date: "2026-05-19"
draft: false
order: 9
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 9장. Ingus Lab/SDL 적용 로드맵

실험 자동화 로봇, 특히 vial, smartcap, capping station, HPLC, thermoshaker 같은 장비가 포함된 환경에서는 VLA를 처음부터 end-to-end 제어기로 쓰는 것은 위험합니다. 이 환경에서는 “정확한 제어”보다 “안전한 판단과 검증”이 먼저입니다.

## 9.1 1단계: VLM inspection layer부터 시작

가장 현실적인 첫 번째 목표는 VLM을 semantic inspection layer로 쓰는 것입니다.

```text
질문 예시:
- vial이 tray hole 위에 있는가?
- smartcap이 올바른 위치에 있는가?
- capping station 안에 이물질/액체 흔적이 있는가?
- vial이 깨졌거나 누락되었는가?
- end-effector와 vial이 충돌 위험 상태인가?
- HPLC handoff 위치가 비어 있는가?
```

출력은 반드시 structured JSON으로 받습니다.

```json
{
  "status": "misaligned",
  "target": "vial",
  "reference": "tray_hole",
  "estimated_offset": {
    "direction": "left",
    "magnitude_mm": 2.0
  },
  "confidence": 0.78,
  "recommended_next_step": "visual_servo_align"
}
```

## 9.2 2단계: LLM task manager

LLM은 workflow state를 보고 다음 skill을 선택합니다.

```text
Input:
- 현재 workflow 단계
- VLM inspection result
- 장비 상태
- 최근 실패 로그
- 사용자의 instruction

Output:
- next skill
- arguments
- failure policy
```

예시:

```json
{
  "skill": "align_to_hole",
  "arguments": {
    "target": "capping_station_hole",
    "method": "visual_servoing",
    "max_attempts": 2
  },
  "reason": "The vial appears slightly misaligned before insertion.",
  "failure_policy": "stop_and_request_human_check"
}
```

여기서 `reason`은 UI에 보여주고, 실행에는 쓰지 않습니다.

## 9.3 3단계: skill executor와 controller 분리

실제 motion은 skill executor가 담당합니다.

```text
pick_vial():
    perception target pose 확인
    pregrasp pose 생성
    IK/collision check
    approach
    close gripper
    lift

align_to_hole():
    camera feedback
    small task-space delta
    반복 visual servoing
    threshold 만족 시 종료

insert_with_force_limit():
    low speed
    force threshold
    max depth
    timeout
    error 발생 시 immediate retreat
```

LLM/VLM이 직접 insertion command를 내는 것이 아니라, 이미 검증된 skill이 정해진 limit 안에서 동작해야 합니다.

## 9.4 4단계: offline VLA evaluation

VLA를 쓰고 싶다면 먼저 offline으로 평가합니다.

```text
기존 camera log / rosbag
    ↓
VLA에 입력
    ↓
예측 action 또는 skill proposal 확인
    ↓
실제 실행 없이 human review
```

평가 지표는 다음이 좋습니다.

```text
- next skill accuracy
- stop/ask_human decision accuracy
- unsafe proposal rate
- hallucinated object rate
- action magnitude error
- recovery suggestion quality
```

## 9.5 5단계: low-risk online control

그 다음에는 아주 작은 task-space action만 허용합니다.

```json
{
  "action": "move_relative",
  "frame": "tool0",
  "translation_m": {
    "x": 0.0,
    "y": 0.001,
    "z": 0.0
  },
  "speed_mps": 0.005
}
```

실행 전 validator가 다음을 확인합니다.

```text
- 이동량이 1~2 mm 이하인가?
- 충돌 가능성이 없는가?
- 장비 상태가 safe인가?
- 사람이 승인해야 하는 구간은 아닌가?
- force limit이 설정되어 있는가?
```

## 9.6 6단계: dataset화

초기 시스템은 반드시 logging을 해야 합니다. 나중에 VLA/IL/BC를 하려면 실패 데이터가 가장 중요합니다.

```text
저장:
- 이미지
- depth/point cloud
- robot state
- proposed command
- validated command
- executed action
- success/failure
- human correction
- failure reason
```

이 데이터는 나중에 다음 용도로 쓸 수 있습니다.

```text
- VLM inspection prompt 개선
- LLM task manager evaluation
- skill success predictor 학습
- VLA fine-tuning
- failure replay in digital twin
```

## 9.7 추천 MVP

Ingus Lab `/concept/` 글과 실제 프로젝트를 연결하려면, 첫 MVP는 다음이 좋습니다.

```text
MVP 1:
    VLM inspection demo
    - vial/tray/capping station 이미지 입력
    - 상태 판단 JSON 출력
    - 사람이 검토

MVP 2:
    LLM task manager
    - workflow state 입력
    - 다음 skill JSON 출력
    - validator에서 허가/거부

MVP 3:
    ROS 2 skill executor 연결
    - stop/ask_human/open/close/small_move만 허용

MVP 4:
    offline VLA 비교
    - OpenVLA/SmolVLA/Octo 계열로 action proposal 비교

MVP 5:
    safe online VLA proposal
    - task-space small delta만 허용
```

## 9.8 마지막 정리

실험 자동화 로봇에서 가장 좋은 시작점은 다음입니다.

```text
LLM:
    작업 순서와 recovery를 제안한다.

VLM:
    장면 상태와 위험을 판단한다.

VLA:
    나중에 action proposal로 제한적으로 넣는다.

Controller:
    항상 실제 motion을 책임진다.

Safety layer:
    항상 마지막 허가권을 가진다.
```

즉, Ingus Lab/SDL 시스템에는 처음부터 end-to-end VLA보다 다음 구조가 더 안전하고 실용적입니다.

```text
VLM inspection
    + LLM skill selection
    + deterministic skill executor
    + safety validator
    + logging/data flywheel
```

이 구조를 먼저 만들면, 나중에 VLA를 붙여도 시스템이 무너지지 않습니다. VLA는 기존 pipeline을 대체하는 것이 아니라, 기존 pipeline 안에서 더 좋은 proposal을 내는 모듈로 들어가는 것이 안전합니다.
