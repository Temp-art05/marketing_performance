# Worked Example — Interact.ai Use Case

1 UC hoàn chỉnh đã qua 20-point checklist, làm gold reference.

## UC-LESSON-01 — Complete a daily speaking lesson

| **Use Case ID:**            | UC-LESSON-01 |
| ---: | :--- |
| **Use Case Name:**          | Complete a daily speaking lesson |
| **Created By:**             | PO |
| **Date Created:**           | 2026-06-01 |
| **Last Updated By:**        | PO |
| **Date Last Updated:**      | 2026-06-01 |
| **Actor:**                  | Primary: Learner (signed in, active trial or PRO). Secondary: Speech-to-Text service, Push Notification service. |
| **Description:**            | When a learner opens their daily lesson, they hold a short spoken conversation with the AI tutor (Skye) and receive per-turn pronunciation feedback. The UC ends when the lesson is marked complete, scores are saved, and the streak is updated. |
| **Preconditions:**          | 1. Learner is signed in with an active trial or PRO entitlement. 2. A daily lesson is available for today. 3. Microphone permission is granted. |
| **Postconditions:**         | 1. Lesson record saved with status='Completed'. 2. Pronunciation scores for each turn persisted to learner history. 3. Streak incremented by 1. 4. Lesson summary displayed. |
| **Priority:**               | High — core daily loop; directly affects D1/D7 retention. |
| **Frequency of Use:**       | ~1–3 lessons per active learner per day. |
| **Normal Course of Events:**| 1. Learner taps **Start daily lesson**. 2. System loads today's topic and displays Skye's opening prompt. 3. Learner taps the mic and speaks a response. 4. System sends audio to the STT service and returns a pronunciation score. 5. System displays the score and Skye's next prompt. 6. Steps 3–5 repeat until the topic is finished. 7. System marks the lesson complete, updates the streak, and shows the lesson summary. |
| **Alternative Courses:**    | **UC-LESSON-01.AC.1 — Type instead of speak:** At step 3, if the learner chooses to type, the system accepts text input and skips pronunciation scoring for that turn, then continues at step 5. |
| **Exceptions:**             | **UC-LESSON-01.EX.1 — STT timeout:** Trigger: STT service does not respond within 5s. Response: system shows "Couldn't hear you — tap to try again". Final state: turn not scored; lesson remains in progress.  **UC-LESSON-01.EX.2 — Connection lost mid-lesson:** Trigger: network drops. Response: system shows the offline state and pauses. Final state: lesson progress cached locally; resumes on reconnect. |
| **Includes:**               | UC-STREAK-01 (Update streak) |
| **Special Requirements:**   | Performance: STT round-trip ≤ 800ms P95 on a mid-range device. Reliability: cached lesson progress must survive an app kill and resume. Usability: mic control reachable one-handed. |
| **Assumptions:**            | 1. STT service supports the learner's selected accent target. 2. One lesson maps to one topic. |
| **Notes and Issues:**       | [TBD-1] Should a partially completed lesson still count toward the streak? \| Owner: PO \| Due: 2026-06-10 \| Resolution: TBD. |

---
*PO Document Skill Set · nội bộ.*
