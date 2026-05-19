# Figure 제작/확장 프롬프트

현재 패키지에는 저작권 문제를 피하기 위해 직접 만든 SVG 다이어그램 6개가 포함되어 있습니다. 추후 더 시각적으로 풍부한 figure가 필요하면 아래 프롬프트를 사용해 생성형 이미지 또는 벡터 다이어그램을 만들 수 있습니다.

## 1. LLM/VLM/VLA Evolution Timeline

Create a clean educational vector diagram showing the evolution of robotics AI systems from language-conditioned policies to LLM planners, VLM grounding, VLA action models, and agentic robot foundation models. Use a horizontal timeline, minimal colors, academic style, no company logos, no copyrighted paper figures.

## 2. LLM Planner + Skill Library

Create a robotics system architecture diagram showing user instruction, LLM planner, skill library, affordance/precondition checker, motion planner, and robot controller. Emphasize that LLM does not directly output joint commands. Academic technical style.

## 3. VLM Grounding

Create an educational diagram showing RGB/RGB-D camera input, VLM inspection, object/keypoint/affordance extraction, 3D target or value map generation, and motion planner execution. Include small callouts for 'structured output', 'confidence', and 'frame transform'.

## 4. VLA Policy

Create a diagram showing a Vision-Language-Action model that receives multi-camera images, language instruction, and robot proprioception, then outputs action tokens or continuous action chunks. Include safety filter and low-level controller as separate blocks.

## 5. Robot Learning Data Flywheel

Create a circular pipeline diagram: teleoperation, dataset curation, training, deployment, logging, failure analysis, retraining. Use robotics lab style and clear arrows.

## 6. SDL Safe Architecture

Create a vertical layered architecture diagram for a self-driving lab robot: workflow manager, LLM task manager, VLM inspection layer, command validator, skill executor, motion control, safety monitor, logger/dataset builder.
