# BYTE — AI Development Prompts

## 1. Initial Project Architecture

### Prompt
Design an architecture for BYTE, an autonomous AI engineering watchdog
for a hackathon. The system should discover current AI and technology
topics, apply editorial filtering, maintain a consistent AI persona,
use persistent memory through Breeth, generate content, and expose
the required backend API endpoints. The architecture should support
a React frontend and Node.js/Express backend.

### Purpose
Establish the initial system architecture and technology boundaries.

### AI Tool
ChatGPT

### Outcome
The project was planned as a React frontend with a Node.js/Express
backend, an autonomous agent layer, topic discovery, editorial
decision-making, content generation, and Breeth-based persistent
memory.

## 2. Initial Frontend Dashboard

### Prompt
Build a modern, polished React dashboard UI for a project called BYTE
(AI Engineering Watchdog).

BYTE is an autonomous AI agent that discovers AI/technology news,
evaluates topics using an editorial decision system, generates
engineering-focused content, and maintains persistent memory.

Create ONLY the frontend UI. Do not create a backend, database,
authentication, API calls, or fake functionality.

The dashboard should include:

1. A professional BYTE header with:
   - BYTE logo/name
   - "AI Engineering Watchdog"
   - Agent status indicator

2. Overview/stat cards:
   - Topics Discovered
   - Topics Accepted
   - Topics Rejected
   - Memories Stored

3. An "Agent Activity" section showing the stages:
   Discover → Retrieve Memory → Evaluate → Generate → Remember

4. A "Latest Intelligence" feed with cards containing:
   - Topic title
   - Short summary
   - Editorial decision
   - Reason
   - Timestamp

5. A sidebar/navigation with:
   - Dashboard
   - Intelligence
   - Memory
   - Decisions
   - Settings

6. A clean dark developer/AI aesthetic.
7. Responsive design.
8. Use React components and clean CSS.
9. Keep the code modular and easy to connect to our Express API later.
10. Do not hard-code the backend URL.
11. Do not add API keys or secrets.

The existing project uses React + Vite.
### Purpose
Generate the initial polished frontend dashboard for BYTE.

### AI Tool
Claude

### Outcome
Generated the initial React dashboard structure and UI. The UI will
later be connected to the BYTE backend APIs.