import { DocumentTemplate } from '../../types/templates';

export const TEMPLATES: DocumentTemplate[] = [
  {
    id: 'blank',
    title: 'Blank Document',
    category: 'General',
    description: 'Start fresh with a clean, standard page layout and typography.',
    iconName: 'File',
    settings: {
      format: 'Letter',
      orientation: 'portrait',
    },
    initialContent: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '' }],
        },
      ],
    },
  },
  {
    id: 'resume',
    title: 'Modern Resume / CV',
    category: 'Personal',
    description: 'A clean, executive resume layout with contact info, skills, and experience sections.',
    iconName: 'User',
    settings: {
      format: 'Letter',
      orientation: 'portrait',
    },
    initialContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1, textAlign: 'left' },
          content: [{ type: 'text', text: 'ALEXANDER MORGAN' }],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'left' },
          content: [
            { type: 'text', marks: [{ type: 'textStyle', attrs: { color: '#0284c7' } }], text: 'Senior Software Architect & Product Engineer' },
            { type: 'text', text: ' | alex.morgan@example.com | (555) 234-5678 | San Francisco, CA' },
          ],
        },
        {
          type: 'callout',
          attrs: { type: 'note' },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Results-driven software architect with 10+ years of experience spearheading distributed systems, cloud applications, and desktop productivity tools. Proven track record of scaling platforms to millions of active users.',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Core Competencies' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Desktop & Web: React, TypeScript, Rust, Tauri, WebAssembly, Electron' }] }],
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Architecture: Distributed systems, CRDTs, high-performance page layout engines' }] }],
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Leadership: Technical strategy, cross-functional engineering management, CI/CD' }] }],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Professional Experience' }],
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Principal Architect — Horizon Software Labs (2021 – Present)' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Led design and rollout of an enterprise-grade document engine reducing memory overhead by 40%.' }] }],
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Engineered cross-platform real-time collaboration supporting concurrent offline edits with zero data loss.' }] }],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Senior Systems Engineer — Apex Tech Inc. (2017 – 2021)' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Built client-side data synchronization pipeline processing 100K updates/sec.' }] }],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Education' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'B.S. in Computer Science & Engineering' },
            { type: 'text', text: ' — University of California, Berkeley (Honors)' },
          ],
        },
      ],
    },
  },
  {
    id: 'business-letter',
    title: 'Formal Business Letter',
    category: 'Business',
    description: 'Professional correspondence with standardized address blocks and letterhead.',
    iconName: 'Mail',
    settings: {
      format: 'Letter',
      orientation: 'portrait',
    },
    initialContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2, textAlign: 'right' },
          content: [{ type: 'text', text: 'BLUECLOUD AI TECHNOLOGIES' }],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'right' },
          content: [{ type: 'text', text: '100 Innovation Way, Suite 400\nSan Francisco, CA 94105\ncontact@bluecloud.ai' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'November 1, 2026' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'Dr. Evelyn Vance' },
            { type: 'text', text: '\nDirector of Academic Operations\nPacific Research Institute\n450 Science Boulevard\nSeattle, WA 98101' },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'Subject: Partnership Proposal for Open Productivity Software Initiative' },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Dear Dr. Vance,' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'We are pleased to submit this formal proposal outlining our strategic initiative to deliver Doc Cloud across educational institutions. Our mission is to equip students, faculty, and research teams with a professional desktop word processing suite without costly licensing fees or restrictive subscription paywalls.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Doc Cloud provides full compatibility with standard academic formats, including native DOCX import/export, LaTeX equation rendering, and citation management. Furthermore, our offline-first architecture ensures complete data confidentiality for sensitive research findings.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'We welcome the opportunity to discuss implementation timelines and look forward to scheduling a conference at your earliest convenience.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Sincerely,' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'Julian Thorne' },
            { type: 'text', text: '\nVice President of Strategic Partnerships\nBlueCloud AI Technologies' },
          ],
        },
      ],
    },
  },
  {
    id: 'research-paper',
    title: 'Academic Research Paper',
    category: 'Academic',
    description: 'Formatted academic manuscript with abstract, LaTeX math equations, tables, and references.',
    iconName: 'BookOpen',
    settings: {
      format: 'A4',
      orientation: 'portrait',
    },
    initialContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1, textAlign: 'center' },
          content: [{ type: 'text', text: 'Real-Time Conflict-Free Replicated Data Types for Distributed Document Editing' }],
        },
        {
          type: 'paragraph',
          attrs: { textAlign: 'center' },
          content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'S. Al-Mansoor, Ph.D.' },
            { type: 'text', text: ' & ' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'H. Chen, M.S.' },
            { type: 'text', text: '\nDepartment of Computer Science, Advanced Systems Laboratory' },
          ],
        },
        {
          type: 'callout',
          attrs: { type: 'quote' },
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', marks: [{ type: 'bold' }], text: 'Abstract: ' },
                {
                  type: 'text',
                  text: 'Collaborative real-time editing in multi-tenant environments necessitates low-latency consensus algorithms resilient to intermittent network partitions. In this paper, we evaluate modern state-based and operation-based CRDT algorithms implemented within local-first desktop architectures. Empirical benchmarks reveal sub-millisecond local latency with asymptotic memory convergence under high concurrency.',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '1. Introduction' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Decentralized text collaboration has traditionally relied on Operational Transformation (OT), requiring centralized ordering servers. Conversely, Conflict-Free Replicated Data Types guarantee strong eventual consistency through mathematical commutativity.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '2. Mathematical Formulation' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'The state evolution across replica nodes is governed by the state-transition equation:' }],
        },
        {
          type: 'mathBlock',
          attrs: { latex: 'S_{t+1} = S_t \\sqcup \\Delta(O_i)', displayMode: true },
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '3. Empirical Results' }],
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Peer Count' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Throughput (ops/sec)' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Convergence Time (ms)' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '14,250' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '0.84' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '10' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '11,800' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '2.15' }] }] },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'project-proposal',
    title: 'Project Proposal',
    category: 'Business',
    description: 'Executive project proposal covering objectives, scope, timeline, budget, and deliverables.',
    iconName: 'Briefcase',
    settings: {
      format: 'Letter',
      orientation: 'portrait',
    },
    initialContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Project Proposal: Next-Generation Enterprise Workspace' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'Prepared For: ' },
            { type: 'text', text: 'Executive Steering Committee\n' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'Date: ' },
            { type: 'text', text: 'November 2026' },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '1. Executive Summary' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This project aims to transition the enterprise from vendor-locked, subscription-based cloud productivity suites to Doc Cloud — a secure, local-first word processing ecosystem that eliminates recurring per-seat fees while boosting editing performance.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '2. Project Budget & Resource Allocation' }],
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Phase / Deliverable' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Estimated Duration' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Projected Cost' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Pilot Deployment & Training' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '4 Weeks' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '$0 (Open Source)' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Annual Cloud Licensing Savings' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Ongoing' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '+$140,000 / year' }] }] },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'meeting-minutes',
    title: 'Meeting Minutes',
    category: 'Business',
    description: 'Structured corporate meeting minutes with agenda, attendees, decisions, and action items.',
    iconName: 'CheckSquare',
    settings: {
      format: 'Letter',
      orientation: 'portrait',
    },
    initialContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Product Strategy — Meeting Minutes' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'Date: ' },
            { type: 'text', text: 'November 1, 2026 | ' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'Time: ' },
            { type: 'text', text: '10:00 AM – 11:30 AM PST\n' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'Attendees: ' },
            { type: 'text', text: 'Sadiq (Lead Architect), Sarah K. (UI/UX), David M. (Core Engine), Elena R. (QA)' },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Key Decisions' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Approved release candidate 1.0 architecture featuring full DOCX round-trip compatibility.' }] }],
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Mandated strict zero-telemetry policy to uphold complete user document privacy.' }] }],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Action Items' }],
        },
        {
          type: 'taskList',
          content: [
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Implement native multi-page pagination engine with margins and page breaks.' }] }],
            },
            {
              type: 'taskItem',
              attrs: { checked: true },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Build interactive Ribbon toolbar with 8 primary tabs and context controls.' }] }],
            },
            {
              type: 'taskItem',
              attrs: { checked: false },
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Finalize multi-platform installer packages for macOS, Windows, and Linux.' }] }],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'invoice',
    title: 'Professional Invoice',
    category: 'Business',
    description: 'Clean billing invoice with itemized services, tax calculation, and payment terms.',
    iconName: 'Receipt',
    settings: {
      format: 'Letter',
      orientation: 'portrait',
    },
    initialContent: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'INVOICE #INV-2026-089' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'Issued By: ' },
            { type: 'text', text: 'BlueCloud AI Technologies\n' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'Billed To: ' },
            { type: 'text', text: 'Acme Global Enterprises\n' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'Due Date: ' },
            { type: 'text', text: 'November 30, 2026' },
          ],
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Description' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hours' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Rate' }] }] },
                { type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Amount' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Custom Document Workflow Architecture' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '40' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '$150/hr' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '$6,000.00' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'CRDT Multi-User Synchronization Server' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '25' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '$150/hr' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '$3,750.00' }] }] },
              ],
            },
            {
              type: 'tableRow',
              content: [
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Total Due' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '-' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '-' }] }] },
                { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', marks: [{ type: 'bold' }], text: '$9,750.00' }] }] },
              ],
            },
          ],
        },
      ],
    },
  },
];
