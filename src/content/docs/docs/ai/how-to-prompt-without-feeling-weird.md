---
title: "How to Prompt Without Feeling Weird"
linkTitle: "How to Prompt Without Feeling Weird"
date: 2026-06-13
lastUpdated: 2026-06-13
authors: ["Derek Leeds"]
categories: [ai, agents]
tags: [ai, llm, prompting, chatgpt, claude, primer]
description:
  "A practical guide to talking to AI assistants clearly without memorizing
  magic prompt formulas or feeling awkward about it."
weight: 2
---

Prompting an AI assistant can feel strange at first.

You are typing to software, but the software responds like a person. If you are
too brief, it guesses. If you are too formal, you feel ridiculous. If you
overthink the prompt, you can spend more time asking the question than doing the
task.

The good news: you do not need magic words.

You need to explain what you want the same way you would brief a capable
assistant who is smart, fast, and new to the situation.

That is the entire game.

## The short version

A good prompt usually includes:

1. **Goal** — what you want done
2. **Context** — what the assistant needs to know
3. **Audience** — who the output is for
4. **Tone** — how it should sound
5. **Constraints** — what to avoid or preserve
6. **Format** — what the answer should look like

You do not need all six every time. But when an answer is not useful, one of
those pieces is usually missing.

## Start with a normal sentence

You can start simply:

```text
Help me rewrite this email so it sounds clear and kind.
```

That is enough for a low-stakes task.

If the first answer is not right, do not start over. Adjust it:

```text
Make it warmer and shorter. Keep the part where I ask for a meeting.
```

Prompting is a conversation, not a vending machine.

You are allowed to iterate.

## The assistant is not judging you

People sometimes feel awkward giving detailed instructions to an AI assistant.

That is understandable. It can feel unnatural to type:

```text
Use a warm but direct tone. Avoid sounding passive-aggressive.
```

But that is exactly the kind of instruction the model needs.

The assistant does not think you are being demanding. It does not think your
request is silly. It does not care that your first draft is messy.

Messy context is fine. The model is very good at turning messy context into a
usable first draft.

## Use the six-part prompt when quality matters

For anything important, use this template:

```text
I need help with [goal].

Context:
- [important detail]
- [important detail]
- [important detail]

Audience: [who will read or use this]
Tone: [how it should sound]
Constraints: [what to avoid, preserve, or assume]
Format: [email, bullet list, table, checklist, plan, etc.]
```

Example:

```text
I need help writing a message to my child's teacher.

Context:
- My child is missing several assignments.
- I want to ask for a meeting.
- I do not want the message to sound accusatory.
- I want to sound collaborative and calm.

Audience: elementary school teacher
Tone: warm, respectful, direct
Constraints: keep it under 150 words
Format: email draft
```

That prompt gives the model enough to work with.

It knows the goal, situation, relationship, tone, length, and output type.

## Tell it what role to play, but do not overdo it

Role prompts can help:

```text
Act as a patient technical tutor. Explain this like I am new to the topic.
```

Or:

```text
Act as an editor. Improve clarity but preserve my voice.
```

Or:

```text
Act as a skeptical reviewer. Point out weak assumptions in this plan.
```

Roles work because they set expectations.

But you do not need to write a dramatic character sheet. The model does not need
to be told it is “the world's greatest award-winning expert with 40 years of
experience.” That usually adds noise, not quality.

Simple is better.

## Give examples when style matters

If you care about voice, provide an example.

```text
Rewrite this in a style similar to the example below.

My draft:
[paste draft]

Style example:
[paste example]
```

This is especially useful for:

- emails
- social posts
- documentation
- speeches
- performance reviews
- client updates
- family messages

You can also say what you do _not_ want:

```text
Do not make it sound like corporate marketing. Keep it human and plainspoken.
```

That one instruction saves lives. Mostly metaphorically.

## Ask for options, not perfection

Sometimes the best prompt is:

```text
Give me three versions.
```

For example:

```text
Give me three versions of this message:
1. warmer
2. more direct
3. very short
```

This works well because it lets you compare styles.

The first answer does not have to be perfect. It just has to give you something
to react to.

## Use AI for the first draft, not the final decision

A useful pattern:

1. Ask for a rough draft.
2. Pick the parts you like.
3. Ask for a revision.
4. Edit the final version yourself.

Example:

```text
This is close. Keep the second paragraph, make the opening less formal, and remove the phrase "circle back."
```

The model is fast at generating alternatives. You are better at knowing what
sounds like you.

Use both strengths.

## Ask it to explain its assumptions

When the stakes are higher, ask:

```text
What assumptions are you making?
```

Or:

