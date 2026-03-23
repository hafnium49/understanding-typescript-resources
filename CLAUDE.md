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
