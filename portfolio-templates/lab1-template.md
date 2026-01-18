# Lab 1: Development Environment Setup

## Overview
This lab establishes the foundational development environment for the Learning Journal PWA.

## Content Template

In Lab 1, I established the foundational development environment for the Learning Journal PWA, a critical first step that would support all subsequent development work. I began by creating a comprehensive GitHub repository to manage version control throughout the project lifecycle. Understanding the importance of maintaining a clean commit history, I ensured all code changes were tracked with meaningful, descriptive commit messages following conventional commit standards (e.g., "feat: add journal entry component", "fix: resolve offline sync issue"). Using Visual Studio Code as my primary Integrated Development Environment (IDE), I configured essential extensions including ESLint for code linting and error detection, Prettier for consistent code formatting, and the TypeScript compiler for static type checking and improved code quality. I also set up workspace settings to ensure consistent formatting across team environments.

I thoroughly explored PythonAnywhere as a potential deployment platform, gaining hands-on experience with hosting Flask applications and serving static files. This involved understanding the platform's file structure, virtual environment setup, and WSGI configuration. While my final deployment architecture uses a different approach with Node.js and Express, this experience proved invaluable for understanding fundamental web hosting concepts including domain configuration, SSL certificates, and server logs. The knowledge of Python deployment would later inform my understanding of how backend services operate in production environments.

For Android development exploration, I installed Android Studio and conducted a comprehensive examination of how PWAs can be packaged as native Android applications using Trusted Web Activities (TWA). This involved running sample Kotlin code to understand the basics of native Android development, including activity lifecycle, XML layouts, and Gradle build configurations. I compared native approaches with web-based development, noting that PWAs offer significant advantages in terms of cross-platform compatibility and deployment simplicity while native apps provide deeper device integration. This analysis directly influenced my decision to focus on PWA development for maximum reach.

The PWA concepts I mastered during this lab included understanding the critical role of manifest.webmanifest files for app installability (including icons, theme colors, display modes, and start URLs), service workers for sophisticated offline caching strategies (cache-first, network-first, stale-while-revalidate), and the app shell architecture pattern for instant loading. These foundational concepts formed the architectural backbone for later labs where I implemented these features comprehensively in my Learning Journal application.

Challenges I faced included correctly configuring Git credentials across multiple environments and understanding the complex relationship between local development branches and remote repository tracking. I resolved these issues by carefully studying the official Git documentation, implementing SSH key authentication for secure passwordless access, and creating a personal workflow that includes regular commits, feature branches, and pull request reviews. These practices have become integral to my development workflow.

## Key Topics Covered
- GitHub repository setup and version control
- Visual Studio Code configuration with extensions
- PythonAnywhere deployment exploration
- Android Studio and TWA concepts
- PWA fundamentals (manifest, service workers, app shell)

## Word Count Target
Minimum: 400 words | Maximum: 600 words
