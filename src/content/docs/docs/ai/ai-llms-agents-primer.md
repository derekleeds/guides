---
title: "AI, LLMs, ChatGPT, Claude, and Agents: A Practical Primer"
linkTitle: "AI, LLMs, and Agents Primer"
date: 2026-06-13
lastUpdated: 2026-06-13
authors: ["Derek Leeds"]
categories: [ai, agents]
tags: [ai, llm, agents, chatgpt, claude, primer]
description:
  "A plain-English explanation of AI, large language models, ChatGPT, Claude,
  and agents: what they are, what they are good at, where they fail, and how to
  use them safely."
weight: 1
---

If you have heard people talk about **AI**, **LLMs**, **ChatGPT**, **Claude**,
or **agents**, it can feel like everyone is using the same words to mean
different things.

That is because they often are.

This guide is a practical, non-hype primer. It is written for someone who wants
to understand what these tools are, how they differ, when they are useful, and
when to be careful.

## The short version

- **AI** is the broad category: software that performs tasks we associate with
  intelligence.
- **Machine learning** is one way to build AI: systems learn patterns from data
  instead of being hand-coded for every rule.
- **Large language models**, or **LLMs**, are machine learning models trained to
  work with language.
- **ChatGPT**, **Claude**, **Gemini**, and similar products are applications
  built around LLMs.
- **Agents** are LLM-based systems that can use tools, follow goals, and
  sometimes take actions on your behalf.

A normal chatbot answers.

An agent can answer, search, read files, call APIs, run commands, create
documents, update tickets, or trigger workflows.

That difference matters.

## What is AI?

**Artificial intelligence** is a broad umbrella term. It does not refer to one
specific product or one specific technology.

AI can include:

- spam filters
- recommendation systems
- facial recognition
- voice assistants
- image generators
- language models
- autonomous planning systems

Some of these systems are simple. Some are extremely complex. Some feel
intelligent. Some are just math wearing a convincing hat.

When most people talk about AI today, they usually mean tools powered by **large
language models**.

## What is an LLM?

An **LLM**, or **large language model**, is a model trained on enormous amounts
of text so it can predict and generate language.

At a simple level, it learns patterns like:

- what words tend to appear near each other
- how questions are usually answered
- how code is structured
- how emails, essays, recipes, documentation, and conversations are written
- how different concepts relate to each other in language

That does not mean the model is conscious. It does not mean it “knows” things
the way a person knows things.

A useful mental model is:

> An LLM is a very powerful language prediction engine that can reason _through_
> language, but it does not automatically know whether its answer is true.

That last part is important.

LLMs can produce excellent explanations. They can also produce confident
nonsense. The confidence is style, not proof.

## Is an LLM just autocomplete?

Kind of — but that description is both true and misleading.

Technically, LLMs generate likely next tokens based on context. Tokens are
chunks of text: words, parts of words, punctuation, or code symbols.

So yes, there is an autocomplete-like mechanism underneath.

But modern LLMs are trained and tuned in ways that let them do much more than
finish sentences. They can:

- summarize documents
- compare options
- explain concepts
- draft messages
- translate text
- write and debug code
- classify information
- reason through multi-step problems
- follow formatting instructions

Calling them “just autocomplete” is like calling a calculator “just
electricity.” Technically adjacent, but not the useful part.

## ChatGPT vs. Claude vs. Gemini

**ChatGPT**, **Claude**, and **Gemini** are products built around LLMs.

The rough mapping looks like this:

| Product      | Company   | Notes                                                                                           |
| ------------ | --------- | ----------------------------------------------------------------------------------------------- |
| ChatGPT      | OpenAI    | Broad consumer and business product, strong tool ecosystem, widely used.                        |
| Claude       | Anthropic | Often strong at writing, analysis, long-context reading, and cautious reasoning.                |
| Gemini       | Google    | Deep integration with Google services and strong multimodal capabilities.                       |
| Local models | Various   | Run on your own hardware; more private, but usually require more setup and may be less capable. |

These tools are the same general species, but they do not behave identically.

They differ in:

- writing style
- refusal and safety behavior
- coding ability
- math and reasoning performance
- context window size
- tool access
- memory features
- privacy terms
- cost
- speed

It is reasonable to prefer different tools for different jobs.

For example:

- Use one model for polished writing.
- Use another for code review.
- Use another for brainstorming.
- Use a local model when privacy matters more than raw capability.

The best tool depends on the task.

