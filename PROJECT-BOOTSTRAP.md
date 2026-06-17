“Read PROJECT_BOOTSTRAP.md in full and treat it as the governing specification for this repository. Do not introduce functionality outside the documented MVP scope, and implement changes incrementally while preserving the existing architecture.”

# PROJECT_BOOTSTRAP.md

# ITPMS Frontend Master Playbook

## Read Me First (For Amazon Q)

You are contributing to the frontend of the **IT Project Management System (ITPMS)** for a South African municipality.

This document is the **authoritative implementation guide** for this repository.

Before generating or modifying code:

1. Read this document completely.
2. Follow it as the source of truth.
3. Prefer incremental improvements over large rewrites.
4. Do not invent requirements that are not described here.
5. If uncertain, preserve existing architecture and ask for clarification through comments rather than making assumptions.

---

# Project Goal

Build a modern, maintainable, production-ready frontend for a municipal IT Project Management System.

The backend is being developed separately as a **Laravel REST API**.

The frontend must be designed so that backend integration requires minimal changes.

---

# Technology Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Table
* React Hook Form
* Zod

Development environment:

* GitHub Codespaces
* Amazon Q

Deployment target:

* Vercel

---

# Template Usage Policy

The project begins from a Next.js admin dashboard template.

Treat the template as **infrastructure**, not as the finished application.

Reuse where appropriate:

* dashboard shell
* layouts
* navigation
* cards
* tables
* dialogs
* forms
* responsive behaviour

Do not force unrelated demo concepts into municipal workflows.

---

# MVP Scope

Only implement these functional areas during the initial sprint:

1. Executive Dashboard
2. Project Initiation
3. Project Planning
4. Project Monitoring

Everything else should remain future work.

---

# Initial Business Workflow

The initial user flow is:

1. Project Manager creates a project.
2. Project Manager assigns work.
3. Project Team Member submits status updates.
4. Project Manager reviews or confirms updates.
5. Executive Management views dashboards and reports.

Design around this workflow.

---

# User Roles

## System Administrator

Administrative configuration and user management.

## ICT Director

Project oversight and executive approvals.

## Project Manager

Creates and manages projects.

## Project Team Member

Provides project updates and completes assigned work.

## Executive Management

Consumes dashboards and reports.

## Internal Auditor

Reviews audit information and documentation.

---

# Functional Requirements Summary

The long-term vision includes:

* Project Portfolio Management
* Project Initiation
* Project Planning
* Budget Management
* Procurement Management
* Resource Management
* Risk Management
* Change Management
* Issue Management
* Document Management
* Project Monitoring
* Reporting and Dashboards
* Audit Management
* Notifications
* System Administration

However, the current implementation should focus only on the MVP scope.

---

# Architecture Principles

Use feature-oriented organisation.

Business logic should be isolated from presentation.

Pages should primarily compose reusable components.

Avoid tightly coupling UI to backend implementations.

Use service abstractions to enable future Laravel integration.

---

# Mock Data Strategy

During early development:

* use mock data
* isolate mock implementations
* make replacement with live APIs straightforward

Avoid embedding mock data directly into UI components.

---

# Design Principles

The interface should feel:

* professional
* clean
* trustworthy
* suitable for municipal operations

Avoid novelty effects or unnecessary visual complexity.

Status indicators should consistently represent:

* GREEN → On Track
* AMBER → At Risk
* RED → Delayed

---

# Executive Dashboard Expectations

The dashboard should eventually support visibility into:

* Total Projects
* Active Projects
* Delayed Projects
* Portfolio Health
* Status Distribution
* Progress Overview

---

# Projects Module Expectations

Projects are the primary business entity.

Support concepts including:

* Project Code
* Title
* Description
* Status
* Progress
* Assigned Manager
* Dates

Keep the implementation extensible.

---

# Planning Module Expectations

Support planning concepts such as:

* milestones
* scheduling
* assignments

Do not misuse unrelated UI paradigms simply because they exist in the base template.

---

# Monitoring Module Expectations

Support:

* status updates
* progress tracking
* project health
* executive visibility

---

# Coding Standards

Generate clean, maintainable TypeScript.

Prefer reuse over duplication.

Avoid speculative abstractions.

Avoid unnecessary dependencies.

Maintain accessibility and responsiveness.

Keep components focused and modular.

---

# Guardrails

Do NOT:

* invent requirements
* create unrelated SaaS functionality
* tightly couple frontend to backend internals
* over-engineer the MVP
* modify unrelated parts of the project without reason

Do:

* preserve architecture
* keep commits incremental
* keep naming consistent
* favour clarity over cleverness

---

# Development Sequence

Recommended order of implementation:

1. Validate and simplify the template.
2. Configure navigation for municipal workflows.
3. Implement the Projects experience.
4. Implement Project Planning.
5. Implement Project Monitoring.
6. Build the Executive Dashboard.
7. Replace mocks with Laravel API integration.
8. Expand into later modules.

---

# Definition of Success

The MVP is considered successful when:

* project information can be captured and managed,
* planning information is represented clearly,
* project progress can be monitored,
* executives can consume meaningful dashboards,
* and the architecture cleanly supports future expansion and Laravel integration.

---

# Final Principle

Build a system that is easy to understand, easy to extend, and appropriate for a municipal ICT environment.

Choose maintainability, consistency, and incremental delivery over unnecessary complexity.