# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a resource repository for the [Understanding TypeScript](https://acad.link/typescript) Udemy course by Maximilian Schwarzmüller. It contains code snapshots and lecture attachments — not a single buildable application.

## Structure

- **`code/`** — Completed code snapshots per course section (numbered 01–19)
- **`attachments/`** — Starting project templates and standalone files attached to lectures
- **`other/`** — Course slides and update documentation

Each subfolder is numbered by section (e.g., `02-essentials`, `08-generics`, `18-react-ts`). Sections are independent mini-projects, not parts of a single app.

## Running Section Code

Most sections use standalone `.ts` files compiled with `tsc`. Some sections have their own `package.json`:

- **Sections using lite-server** (03, 05, 12, 13, 14): `npm install && npm start` to serve via lite-server; compile TS separately with `tsc` or `tsc -w`
- **Section 15 (Vite)**: Has both `vite/` and `without-vite/` subdirectories; the Vite project uses `npm run dev`
- **Section 18 (React + TS)**: Standard Vite + React setup; `npm install && npm run dev`
- **Section 19 (Node + TS)**: Node.js TypeScript project

There is no global `package.json`, build command, or test suite at the repository root.

## Key Context

The course was significantly updated — sections 4, 9, 10, 11, 15 are brand-new additions. Section 11 covers standard ECMAScript decorators while section 12 covers the older experimental decorator syntax. See `other/what-changed.md` for full update details.

## Recommended Agents for Course Development

This is a Udemy coding course. The following agents are most valuable for maintaining and improving it:

### Technical Writer
Use for: rewriting lecture descriptions, improving code comments for student clarity, creating step-by-step instructions in attachments, and ensuring code snapshots have clear inline explanations. Best when a section's code needs to teach, not just work.

### Corporate Training Designer
Use for: evaluating section ordering and learning progression, identifying gaps between sections (e.g., missing prerequisite concepts), designing practice exercises, and structuring new sections with learning objectives. Consult when adding or reorganizing course content.

### Content Creator
Use for: drafting Udemy course descriptions, section summaries, promotional copy, and supplementary materials like cheat sheets or quick-reference guides that students can download.

### Code Reviewer
Use for: auditing code snapshots for pedagogical quality — catching patterns that work but would confuse learners, ensuring consistency across sections, and verifying that "starting project" templates in `attachments/` cleanly set up what the corresponding `code/` snapshot builds toward.

### Software Architect
Use for: explaining design decisions in the more advanced sections (generics, decorators, modules, React/Node integration), ensuring architectural patterns taught in later sections build naturally on earlier ones, and reviewing whether demo projects reflect real-world practices students will encounter.

### Developer Advocate
Use for: improving the student experience end-to-end — README clarity, repository navigation, Q&A response templates, and identifying friction points where students commonly get stuck. Also useful for planning community engagement around course updates.
