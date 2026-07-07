---
title: 'Choosing a Project Management Approach with Cynefin'
linkTitle: 'Project Management with Cynefin'
date: 2026-07-07
lastmod: 2026-07-07
authors: ['Derek Leeds']
categories: [ai, agents, project-management]
tags:
  [
    cynefin,
    project-management,
    agile,
    scrum,
    kanban,
    waterfall,
    teams,
    decision-making,
  ]
description:
  'A practical guide to using the Cynefin framework to choose the right
  project-management posture: runbook, expert analysis, experiments, or crisis
  response.'
weight: 35
---

Not every project needs Agile.

Not every project needs Waterfall.

And not every messy situation can be fixed by renaming meetings “ceremonies” and
putting sticky notes on a wall. That is project-management cosplay. Stylish,
maybe. Useful, only sometimes.

The better question is:

> What kind of problem are we actually dealing with?

That is where the **Cynefin framework** helps. Cynefin is a sense-making
framework for matching your response to the reality of the situation. It does
not ask, “What process do we like?” It asks, “What domain are we in?”

Once you know the domain, the project-management approach becomes much easier to
choose.

<figure>
  <img
    src="/images/cynefin-framework-2022.jpg"
    alt="Diagram of the Cynefin framework showing Clear, Complicated, Complex, Chaotic, and Confusion domains"
  />
  <figcaption>
    Cynefin framework 2022 diagram by
    <a href="https://commons.wikimedia.org/wiki/File:Cynefin_framework_2022.jpg">Tom@thomasbcox.com</a>,
    via Wikimedia Commons and the
    <a href="https://en.wikipedia.org/wiki/Cynefin_framework">Wikipedia Cynefin framework article</a>,
    licensed under
    <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.
  </figcaption>
</figure>

## The short version

| Cynefin domain      | Situation feels like              | Team posture                  | Common fit                                           |
| ------------------- | --------------------------------- | ----------------------------- | ---------------------------------------------------- |
| **Clear** / Obvious | Known problem, known answer       | Follow the runbook            | Checklist, standard process, Waterfall-ish execution |
| **Complicated**     | Expert analysis needed            | Diagnose, plan, coordinate    | Kanban, staged delivery, expert-led planning         |
| **Complex**         | Outcome uncertain                 | Run experiments and learn     | Scrum, prototypes, pilots, discovery work            |
| **Chaotic**         | Stability is gone                 | Act to contain, then reassess | Incident response, crisis management                 |
| **Disorder**        | Nobody agrees what domain this is | Break the problem apart       | Triage and classify                                  |

The important part: these are tendencies, not laws. Cynefin is not a magic
methodology vending machine. It is a way to stop forcing the same management
style onto every kind of problem.

## What Cynefin is for

Cynefin helps teams make decisions in context. The framework distinguishes
between different domains so leaders and teams do not waste energy overthinking
routine work or pretending complex work can be solved with a standard checklist.

That distinction matters because the wrong management style creates predictable
failure modes:

- Use heavyweight planning for obvious work and the team slows down.
- Use rigid best practices for complex work and the team learns too late.
- Use open-ended experimentation during a crisis and the situation gets worse.
- Treat expert work as routine and you miss the details that actually matter.

Good project management starts with matching the approach to the problem.

## Domain 1: Clear / Obvious

> Known problem. Known answer. Stable cause and effect.

This domain is called **Clear** in many current Cynefin materials. Older
articles often call it **Obvious**. The idea is the same: the team knows what is
happening, the answer is well understood, and the work mostly needs disciplined
execution.

### How to manage it

Use standard process:

- checklists
- templates
- documented runbooks
- repeatable implementation plans
- well-defined acceptance criteria
- straightforward sequencing

This is where Waterfall-style planning can be perfectly reasonable. If the work
is predictable, sequencing it up front is not a moral failure. Sometimes the
Gantt chart is not the villain; the villain is pretending every project is a
startup pivot.