```text
What information would improve your answer?
```

Or:

```text
What could be wrong about this recommendation?
```

These prompts are especially helpful for:

- planning
- research
- technical troubleshooting
- medical, legal, or financial preparation
- comparing options
- reviewing a decision

The assistant may still miss things, but this makes hidden assumptions more
visible.

## Ask for a checklist

If you are trying to _do_ something, ask for a checklist.

```text
Turn this into a step-by-step checklist.
```

Or:

```text
Give me a checklist I can use to make sure I did not miss anything.
```

Checklists are useful because they convert vague advice into action.

They are also easier to verify than paragraphs.

## Use tables for comparisons

If you are comparing options, ask for a table.

```text
Compare these options in a table with columns for cost, difficulty, risk, and best use case.
```

Good comparison prompts include the criteria that matter to you.

Weak prompt:

```text
Which one is better?
```

Better prompt:

```text
Compare these three options for a family of four. I care most about cost, reliability, setup time, and privacy. Use a table, then recommend one.
```

The second prompt gives the model a decision framework.

## Tell it how much detail you want

Models often guess the level of detail.

You can control that:

```text
Give me the short version first, then details if needed.
```

```text
Explain it in plain English, no jargon.
```

```text
Assume I know the basics and focus on tradeoffs.
```

```text
Give me a 5-minute overview, not a deep dive.
```

This prevents the two classic AI failure modes:

- a shallow answer when you needed substance
- a wall of text when you needed a straight answer

## Correct it directly

If the answer is wrong, say so.

```text
That is not the situation. The actual constraint is [constraint]. Try again.
```

You do not need to be polite to the point of ambiguity. The model does not
require emotional cushioning.

Good correction:

```text
No, I do not want to apologize in this message. I want to acknowledge the issue and propose a next step.
```

Bad correction:

```text
Hmm maybe something else?
```

The first one gives direction. The second one asks the model to guess again.

Guessing again is how you get confidently polished nonsense, but with nicer
paragraph spacing.

## Use boundaries for sensitive topics

For emotionally sensitive, private, or high-stakes topics, include boundaries.

```text
Help me think through this, but do not make a final decision for me.
```

```text
Give me questions to ask a professional, not legal advice.
```

```text
Summarize this medical information in plain English, but do not diagnose anything.
```

```text
Help me draft a calm message. Do not escalate the tone.
```

Good boundaries keep the assistant in the right lane.

## Do not paste secrets

Do not paste:

- passwords
- API keys
- private keys
- Social Security numbers
- bank details
- medical identifiers
- confidential work material
- anything you would not want stored outside your control

If the sensitive detail is not needed, remove it.

Instead of:

```text
Here is my account number and the full letter. What should I do?
```

Use:

```text
Here is a redacted version of the letter. Summarize what it is asking me to do and list questions I should ask the provider.
```

Redaction is not paranoia. It is hygiene.

## Useful prompt patterns

### Rewrite this

```text
Rewrite this to be clearer and more concise. Preserve my meaning and do not add new information.

[text]
```

### Explain this

```text
Explain this in plain English. Assume I am smart but new to the topic.

[text or topic]
```

### Summarize this

```text
Summarize this into:
- key points
- decisions
- open questions
- action items

[text]
```

### Compare options

```text
Compare [option A], [option B], and [option C] in a table. Use columns for cost, difficulty, risk, privacy, and best fit. Then recommend one based on [priority].
```

### Make a plan

```text
Create a step-by-step plan for [goal]. Include assumptions, risks, and what I should verify before starting.
```

### Review my thinking

```text
Review this plan skeptically. What am I missing? What assumptions are weak? What would make this fail?
```

### Make it sound like me

```text
Rewrite this in my voice. Keep it direct, plainspoken, and warm. Avoid corporate language.

[text]
```

## A simple rule of thumb

If the output is not useful, do not assume the model is useless.

Ask:

- Did I give it the goal?
- Did I give it enough context?
- Did I say who the audience is?
- Did I specify tone?
- Did I include constraints?
- Did I ask for the right format?

Most bad outputs are missing one of those.

## What to remember

Prompting is not about tricking the AI.

It is about briefing it.

A good prompt says:

```text
Here is what I want.
Here is the situation.
Here is who it is for.
Here is how it should sound.
Here is what to avoid.
Here is what format I need.
```

That is not weird. That is communication.

And like most communication, it gets easier with practice.

## Related guide

Start here if you want the broader foundation:

- [AI, LLMs, ChatGPT, Claude, and Agents: A Practical Primer](/docs/ai/ai-llms-agents-primer/)

---

_Last updated: 2026-06-13._
