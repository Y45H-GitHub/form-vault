# Master UI/UX Redesign Prompt

You are an award-winning Product Designer, UX Researcher, and Senior Frontend Engineer with 15+ years of experience designing desktop software for Windows 11.

Your expertise includes:

* Windows 11 Fluent Design
* Modern SaaS interfaces
* Glassmorphism done tastefully
* Typography and visual hierarchy
* Color psychology
* Accessibility (WCAG AA)
* Micro-interactions
* Information architecture
* Electron applications
* React + Tailwind + shadcn/ui

Your job is **NOT** to restyle the application.

Your job is to redesign it so that it feels like a polished commercial desktop application in 2026.

Think along the quality bar of:

* Cursor
* Notion
* Raycast
* Arc Browser
* Spotify Desktop
* Linear
* Microsoft Loop
* Windows 11 native apps

The application should immediately communicate:

> "Fast, trustworthy, premium, invisible productivity."

---

# Product

The product is called **FormVault**.

It is a desktop productivity application that lives in the Windows system tray.

Workflow:

User presses a global hotkey

↓

A floating popup appears beside the cursor

↓

User searches for saved information

↓

Presses Enter

↓

Information is copied and pasted anywhere on Windows.

It works inside

* Browsers
* PDF Readers
* Microsoft Office
* Government portals
* Desktop applications

The application should feel extremely fast.

The popup should disappear before the user even thinks about it.

The UI must reinforce speed.

---

# Tech Stack

Desktop:
Electron + electron-vite

Frontend:
React 18
TypeScript

UI:

* Tailwind CSS
* shadcn/ui

Icons:

Heroicons only

Database:

SQLite

Theme:

Follow Windows OS theme automatically.

Do not create an independent theme switch.

Use Tailwind utility classes only.

Do not introduce another styling solution.

---

# Overall Design Direction

The design language should combine:

* Notion's simplicity
* Cursor's polish
* Spotify's confidence
* Windows 11 Fluent Design
* Modern glassmorphism

Avoid:

* Dribbble gimmicks
* Heavy gradients
* Excessive shadows
* Neon colors
* Rounded-everything syndrome
* Large empty spaces

Everything should feel intentional.

---

# Brand Personality

The interface should feel:

Minimal

Professional

Trustworthy

Premium

Calm

Modern

Fast

Invisible

The product stores personal and financial information.

Users must subconsciously trust it.

---

# Color Theory

Redesign the complete palette.

Choose colors based on modern color theory.

Requirements:

* Excellent dark mode
* Excellent light mode
* Automatic OS theme
* Comfortable long-term usage
* Accessible contrast
* Soft neutral backgrounds
* Carefully chosen accent colors
* Avoid overly saturated colors

Glass effects should be subtle.

Never sacrifice readability.

---

# Typography

Choose the best typography for this application.

You may replace Inter if another font better matches the design language.

Explain why.

Define:

Display

Heading

Body

Caption

Labels

Monospace (if needed)

Include:

Font weights

Letter spacing

Line heights

Visual rhythm

---

# Spacing System

Redesign the spacing system.

Create a consistent spacing scale.

Every component should feel aligned.

Nothing should appear randomly positioned.

---

# Corner Radius

Choose a radius system.

Example:

Cards

Buttons

Inputs

Dropdowns

Dialogs

Pills

Explain why.

---

# Shadows

Create an elevation system.

Popup

Hover

Modal

Dropdown

Tooltip

The application should feel layered without becoming noisy.

---

# Motion

Use subtle animation only.

Maximum duration:

150 ms

Create animation rules for:

Popup appear

Popup disappear

Hover

Focus

Button press

Dropdown

Selection

Copy success

Window transitions

No flashy animations.

---

# Icons

Use Heroicons consistently.

Every icon should have a purpose.

Avoid icon overload.

Maintain consistent sizing.

---

# Accessibility

Everything must satisfy WCAG AA.

Keyboard-first navigation.

Visible focus rings.

High contrast.

Large click targets.

Proper disabled states.

Proper empty states.

Proper loading states.

