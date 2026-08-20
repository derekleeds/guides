---
title: "AI Safety for Normal People"
linkTitle: "AI Safety for Normal People"
date: 2026-06-13
lastUpdated: 2026-06-13
authors: ["Derek Leeds"]
categories: [ai, agents, security]
tags: [ai, llm, safety, privacy, security, chatgpt, claude, primer]
description:
  "A practical, non-paranoid guide to using AI assistants safely: privacy,
  hallucinations, scams, kids, work data, and agent permissions."
weight: 3
---

AI safety can sound dramatic.

Depending on who is talking, it either means “do not paste your password into
ChatGPT” or “the machines are coming for civilization.”

This guide is about the first kind: practical safety for normal people using AI
tools in everyday life.

No panic. No sci-fi. Just useful habits.

## The short version

Use AI safely by remembering six rules:

1. **Do not paste secrets or sensitive personal information.**
2. **Verify important claims before acting on them.**
3. **Use AI for drafts and preparation, not final authority.**
4. **Be extra careful with medical, legal, financial, and work data.**
5. **Understand when an AI can take actions, not just answer questions.**
6. **Keep humans in charge of consequential decisions.**

That is most of the practical safety model.

## AI is useful, not automatically trustworthy

AI assistants can be extremely helpful.

They can explain confusing documents, rewrite messages, summarize articles,
brainstorm ideas, help with code, and turn messy notes into something usable.

But helpful is not the same as trustworthy.

An AI answer can be:

- clear but wrong
- confident but incomplete
- useful but missing context
- polite but unsafe
- persuasive but unverified

The model is optimized to produce a helpful response. It is not automatically
verifying truth unless it has tools, sources, and instructions to do so.

That means you should treat AI like a capable assistant, not an oracle.

## The most important safety habit: do not paste secrets

Do not paste:

- passwords
- API keys
- private keys
- recovery codes
- Social Security numbers
- full bank account details
- full tax documents
- medical identifiers
- confidential work material
- children's sensitive information

If the AI does not need the sensitive detail, remove it.

Instead of this:

```text
Here is the full letter with my account number and address. What does it mean?
```

Use this:

```text
Here is a redacted version of the letter. Summarize what it is asking me to do and list any questions I should ask the provider.
```

You can replace personal details with placeholders:

```text
[NAME]
[ACCOUNT NUMBER]
[ADDRESS]
[DATE]
```

The model does not need your actual account number to explain a paragraph.

## Redaction is normal hygiene

Redaction is not paranoia.

It is the digital equivalent of not reading your credit card number out loud in
a crowded room.

Before pasting text into an AI tool, scan for:

- names
- addresses
- account numbers
- case numbers
- policy numbers
- school names
- employer names
- signatures
- QR codes
- links with private tokens

If those details do not matter, remove them.

If they do matter, consider whether this is the right AI tool for the job.

Some tools have stronger privacy guarantees than others. Some business plans
have different data-use policies than free consumer tools. Local AI tools may
keep data on your own hardware but require more setup and may be less capable.

The privacy details matter.

## Hallucinations: confident does not mean correct

A hallucination is when an AI generates something plausible but false.

It might:

- invent a source
- misquote a policy
- summarize a document it has not seen
- cite a law that does not exist
- make up a product feature
- confidently explain the wrong error message

This happens because the model is generating likely language, not directly
accessing truth by default.

For low-risk tasks, this is not a big deal.

If it suggests a mediocre dinner idea, nobody is going to federal prison.

For important tasks, verify.

Ask:

```text
What parts of this should I verify before acting on it?
```

Or:

```text
Separate what you know from what you are assuming.
```

Or:

```text
Give me sources for the factual claims.
```

Then actually check the important parts.

## Use a risk scale

Not every AI interaction needs the same level of caution.

| Use case                                                      |   Risk | Safety posture                                                          |
| ------------------------------------------------------------- | -----: | ----------------------------------------------------------------------- |
| Brainstorming dinner ideas                                    |    Low | Use freely.                                                             |
| Rewriting a friendly email                                    |    Low | Read before sending.                                                    |
| Summarizing a public article                                  |    Low | Spot-check if important.                                                |
| Explaining a school or insurance letter                       | Medium | Redact personal details and verify against the original.                |
| Medical, legal, or financial preparation                      |   High | Use for questions and summaries, not final advice.                      |
| Work confidential data                                        |   High | Follow employer policy; do not paste restricted data into public tools. |
| Agents that can send, delete, buy, publish, or modify systems |   High | Require explicit human approval and logs.                               |

The question is not “Can AI be wrong?”

It can.

The useful question is:

> What happens if this answer is wrong?

The bigger the consequence, the more verification you need.

## Medical, legal, and financial topics

AI can be useful for preparing for professional conversations.

Good uses:

```text
Explain these terms in plain English.
```

```text
Help me make a list of questions to ask my doctor.
```

```text
Summarize this policy language and identify what I should verify.
```

```text
Help me organize my notes before I talk to a financial advisor.
```

Bad uses:

```text
Diagnose me.
```

```text
Tell me whether I should sign this contract.
```