### Examples

- Publishing a guide after the template and workflow are known.
- Applying a routine dependency update with passing tests.
- Running a documented backup-restore validation.
- Rebuilding a known service from source-of-truth manifests.
- Creating a standard taxonomy using a proven methodology.

### Watch out for

Complacency. Clear work can fall into chaos when people ignore exceptions or
blindly follow a checklist after the context changes.

## Domain 2: Complicated

> There is an answer, but you need expertise to find it.

Complicated work has cause and effect, but the relationship is not obvious to
everyone. You need analysis, domain knowledge, and sometimes multiple experts.
There may be several good answers.

### How to manage it

Use expert-led coordination:

- discovery interviews
- architecture reviews
- dependency mapping
- risk analysis
- phased implementation
- Kanban-style flow control
- decision records

Kanban often fits here because the team needs visibility, prioritization, and
flow without pretending the answer is known on day one.

### Examples

- Designing a knowledge-management roadmap.
- Choosing between database or search architectures.
- Planning a Kubernetes migration.
- Reviewing a security model.
- Selecting an integration approach across multiple systems.

### Watch out for

Analysis paralysis. Complicated work needs expertise, but the team still needs a
decision. Document the trade-offs, choose a path, and define what evidence would
make you revisit it.

## Domain 3: Complex

> You cannot know the answer up front. You have to learn your way forward.

Complex work is not just “very complicated.” In a complex domain, cause and
effect are only clear in retrospect. The team cannot reliably predict which
solution will work before trying something.

### How to manage it

Use experiments:

- prototypes
- spikes
- pilots
- short feedback loops
- parallel hypotheses
- user testing
- discovery sprints
- reversible decisions

Scrum can fit here when it is used for real learning: build a small thing,
inspect the result, adjust the plan. Scrum becomes cargo cult when the team
already knows the answer but keeps performing sprint theater anyway.

### Examples

- Testing whether a new expert-finder system will actually help users.
- Piloting a community of practice before scaling it.
- Validating a new agent workflow with real operators.
- Exploring whether a local AI tool improves a team process.
- Investigating intermittent performance or reliability behavior.

### Watch out for

Premature certainty. Complex work punishes teams that commit too early. Keep
experiments small, define learning goals, and avoid irreversible changes until
the pattern is clearer.

## Domain 4: Chaotic

> The situation is unstable. Waiting for perfect understanding is unsafe.

In chaos, the first job is not optimization. The first job is stabilization.
Cause and effect are unclear, and the team needs to act quickly enough to reduce
harm.

### How to manage it

Use crisis response:

- contain the blast radius
- assign a lead
- communicate status
- preserve evidence
- make short-cycle decisions
- stabilize first, analyze second
- document the timeline

This is not the moment for a two-week sprint planning ceremony. This is the
moment for incident command.

### Examples

- Active outage.
- Security incident.
- Data loss in progress.
- Major stakeholder or budget shock.
- Sudden technology or compliance change.

### Watch out for

Staying in chaos longer than necessary. Once the situation is stable, move the
remaining work into clear, complicated, or complex domains.

## Domain 5: Disorder

> The team does not know which domain it is in.

Disorder is what happens when people argue from their preferred management style
instead of the problem context.

One person says, “Just follow the process.” Another says, “We need more expert
analysis.” Another says, “We need to experiment.” Another says, “Everything is
on fire.” They may all be right about different slices of the work.

### How to manage it

Break the problem apart:

1. Identify the different workstreams.
2. Classify each one separately.
3. Choose the management posture for each slice.
4. Revisit the classification as new evidence appears.

Most real projects contain multiple domains at once. A migration may have clear
checklist tasks, complicated architecture choices, complex user-adoption risks,
and chaotic incident work if something breaks mid-cutover.

## Choosing the approach

Use this decision pattern:

