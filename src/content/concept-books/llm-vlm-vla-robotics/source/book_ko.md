---
title: "언어 모델은 어떻게 로봇을 움직이게 되었나"
description: "LLM 기반 계획에서 VLM grounding, VLA action model, 그리고 안전한 로봇 시스템 설계까지"
slug: "llm-vlm-vla-robotics"
date: "2026-05-19"
draft: false
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---

# 언어 모델은 어떻게 로봇을 움직이게 되었나

**부제:** LLM 기반 계획에서 VLM grounding, VLA action model, 그리고 안전한 로봇 시스템 설계까지  
**작성일:** 2026-05-19  
**버전:** v0.1 draft for Ingus Lab `/concept/`

> 이 문서는 `/concept/llm-vlm-vla-robotics/`에 책 형태로 배포하기 위한 통합 Markdown 초안입니다. 실제 배포 시에는 각 장을 개별 MD/MDX 파일로 나누는 것을 추천합니다.


---
title: "프롤로그: 왜 LLM/VLM/VLA를 로봇에 붙이는가"
description: "LLM, VLM, VLA를 로봇 시스템에 붙일 때의 큰 그림과 안전한 인터페이스 원칙"
slug: "llm-vlm-vla-robotics/intro"
date: "2026-05-19"
draft: false
order: 0
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 프롤로그: 왜 LLM/VLM/VLA를 로봇에 붙이는가

로봇은 원래부터 “언어”와 잘 맞는 시스템이 아니었습니다. 로봇은 관절각, 속도, 힘, 좌표계, 센서 프레임, 충돌 조건, 장비 interlock 같은 물리적 제약 안에서 움직입니다. 반면 LLM은 문장과 지식을 다루고, VLM은 이미지와 언어를 함께 다루고, VLA는 이미지·언어·상태로부터 action을 직접 예측하려고 합니다.

따라서 이 책의 핵심 질문은 하나입니다.

> **언어 모델의 출력을 어떻게 물리적으로 안전하고 실행 가능한 로봇 입력으로 바꿀 것인가?**