```text
Tell me exactly what investment to make.
```

For high-stakes domains, AI is a preparation tool.

It can help you understand, organize, and ask better questions. It should not
replace qualified professional judgment.

## Work data: follow policy first

If you are using AI at work, the first rule is simple:

> Follow your organization's policy.

Do not paste confidential work data into a public AI tool just because it would
be convenient.

Be careful with:

- customer data
- employee data
- contracts
- source code
- internal strategy
- financial reports
- security findings
- meeting transcripts
- regulated data

If your company provides an approved AI tool, use that. If it does not, ask
before using external tools with internal data.

Convenience is not a data-handling policy.

## Kids and AI

AI tools can be useful for kids, but they need boundaries.

Good uses:

- explaining concepts at the right grade level
- generating practice questions
- helping outline an essay
- making study guides
- brainstorming project ideas
- explaining math steps after the child has tried

Risky uses:

- writing the assignment for them
- private unsupervised conversations
- sharing personal details
- treating AI answers as automatically true
- using AI as an emotional support substitute

A useful rule:

> AI can help kids learn, but it should not quietly do the learning for them.

For younger kids, use AI together. Ask it to explain, quiz, or coach — not
complete the work.

## Scams and fake content

AI makes scams cheaper and more convincing.

Be skeptical of:

- urgent messages asking for money
- voice calls that sound like someone you know
- realistic images or videos
- emails that perfectly match someone's writing style
- links that ask you to log in
- “support” messages that ask for codes or passwords

AI-generated scams often rely on urgency.

Slow down.

Verify through a separate channel:

- call the person directly
- use a saved phone number, not the one in the message
- go to the website yourself, not through the link
- ask a shared question only the real person would know
- never share one-time codes with someone who contacted you

The old scam rule still works:

> Urgency is a weapon. Pause before acting.

## Agents need stronger guardrails

A normal chatbot gives answers.

An agent can take actions.

That might include:

- sending emails
- changing files
- publishing a website
- buying something
- updating a calendar
- calling APIs
- modifying infrastructure
- deleting data

The moment an AI can act, the safety model changes.

For agents, use:

- read-only mode first
- limited permissions
- explicit approval before writes
- clear logs of what changed
- rollback plans
- separate accounts with minimal access
- spending limits
- allowlists for safe actions
- blocklists for dangerous actions

Do not give a powerful agent broad access and vague instructions.

That is how you turn “helpful automation” into “why did the robot reorganize the
garage with a flamethrower?”

## A simple approval rule

Require human approval before an AI system does anything that is:

- hard to undo
- expensive
- public
- legally meaningful
- emotionally sensitive
- privacy-impacting
- security-impacting
- destructive

Examples:

- sending an angry email
- publishing a public post
- deleting files
- changing account settings
- buying something
- modifying infrastructure
- sharing private information

Drafts are fine.

Actions need approval.

## Check the source when it matters

If an AI summarizes a document, keep the document nearby.

Ask it to quote the relevant section:

```text
Quote the exact sentence you are basing that on.
```

Ask it to separate summary from interpretation:

```text
Separate the document's claims from your interpretation.
```

Ask it to identify uncertainty:

```text
What is unclear or ambiguous here?
```

Then compare the answer back to the original.

AI can make reading easier. It should not make you stop reading the parts that
matter.

## Good safety prompts

### Before acting on advice

```text
What assumptions are you making, and what should I verify before acting on this?
```

### For sensitive documents

```text
I will provide a redacted document. Summarize it, list action items, and identify anything I should verify in the original.
```

### For professional topics

```text
Do not give final legal, medical, or financial advice. Help me understand the topic and prepare questions for a qualified professional.
```

### For factual claims

```text
List the factual claims in your answer and indicate which ones require external verification.
```

### For agent actions

```text
Before taking any action, show me the exact change you plan to make, the risk, and how to undo it. Wait for approval.
```

### For work data

```text
Assume this may contain confidential information. Tell me what I should redact before asking for help.
```

## A personal safety checklist

Before using AI, ask:

- Am I pasting any sensitive information?
- Would redaction still let the AI help me?
- Is this a low-risk task or a high-risk task?
- Do I need sources or verification?
- Could this answer affect money, health, legal rights, work, or relationships?
- Is the AI only drafting, or can it actually take action?
- If it takes action, can I review and approve first?

This takes seconds once it becomes a habit.

## What to remember

AI safety for normal people is not about fear.

It is about control.

Use AI to:

- draft
- summarize
- explain
- brainstorm
- organize
- prepare
- compare

Be careful when AI touches:

- secrets
- private data
- professional advice
- children
- money
- health
- legal issues
- work information
- public actions
- destructive actions

The goal is not to avoid AI.

The goal is to use it like a powerful tool: intentionally, with the right
guardrails, and with a human still holding the steering wheel.

## Related guides

- [AI, LLMs, ChatGPT, Claude, and Agents: A Practical Primer](/docs/ai/ai-llms-agents-primer/)
- [How to Prompt Without Feeling Weird](/docs/ai/how-to-prompt-without-feeling-weird/)

---

_Last updated: 2026-06-13._