## What is context?

**Context** is the information the model can see while answering.

That can include:

- your prompt
- previous messages in the conversation
- uploaded files
- retrieved search results
- tool outputs
- memory entries
- system instructions

Models do not automatically know everything about you, your files, your family,
your job, or your preferences. They answer based on what is in context, plus
what they learned during training.

If you want a better answer, give better context.

Bad prompt:

```text
Help me write this.
```

Better prompt:

```text
Help me rewrite this email so it sounds warm but clear. The audience is my child's teacher. I want to ask for a meeting about missing assignments without sounding accusatory.
```

The second prompt gives the model a goal, tone, audience, and constraints.

That is usually the difference between a generic answer and a useful one.

## What are LLMs good at?

LLMs are strongest when the task is language-heavy, pattern-heavy, or
explanation-heavy.

Good uses include:

- rewriting emails
- summarizing long documents
- explaining confusing topics
- comparing pros and cons
- creating checklists
- brainstorming ideas
- turning notes into a draft
- generating first-pass code
- reviewing text for clarity
- translating jargon into plain English
- creating study guides
- preparing questions for a meeting

A good way to use an LLM is as a thinking partner.

Not an oracle. Not a replacement for judgment. A collaborator that is fast,
tireless, and occasionally too confident for its own good.

## What are LLMs bad at?

LLMs have real limitations.

They can struggle with:

- exact facts without current sources
- private context they have not been given
- math unless they use tools
- legal, medical, or financial advice
- knowing when they are wrong
- distinguishing likely from verified
- preserving nuance in emotionally sensitive situations
- safely handling secrets or private data

They can also **hallucinate**.

A hallucination is when the model generates something that sounds plausible but
is false. It might invent a source, misquote a policy, cite a law that does not
exist, or confidently summarize a document it has not actually seen.

This is not always malicious. It is a failure mode of the technology.

The fix is not “never use AI.”

The fix is:

- ask for sources
- verify important claims
- give the model the actual document when possible
- use tools that can search, calculate, or inspect real files
- keep a human in the loop for consequential decisions

## What is an agent?

An **agent** is usually an LLM connected to tools and given a goal.

A chatbot might answer:

```text
Here is how you could organize your files.
```

An agent might:

1. scan the files
2. identify duplicates
3. propose a folder structure
4. move approved files
5. update an index
6. verify the result
7. report what changed

That is a major shift.

An agent combines:

- a model
- instructions
- tools
- memory or context
- a goal
- a loop for planning and execution

The model decides what to do next, uses a tool, reads the result, and continues.

Simple agent loop:

```text
Goal → Plan → Use tool → Observe result → Adjust plan → Repeat → Report
```

That is powerful.

It also means agents need guardrails.

## Why agents are different from chatbots

The risk profile changes when AI can act.

If a chatbot gives bad advice, you can ignore it.

If an agent has permission to delete files, send emails, spend money, change
infrastructure, or publish content, a bad decision can become a real-world
problem.

That does not make agents bad. It means they need boundaries.

Good agent design includes:

- clear goals
- limited permissions
- approval gates
- audit logs
- safe defaults
- rollback plans
- read-only mode before write mode
- human review before consequential actions

The more power an agent has, the more boring and explicit its controls should
be.

Boring controls are good. Boring controls are how we keep the robot intern from
becoming the robot incident report.

## Practical examples

### Example 1: Writing help

You can ask:

```text
Rewrite this message so it is kind, concise, and firm.
```

Useful for:

- emails
- invitations
- difficult conversations
- professional messages
- thank-you notes

You still decide whether it sounds like you.

### Example 2: Explaining documents

You can paste or upload a document and ask:

```text
Summarize this in plain English. Then list anything I should pay attention to before signing.
```

Useful for:

- school forms
- insurance letters
- technical instructions
- policies
- contracts you are trying to understand

For legal or financial decisions, use this as preparation, not final authority.

### Example 3: Planning

You can ask:

```text
Help me plan a three-day trip with two kids, a moderate budget, and no packed schedule.
```

Useful for:

- travel
- meals
- birthday parties
- home projects
- study plans
- workouts

The model is good at creating a first draft. You edit reality back in.

### Example 4: Technical troubleshooting

You can ask:

```text
Here is the error message. Explain what it means and give me the safest next steps.
```

Useful for:

- computer errors
- appliance manuals
- app settings
- code problems
- home network weirdness

The key is to give the exact error message. Screenshots or copied text help.