Proper error states.

---

# UX Principles

Always optimize for speed.

Minimize cognitive load.

Reduce unnecessary clicks.

Reduce visual clutter.

Reduce eye movement.

The user should rarely think.

Everything should feel obvious.

---

# Windows

There are exactly three windows.

---

## 1. Popup (Most Important)

Users spend roughly 90% of their time here.

This window deserves the majority of design effort.

Current flow:

Header

↓

Search

↓

Category pills

↓

Results

↓

Footer

Reimagine this entire experience.

Think about:

Information hierarchy

Search prominence

Keyboard-first UX

Visual feedback

Copy confirmation

Selection states

Empty states

Sensitive field masking

Scrolling

Hover interactions

Accessibility

Speed perception

Design this as though it were a premium command palette rather than a basic search popup.

---

## Popup Constraints

420 px wide

520 px maximum height

Frameless

Transparent

Glassmorphism

Appears near cursor

Always on top

Auto-focused search

Disappears after copy

Keyboard-first

---

## 2. Vault Manager

Purpose:

Create

Edit

Delete

Profiles

Categories

Fields

Files

This is an administrative workspace.

Redesign it using modern productivity software principles.

Think:

Notion

Linear

Cursor settings

Use excellent hierarchy.

Improve:

Sidebar

Field editing

Grouping

Dialogs

Tables

Search

Empty states

Forms

Reduce visual noise.

---

## 3. Settings

Purpose:

Rarely visited.

Should be clean.

Organize settings into logical groups.

Examples:

General

Hotkeys

Startup

Backup

Appearance

About

Reduce scrolling.

Use modern settings cards.

---

# Component System

Redesign every component.

Buttons

Inputs

Dropdowns

Search

Cards

Modals

Tooltips

Tabs

Badges

Pills

Context menus

Checkboxes

Switches

Lists

Hover states

Focus states

Scrollbar

Dialogs

Toast notifications

Everything should belong to one coherent design language.

---

# UX Improvements

You are allowed to:

Rename buttons

Rearrange layouts

Improve workflows

Merge UI sections

Improve navigation

Improve discoverability

Simplify interactions

Reduce unnecessary UI

As long as functionality remains unchanged.

---

# Design Tokens

Create a proper design system.

Include:

Primary

Secondary

Accent

Success

Warning

Danger

Surface

Background

Border

Muted

Typography

Spacing

Elevation

Radius

Animation

Opacity

Blur

Selection

Hover

Focus

Everything should be reusable.

---

# Deliverables

Do not simply produce prettier React components.

Instead:

1. Audit the current UI.

2. Explain every weakness.

3. Explain UX problems.

4. Explain accessibility issues.

5. Explain visual hierarchy issues.

6. Propose improvements.

7. Design a complete design system.

8. Redesign every window.

9. Redesign every reusable component.

10. Implement everything using:

* React 18
* Tailwind CSS
* shadcn/ui
* Heroicons

11. Keep the architecture clean.

12. Refactor duplicated styling into reusable components.

13. Preserve all existing functionality.

14. Do not introduce unnecessary dependencies.

15. Ensure the final application feels like a premium commercial Windows application rather than an Electron hobby project.

---

## Final Quality Checklist

Before considering the redesign complete, verify:

* Every screen follows a single design language.
* Visual hierarchy is immediately understandable.
* Typography is consistent.
* Spacing is mathematically consistent.
* Color usage is intentional.
* Keyboard navigation is flawless.
* Accessibility meets WCAG AA.
* Performance is unaffected.
* Animations remain subtle (≤150 ms).
* The popup feels as polished as Cursor's command palette.
* The Vault Manager feels as organized as Notion.
* The entire application looks native to Windows 11 while retaining a unique premium identity.

**One additional recommendation:** ask the AI to **work iteratively rather than rewriting the entire app in one pass**. Have it redesign in this order: **(1) design tokens → (2) shared component library → (3) Popup → (4) Vault Manager → (5) Settings → (6) polish and consistency review**. This usually produces much higher-quality results and avoids inconsistent styling across windows.
