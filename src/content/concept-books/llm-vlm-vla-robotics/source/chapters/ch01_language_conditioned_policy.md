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