### Example 5: Agents doing work

An agent can do more than advise.

For example, an agent might:

- read a GitHub repository
- draft a documentation page
- run a local build
- commit the change
- verify the deployed website

That is not just chat. That is delegated work.

Delegated work needs supervision.

## How to prompt without overthinking it

You do not need magic words. You need clarity.

A strong prompt usually includes:

1. **Goal** — what you want
2. **Context** — what the model needs to know
3. **Audience** — who this is for
4. **Tone** — how it should sound
5. **Constraints** — what to avoid
6. **Output format** — list, table, email, checklist, draft, etc.

Template:

```text
I need help with [goal].

Context:
- [important detail]
- [important detail]

Audience: [who will read/use this]
Tone: [friendly/professional/direct/etc.]
Constraints: [avoid X, keep under Y words, don't mention Z]
Format: [bullets/table/email/checklist]
```

Example:

```text
I need help writing a text to a neighbor about their dog barking late at night.

Context:
- I like this neighbor and want to stay friendly.
- The barking has woken us up three nights this week.
- I do not want to sound threatening.

Audience: neighbor
Tone: warm, direct, not passive-aggressive
Format: short text message
```

That will work better than “write a message about a dog.”

## Safety and privacy basics

Use a simple rule:

> Do not give an AI system anything you would not be comfortable storing in
> someone else's computer system unless you understand and accept the privacy
> terms.

Be careful with:

- passwords
- API keys
- Social Security numbers
- medical records
- tax documents
- legal documents
- private family details
- confidential work information
- children's sensitive information

Some tools offer stronger privacy controls than others. Some business plans say
they do not train on your data. Some local tools keep data on your own machine.

The details matter.

When in doubt:

- remove unnecessary personal information
- summarize instead of pasting full documents
- use initials instead of names
- avoid secrets entirely
- choose a private or local tool for sensitive work

## A practical trust scale

Not every AI answer needs the same level of verification.

| Use case                                                             | Trust level | What to do                                |
| -------------------------------------------------------------------- | ----------: | ----------------------------------------- |
| Brainstorming dinner ideas                                           |    Low risk | Use freely.                               |
| Rewriting a friendly email                                           |    Low risk | Read before sending.                      |
| Summarizing a school policy                                          | Medium risk | Check the original for important details. |
| Medical, legal, or financial advice                                  |   High risk | Treat as preparation; ask a professional. |
| Running commands, deleting files, spending money, publishing content |   High risk | Require human approval and verification.  |

The question is not “Can AI be wrong?”

It can.

The better question is “What happens if it is wrong here?”

## What to remember

If you remember nothing else, remember this:

1. **AI** is the broad category.
2. **LLMs** are language models that generate and reason through text.
3. **ChatGPT, Claude, and Gemini** are products built around LLMs.
4. **Agents** are LLM systems that can use tools and take actions.
5. **LLMs are useful collaborators, not truth machines.**
6. **The more power you give an AI system, the more guardrails it needs.**

Used well, these tools can save time, reduce friction, explain hard things, and
help you get unstuck.

Used carelessly, they can generate confident nonsense or act on bad assumptions.

The practical skill is not believing the hype or rejecting the technology
outright.

The practical skill is learning how to supervise it.

## Glossary

| Term             | Meaning                                                                               |
| ---------------- | ------------------------------------------------------------------------------------- |
| AI               | Broad category of systems that perform tasks associated with intelligence.            |
| Machine learning | AI approach where systems learn patterns from data.                                   |
| LLM              | Large language model; a model trained to understand and generate language.            |
| Chatbot          | A conversational interface, usually powered by an LLM.                                |
| Agent            | An LLM-based system that can use tools and pursue goals.                              |
| Context          | Information the model can see while answering.                                        |
| Prompt           | The instruction or request you give the model.                                        |
| Hallucination    | A plausible-sounding but false model output.                                          |
| Tool use         | When a model can call external tools like search, calculators, file readers, or APIs. |
| Local model      | A model running on your own hardware instead of a cloud provider.                     |

## Next steps

Try using an AI assistant for one low-risk task this week:

- rewrite a message
- summarize an article
- make a checklist
- explain a confusing term
- draft a plan for a small project

Then ask yourself:

- Did it save time?
- Was it accurate?
- Did it sound like me?
- What context would have improved the answer?

That reflection is how you get better at using the tool.

---

_Last updated: 2026-06-13._