초기 연구의 답은 명확했습니다. LLM에게 바로 joint command를 만들게 하지 않았습니다. 대신 LLM은 “무엇을 해야 하는지”를 고르고, 로봇의 기존 skill, motion planner, controller가 “어떻게 움직일지”를 담당했습니다. 대표적으로 SayCan은 LLM의 언어적 적절성과 로봇 skill의 affordance를 곱해 다음 행동을 선택했습니다. 이 연구는 “LLM이 그럴듯한 말을 하는 것”과 “로봇이 실제로 할 수 있는 것”을 분리한 것이 중요합니다. [Ahn et al. (2022), Do As I Can, Not As I Say / SayCan](https://arxiv.org/abs/2204.01691)

![LLM/VLM/VLA 로봇 시스템의 진화](../assets/figures/fig01_evolution_timeline.svg)

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
7. **Ingus Lab/SDL 적용**: 실험 자동화 로봇에는 어떤 단계로 적용하는 것이 안전한가?

이 책의 관점은 연구 소개에만 머물지 않습니다. 목표는 `/concept/`에 배포할 수 있는 배경지식 글이면서, 동시에 실제 구현을 시작할 수 있는 시스템 설계 문서가 되는 것입니다.


---
title: "LLM 이전: 언어 조건 로봇 정책"
description: "LLM planner 이전의 language-conditioned visuomotor policy 흐름"
slug: "llm-vlm-vla-robotics/language-conditioned-policy"
date: "2026-05-19"
draft: false
order: 1
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 1장. LLM 이전: 언어 조건 로봇 정책

LLM이 로봇 계획에 본격적으로 들어오기 전에도, 언어는 이미 로봇 학습에서 중요한 조건 정보였습니다. 이 시기의 핵심은 “언어를 추론 엔진으로 쓰는 것”이 아니라, **언어를 policy의 입력 조건으로 넣는 것**이었습니다.

## 1.1 문제 설정

언어 조건 로봇 정책은 보통 다음 형태입니다.

```text
관측: 이미지, RGB-D, 로봇 상태
명령: "put the red block in the bowl"
모델: visuomotor policy
출력: pick/place 위치, end-effector pose, 또는 action sequence
```

여기서 언어는 task ID를 대체합니다. 예전에는 `task_id=3`처럼 미리 정의된 작업을 선택했다면, 언어 조건 정책에서는 “빨간 블록을 그릇에 넣어라” 같은 자연어가 정책의 조건이 됩니다. Stepputtis et al.은 language-conditioned visuomotor policy를 통해 7-DOF 로봇팔 조작에서 runtime instruction으로 정책을 조건화하는 방향을 보였습니다. [Stepputtis et al. (2020), Language-Conditioned Imitation Learning for Robot Manipulation Tasks](https://arxiv.org/abs/2010.12083)

## 1.2 CLIPort: What과 Where를 나누다

CLIPort의 핵심 아이디어는 간단하지만 강력합니다. CLIP은 “무엇인지”를 잘 이해하지만, 픽셀 단위의 정밀한 조작 위치를 바로 만들기는 어렵습니다. Transporter 계열 구조는 “어디를 집고 어디에 놓을지”를 잘 다루지만, open-vocabulary semantic understanding은 약합니다. CLIPort는 이 둘을 결합하여 language-conditioned tabletop manipulation을 수행했습니다. [Shridhar et al. (2021/2022), CLIPort: What and Where Pathways for Robotic Manipulation](https://arxiv.org/abs/2109.12098)

```text
CLIP pathway:
    semantic understanding, "what"

Transporter pathway:
    spatial precision, "where"

결과:
    언어 명령에 따라 pick/place 위치를 예측
```

이 구조는 이후 VLM/VLA 연구를 이해하는 데 중요한 힌트를 줍니다. 로봇은 semantic understanding만으로 움직이지 못합니다. 항상 그 semantic understanding을 **공간적 action representation**으로 바꿔야 합니다.

## 1.3 PerAct: 3D voxel과 Transformer

PerAct는 language goal과 RGB-D voxel observation을 Perceiver Transformer로 encoding하고, 다음 best voxel action을 예측했습니다. 2D 이미지 위에서만 행동을 고르는 것이 아니라, 3D voxelized observation/action space를 사용해 6-DoF manipulation action을 다룬 것이 중요합니다. [Shridhar et al. (2022), PerAct: Perceiver-Actor](https://arxiv.org/abs/2209.05451)

이 흐름은 VLM grounding의 전조입니다. 나중에 VoxPoser나 MOKA가 “이미지/언어 → affordance/keypoint/3D value map → motion”으로 가는 것처럼, PerAct도 언어와 3D 구조를 policy 안에서 연결하려 했습니다.

## 1.4 이 시기의 시스템 설계 특징

이 시기의 시스템은 대체로 end-to-end policy에 가깝습니다.

```text
language instruction
+ image / RGB-D
+ robot state
      ↓
policy network
      ↓
pick/place 또는 6-DoF action
```

장점은 명확합니다.

- 명령을 자연어로 줄 수 있습니다.
- perception과 action을 하나의 모델로 학습할 수 있습니다.
- 제한된 tabletop 환경에서는 높은 성능을 낼 수 있습니다.

하지만 한계도 분명합니다.

- 언어적 reasoning은 제한적입니다.
- 작업 순서를 길게 계획하기 어렵습니다.
- 실패했을 때 replanning 구조가 약합니다.
- 로봇이 할 수 없는 행동을 언어적으로 구분하는 능력이 부족합니다.
- 훈련 데이터 분포 밖에서는 성능이 크게 떨어질 수 있습니다.

따라서 다음 단계에서 LLM이 등장합니다. LLM은 로봇의 low-level policy를 직접 대체하기보다는, 긴 작업을 단계로 나누고, 현재 가능한 skill을 선택하는 high-level planner로 먼저 쓰였습니다.

## 1.5 이 장의 핵심 정리

```text
LLM 이전의 핵심:
    언어는 policy의 조건이었다.

LLM 이후의 변화:
    언어 모델이 task decomposition, planning, recovery까지 맡기 시작했다.

실무적 교훈:
    semantic understanding과 spatial action representation은 반드시 분리해서 설계해야 한다.
```


---
title: "LLM as Planner: skill을 선택하는 언어 모델"
description: "SayCan과 Inner Monologue를 중심으로 LLM 기반 로봇 planning 구조 정리"
slug: "llm-vlm-vla-robotics/llm-planner"
date: "2026-05-19"
draft: false
order: 2
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 2장. LLM as Planner: skill을 선택하는 언어 모델

LLM을 로봇에 붙이는 첫 번째 성공적인 방식은 LLM을 **제어기**로 쓰는 것이 아니라 **planner**로 쓰는 것이었습니다. 이 구분이 매우 중요합니다.

LLM은 웹 텍스트에서 얻은 절차적 지식과 상식은 풍부하지만, 특정 로봇의 workspace, grasp 가능성, collision, joint limit, 장비 상태를 직접 알지 못합니다. 그래서 초기 연구는 LLM에게 “무엇을 해야 하는지”를 맡기고, “실제로 가능한지”는 로봇 쪽 affordance model이나 skill executor가 판단하게 했습니다.

![LLM planner와 skill library 구조](../assets/figures/fig02_llm_planner_skill_library.svg)

## 2.1 SayCan: “그럴듯한 행동”과 “가능한 행동”을 곱하다

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


---
title: "LLM as Program Generator: code와 API로 로봇을 다루기"
description: "Code as Policies와 ProgPrompt를 중심으로 LLM이 로봇 프로그램을 생성하는 방식 정리"
slug: "llm-vlm-vla-robotics/llm-programs"
date: "2026-05-19"
draft: false
order: 3
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 3장. LLM as Program Generator: code와 API로 로봇을 다루기

LLM planner가 “다음 skill”을 고르는 방식이라면, 다음 흐름은 LLM이 **실행 가능한 프로그램**을 생성하는 방식입니다. 이때 LLM은 자연어 답변을 내는 것이 아니라, 로봇 시스템이 제공하는 API를 호출하는 code-like policy를 만듭니다.

## 3.1 Code as Policies

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


---
title: "VLM Grounding: 보고, 찾고, 좌표로 연결하기"
description: "VLM이 장면 이해, affordance, keypoint, 3D value map을 통해 로봇 행동과 연결되는 방식"
slug: "llm-vlm-vla-robotics/vlm-grounding"
date: "2026-05-19"
draft: false
order: 4
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 4장. VLM Grounding: 보고, 찾고, 좌표로 연결하기

LLM은 텍스트 기반 추론에는 강하지만, 로봇이 실제로 보고 있는 장면을 직접 이해하지 못합니다. 그래서 VLM이 등장하면서 로봇 시스템은 이미지와 언어를 함께 사용해 object, affordance, keypoint, constraint, 위험 상황을 판단하기 시작했습니다.

![VLM grounding 구조](../assets/figures/fig03_vlm_grounding.svg)

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


---
title: "VLA의 등장: image+language에서 action으로"
description: "RT-1, RT-2, Open X-Embodiment, OpenVLA, Octo, SmolVLA를 중심으로 VLA 구조 정리"
slug: "llm-vlm-vla-robotics/vla-models"
date: "2026-05-19"
draft: false
order: 5
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 5장. VLA의 등장: image+language에서 action으로

VLA, 즉 Vision-Language-Action model은 이미지와 언어를 보고 로봇 action을 직접 예측하는 모델 계열입니다. 기존 LLM/VLM 기반 시스템이 planner, perception, controller를 분리했다면, VLA는 이 과정을 하나의 학습된 policy로 통합하려고 합니다.

![VLA policy 구조](../assets/figures/fig04_vla_policy.svg)

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


---
title: "데이터와 툴체인: VLA 성능을 만드는 실제 파이프라인"
description: "ALOHA, Mobile ALOHA, DROID, LeRobot을 중심으로 데이터 수집과 학습 파이프라인 정리"
slug: "llm-vlm-vla-robotics/data-tooling"
date: "2026-05-19"
draft: false
order: 7
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 7장. 데이터와 툴체인: VLA 성능을 만드는 실제 파이프라인

VLA나 robot foundation model을 이야기할 때 모델 구조만 보면 절반만 보는 것입니다. 실제 성능은 데이터 수집, teleoperation, labeling, dataset curation, training, deployment, logging, retraining으로 이어지는 **data flywheel**에서 나옵니다.

![Robot learning data flywheel](../assets/figures/fig05_data_flywheel.svg)

## 7.1 ALOHA와 ACT

ALOHA는 low-cost bimanual manipulation system과 imitation learning pipeline을 제안했습니다. 특히 ACT, Action Chunking Transformer는 한 번에 action 하나를 예측하는 대신 action chunk를 예측해 imitation learning의 compounding error를 줄이려는 접근입니다. [Zhao et al. (2023), ALOHA / ACT](https://arxiv.org/abs/2304.13705)

```text
Observation:
    multi-view images + joint positions

Policy:
    Transformer / CVAE-style action chunk prediction

Output:
    future action sequence
```

ACT의 메시지는 VLA와도 연결됩니다. 로봇 제어에서 한 step action만 예측하면 작은 오차가 누적되기 쉽습니다. action chunk를 예측하면 policy가 짧은 horizon의 temporal structure를 더 잘 다룰 수 있습니다.

## 7.2 Mobile ALOHA

Mobile ALOHA는 ALOHA를 mobile base와 whole-body teleoperation으로 확장했습니다. 논문은 low-cost whole-body teleoperation system으로 bimanual mobile manipulation data를 수집하고, 기존 static ALOHA dataset과 co-training하면 mobile manipulation performance가 좋아진다고 보고했습니다. [Fu et al. (2024), Mobile ALOHA](https://arxiv.org/abs/2401.02117)

이 연구의 교훈은 두 가지입니다.

```text
1. 로봇 학습은 하드웨어/teleoperation 설계와 분리되지 않는다.
2. 기존 데이터와 새 task 데이터를 함께 학습하는 co-training이 중요하다.
```

## 7.3 DROID: in-the-wild robot manipulation dataset

DROID는 in-the-wild robot manipulation dataset으로, 76k demonstration trajectories, 350 hours, 수백 개 scene, 80개 이상의 tasks를 포함합니다. [Khazatsky et al. (2024), DROID](https://arxiv.org/abs/2403.12945)

DROID의 의의는 “실험실 안의 동일한 tabletop”이 아니라, 여러 장소와 장면에서 수집한 다양한 데이터를 강조한다는 점입니다. generalist policy가 실제 환경에서 잘 동작하려면, 데이터도 실제 환경의 다양성을 담아야 합니다.

## 7.4 LeRobot: end-to-end robot learning library

LeRobot은 low-level middleware communication, dataset collection, storage/streaming, state-of-the-art algorithms, inference stack까지 포함하는 open-source end-to-end robot learning library입니다. [Cadene et al. (2026), LeRobot](https://arxiv.org/abs/2602.22818)

이런 도구가 중요한 이유는 VLA 연구가 점점 “논문 모델 하나”에서 “재현 가능한 개발 생태계”로 이동하고 있기 때문입니다.

```text
Hardware control
    ↓
Dataset collection
    ↓
Dataset streaming
    ↓
Policy training
    ↓
Inference
    ↓
Deployment
    ↓
Logging
```

## 7.5 데이터 수집 시 기록해야 하는 것

실제 로봇 학습 데이터를 모을 때는 image와 action만으로 충분하지 않습니다.

```text
필수 기록:
- timestamp
- camera images / depth
- robot joint states
- end-effector pose
- gripper state
- force/torque if available
- action command
- executed action
- task instruction
- workflow state
- success/failure label
- failure reason
- human correction
- device state / interlock
```

특히 실험 자동화 시스템에서는 장비 상태도 중요합니다.

```text
예:
- capping station power state
- thermoshaker connection state
- HPLC ready/busy/error state
- vial detected / not detected
- smartcap detected / not detected
- tray position verified / not verified
```

## 7.6 이 장의 핵심 정리

```text
VLA 성능은 모델 구조보다 데이터 파이프라인에 크게 의존한다.

좋은 데이터는 다음을 포함해야 한다:
    image + robot state + instruction + action + outcome + failure reason

실무 전략:
    처음부터 완전한 VLA를 목표로 하지 말고,
    logging 가능한 skill-based robot system을 먼저 만들고,
    그 데이터를 나중에 VLA/BC/IL 학습에 사용한다.
```


---
title: "안전한 시스템 설계: 문자열을 로봇 명령으로 바꾸는 법"
description: "LLM/VLM/VLA 출력에서 실제 robot controller 입력까지의 validation pipeline"
slug: "llm-vlm-vla-robotics/safe-system-design"
date: "2026-05-19"
draft: false
order: 8
tags: ["Robotics", "LLM", "VLM", "VLA", "Robot Foundation Model"]
---
# 8장. 안전한 시스템 설계: 문자열을 로봇 명령으로 바꾸는 법

LLM/VLM/VLA를 실제 로봇에 붙일 때 가장 위험한 설계는 다음입니다.

```text
model output string → 바로 robot command 실행
```

로봇은 물리 세계를 움직입니다. 따라서 문자열 hallucination은 단순한 오답이 아니라 충돌, 파손, 오염, 안전사고로 이어질 수 있습니다. ASIMOV Benchmark는 VLM/LLM이 로봇 brain으로 사용될 때 semantic safety를 평가해야 한다는 문제의식을 제기했고, foundation model이 물리적 접촉을 수행하는 로봇을 제어할 때 safety가 즉각적인 관심사가 된다고 설명합니다. [Sermanet et al. (2025), ASIMOV Benchmark](https://arxiv.org/abs/2503.08663)

## 8.1 안전한 전체 구조

![SDL/실험 자동화용 안전한 아키텍처](../assets/figures/fig06_sdl_safe_architecture.svg)

기본 원칙은 다음입니다.

```text
LLM/VLM/VLA:
    제안한다.

Validator:
    검사한다.

Planner/Controller:
    실행 가능한 motion으로 바꾼다.

Safety Monitor:
    실행 중 감시하고 중단한다.
```

## 8.2 structured output

모델에게 자유 문장을 받지 말고, schema가 있는 JSON을 받는 것이 좋습니다.

```json
{
  "type": "skill_call",
  "skill": "align_to_hole",
  "arguments": {
    "target": "capping_station_hole",
    "mode": "visual_servoing",
    "max_translation_mm": 3.0,
    "max_rotation_deg": 2.0
  },
  "confidence": 0.84,
  "failure_policy": "stop_and_ask_human"
}
```

이 JSON에서 실제 실행에 쓰는 것은 `skill`, `arguments`, `confidence`, `failure_policy`입니다. 설명 문장이나 reasoning text는 로봇 명령으로 사용하지 않습니다.

## 8.3 validation checklist

실행 전에는 최소한 다음을 확인해야 합니다.

```text
Schema validation:
    JSON field가 맞는가?
    type이 맞는가?

Allowlist:
    skill이 허용된 목록에 있는가?

Range check:
    이동량, 속도, 힘 제한을 넘지 않는가?

State check:
    현재 workflow state에서 이 skill이 가능한가?

Perception confidence:
    VLM/detector confidence가 충분한가?

Frame check:
    base_link, tool0, camera frame 변환이 유효한가?

IK feasibility:
    목표 pose에 대한 IK 해가 있는가?

Collision check:
    self-collision / environment collision이 없는가?

Device interlock:
    장비가 ready 상태인가?

Runtime monitor:
    force, velocity, timeout, emergency stop 조건이 있는가?
```

## 8.4 action space는 처음에 좁게 시작한다

VLA를 실험하더라도 처음부터 모든 action을 허용하면 안 됩니다. 처음에는 다음 정도만 허용하는 것이 좋습니다.

```text
허용:
- stop
- ask_human
- move_relative small delta
- open_gripper
- close_gripper
- inspect_state

제한적으로 허용:
- move_to_pose with collision check
- visual_servo_align
- force_limited_insert

금지:
- arbitrary joint command
- arbitrary torque command
- high-force contact
- deep insertion without verification
- unknown device operation
```

## 8.5 task space와 joint space

LLM/VLM/VLA 출력은 가능한 한 task space 또는 skill space로 제한하는 것이 좋습니다.

```text
추천:
    skill_call
    task-space pose
    end-effector delta
    keypoint target
    visual servoing target

비추천:
    raw joint angles
    raw torque
    unrestricted velocity command
```

joint space는 로봇 controller 내부에서는 필요하지만, 모델이 직접 출력하기에는 위험합니다. joint limit, singularity, self-collision, branch 선택 문제가 있기 때문입니다.

## 8.6 ROS 2 구현 예시

ROS 2 기준으로는 다음 노드 구조를 추천합니다.

```text
/vlm_inspector_node
    input: camera image, workflow state
    output: InspectionResult.msg

/llm_task_manager_node
    input: user instruction, workflow state, inspection result
    output: SkillCommand.msg

/command_validator_node
    input: SkillCommand
    output: ValidatedCommand or RejectedCommand

/skill_executor_action_server
    actions:
        PickVial
        PlaceVial
        AlignToHole
        InsertWithForceLimit
        CheckSmartcap
        Stop

/motion_layer
    MoveIt, IK, Servo, visual servoing, impedance control

/safety_monitor_node
    force, collision, workspace, device interlock, timeout

/logger_node
    image, state, command, action, success/failure 기록
```

## 8.7 이 장의 핵심 정리

```text
LLM/VLM/VLA output은 command가 아니라 proposal이다.

proposal은 반드시 다음 과정을 거쳐야 한다:
    parse → validate → plan → check → execute → monitor → log

실제 로봇 시스템에서 가장 중요한 것은 모델 성능보다 안전한 인터페이스다.
```


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


---

## 전체 참고문헌

자세한 참고문헌은 `references/references.md`와 `references/references.bib`를 참고하세요.
