<!-- Use Case template — 13-field (Wiegers / IIBA standard). Copy & fill. English output. -->

| **Use Case ID:**            | UC-XX-YY |
| ---: | :--- |
| **Use Case Name:**          | [Verb + Object, active voice] |
| **Created By:**             | [name] |
| **Date Created:**           | [YYYY-MM-DD] |
| **Last Updated By:**        | [name] |
| **Date Last Updated:**      | [YYYY-MM-DD] |
| **Actor:**                  | Primary: [role]. Secondary: [supporting system/service]. |
| **Description:**            | [2–3 sentences: why + what + outcome]. |
| **Preconditions:**          | 1. [verifiable condition]. 2. ... |
| **Postconditions:**         | 1. [verifiable system state after success]. 2. ... |
| **Priority:**               | High / Medium / Low |
| **Frequency of Use:**       | [quantified, e.g. ~N times/day] |
| **Normal Course of Events:**| 1. [Actor action]. 2. [System response]. 3. ... |
| **Alternative Courses:**    | UC-XX-YY.AC.1: [name] — At step N, if [condition], then [alternate path that still succeeds]. |
| **Exceptions:**             | UC-XX-YY.EX.1: [name] — Trigger: [condition]. System response: [...]. Final state: [failure state]. |
| **Includes:**               | [UC-AA-BB — sub-UC called] |
| **Special Requirements:**   | [Non-functional specific to this UC: performance / security / usability / compliance] |
| **Assumptions:**            | 1. [belief not yet verified] |
| **Notes and Issues:**       | [TBD-1] [open question] \| Owner \| Due date \| Resolution |

<!-- Rules quick-ref:
  - Name = Verb + Object ("Enroll in course"), never a noun ("Enrollment") or actor-inclusive ("User enrolls").
  - Normal Course: numbered, one action per step, alternate Actor/System, NO if/else/loop inline.
  - Precondition = must be true before start (verifiable). Postcondition = state after success (verifiable).
  - Exceptions = goal fails. Alternative Courses = still succeed via different path.
-->