```text
If the work is repeatable and well understood:
  use a runbook/checklist/standard plan

If the work needs expert diagnosis:
  use analysis, sequencing, Kanban-style flow, and decision records

If the answer is unknowable up front:
  use experiments, prototypes, and short feedback loops

If the system is unstable or harm is unfolding:
  use incident command, containment, and rapid reassessment

If the team disagrees about the domain:
  split the work into smaller pieces and classify each one
```

## Practical examples for technical teams

### Example: routine content publishing

- **Domain:** Clear
- **Approach:** Follow the publishing workflow
- **Why:** The steps are known: draft, format, build, commit, deploy, verify

### Example: choosing a new search architecture

- **Domain:** Complicated
- **Approach:** Compare options, document trade-offs, choose an architecture
- **Why:** Expertise matters, but analysis can produce a defensible decision

### Example: introducing AI agents into an operations workflow

- **Domain:** Complex
- **Approach:** Pilot with limited scope, measure behavior, adjust guardrails
- **Why:** The human/process effects are emergent and cannot be fully predicted

### Example: production outage

- **Domain:** Chaotic
- **Approach:** Incident response
- **Why:** Stabilization comes before optimization

## Practical examples for homelab GitOps

This maps cleanly to infrastructure work:

| Work item                                  | Likely domain | Better approach                                   |
| ------------------------------------------ | ------------- | ------------------------------------------------- |
| Rebuild a known service from Forgejo       | Clear         | Runbook + verification                            |
| Design a new Helm chart boundary           | Complicated   | Architecture review + ADR                         |
| Pilot an agent-driven incident workflow    | Complex       | Small experiment + post-review                    |
| Recover from unexpected data loss          | Chaotic       | Incident response + evidence preservation         |
| Migrate a stack from Compose to Kubernetes | Mixed         | Split into clear, complicated, and complex slices |

That last row is the important one. Most meaningful infrastructure work is
mixed. Do not ask, “Is this Agile or Waterfall?” Ask, “Which parts are known,
which parts need expertise, which parts require learning, and which parts are on
fire?”

## Accuracy notes

The Enterprise Knowledge article is directionally right: Cynefin is a useful way
to choose a project-management approach based on context.

A few refinements make it safer to apply:

1. **Obvious vs Clear:** Older Cynefin writing often uses “Obvious.” Current
   material commonly uses “Clear.” Treat them as the same ordered domain unless
   you are working in a context that requires a specific Cynefin version.
2. **Methodologies are not hard-mapped:** Waterfall, Kanban, and Scrum can fit
   different domains depending on how they are used. The framework suggests a
   posture; it does not automatically select a tool.
3. **Complex is not complicated with extra steps:** Complicated work can be
   analyzed. Complex work must be probed.
4. **Chaos is temporary:** The goal is stabilization, then reclassification.
5. **Real projects are mixed:** Classify workstreams, not just the whole
   project.

## Bottom line

Cynefin helps teams avoid the lazy question: “Should we use Agile?”

The better question is:

> What domain are we in, and what kind of response does that domain require?

For clear work, use the runbook. For complicated work, bring expertise. For
complex work, run experiments. For chaotic work, stabilize first. For disorder,
split the problem until the pieces make sense.

That is better project management than forcing every problem through the same
process and hoping the process is feeling generous that day.

## Sources

- [Enterprise Knowledge: Choosing the Best Project Management Approach for Your Team: The Cynefin Framework](https://enterprise-knowledge.com/choosing-the-best-project-management-approach-for-your-team-the-cynefin-framework/)
- [The Cynefin Company: The Cynefin Framework](https://thecynefin.co/about-us/about-cynefin-framework/)
- [Wikipedia: Cynefin framework](https://en.wikipedia.org/wiki/Cynefin_framework)
- [Wikimedia Commons: Cynefin framework 2022.jpg](https://commons.wikimedia.org/wiki/File:Cynefin_framework_2022.jpg)
