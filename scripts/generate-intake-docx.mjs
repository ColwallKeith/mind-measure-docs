/**
 * Generate the Company Onboarding Questionnaire as a fillable .docx.
 *
 * Output: public/downloads/mind-measure-onboarding-questionnaire.docx
 *
 * Run with: node scripts/generate-intake-docx.mjs
 *
 * The .docx is committed to the repo so it deploys at
 * docs.mindmeasure.co.uk/downloads/mind-measure-onboarding-questionnaire.docx
 * and can be linked from the questionnaire page.
 *
 * Keep the content in this file in sync with
 * pages/operations/company-intake.mdx (both target the same audience).
 */

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  PageBreak,
  Footer,
  Header,
  PageNumber,
  LevelFormat,
  convertInchesToTwip,
} from 'docx';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'downloads');
const OUT_PATH = join(OUT_DIR, 'mind-measure-onboarding-questionnaire.docx');

// ─── Style helpers ────────────────────────────────────────────────────────

const NAVY = '2B3A52';
const STEEL = '6B8DB2';
const ANSWER_BG = 'F4F6FA';
const BORDER = 'CBD5E1';

const cellBorder = {
  top: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  left: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
  right: { style: BorderStyle.SINGLE, size: 4, color: BORDER },
};

const heading = (text, level = HeadingLevel.HEADING_1) =>
  new Paragraph({
    heading: level,
    spacing: { before: 360, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        color: NAVY,
        size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 26 : 22,
      }),
    ],
  });

const body = (text, { italic = false, bold = false } = {}) =>
  new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, italics: italic, bold, size: 22 })],
  });

const small = (text) =>
  new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, italics: true, color: '64748B', size: 20 })],
  });

const blank = () => new Paragraph({ spacing: { after: 80 }, children: [] });

const questionCell = (text, opts = {}) =>
  new TableCell({
    width: { size: opts.width ?? 55, type: WidthType.PERCENTAGE },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    borders: cellBorder,
    children: [
      new Paragraph({
        children: [new TextRun({ text, size: 22 })],
      }),
    ],
  });

const answerCell = (opts = {}) =>
  new TableCell({
    width: { size: opts.width ?? 45, type: WidthType.PERCENTAGE },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    borders: cellBorder,
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: ANSWER_BG },
    children: [new Paragraph({ children: [new TextRun({ text: '', size: 22 })] })],
  });

const headerCell = (text, widthPct) =>
  new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    borders: cellBorder,
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: NAVY },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 22 })],
      }),
    ],
  });

/**
 * A simple two-column question/answer table.
 * questions: Array<string>
 */
const qaTable = (questions) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [headerCell('Question', 55), headerCell('Your answer', 45)],
      }),
      ...questions.map(
        (q) =>
          new TableRow({
            children: [questionCell(q), answerCell()],
          })
      ),
    ],
  });

/**
 * A four-column workplace-field table specifically for section 4.
 */
const fourColTable = (rows) =>
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          headerCell('We ask employees', 28),
          headerCell('Default label', 18),
          headerCell('What would you call this?', 22),
          headerCell('Options / notes', 32),
        ],
      }),
      ...rows.map(
        (r) =>
          new TableRow({
            children: [
              questionCell(r[0], { width: 28 }),
              questionCell(r[1], { width: 18 }),
              answerCell({ width: 22 }),
              answerCell({ width: 32 }),
            ],
          })
      ),
    ],
  });

/**
 * Multi-line free-text answer block. Labelled prompt with an empty
 * shaded box people can write inside.
 */
const longAnswer = (placeholder = '') => {
  const lines = [];
  if (placeholder) lines.push(new TextRun({ text: placeholder, italics: true, color: '94A3B8', size: 20 }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { top: 200, bottom: 600, left: 200, right: 200 },
            borders: cellBorder,
            shading: { type: ShadingType.CLEAR, color: 'auto', fill: ANSWER_BG },
            children: [new Paragraph({ children: lines })],
          }),
        ],
      }),
    ],
  });
};

const divider = () =>
  new Paragraph({
    spacing: { before: 240, after: 240 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BORDER, space: 1 } },
    children: [],
  });

// ─── Content ──────────────────────────────────────────────────────────────

const children = [];

// Title block
children.push(
  new Paragraph({
    spacing: { before: 0, after: 80 },
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text: 'Mind Measure', bold: true, color: STEEL, size: 22 })],
  }),
  new Paragraph({
    spacing: { after: 240 },
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({ text: 'Company Onboarding Questionnaire', bold: true, color: NAVY, size: 44 }),
    ],
  }),
  body(
    'Welcome, and thank you for choosing Mind Measure to support your people. This short questionnaire helps us set up your organisation on the Mind Measure platform so that everything is ready for the day your pilot launches.'
  ),
  body(
    'It should take roughly 30 minutes to complete with the right people in the room (typically HR, with an occasional dip into IT for section 5). Please return the completed document to your Mind Measure account manager. If you are unsure of any answer, leave it blank and we will discuss it at your kick-off call.'
  ),
  heading('How Mind Measure works at your organisation', HeadingLevel.HEADING_2),
  body(
    'Mind Measure has two touchpoints, and a few of the questions below relate to each one, so it helps to have this in mind as you go through:'
  ),
  body(
    '  •  The mobile app (native iOS and Android) is where your employees check in, see their wellbeing scores, and access the support resources you have signed off. Employees do not access Mind Measure through a web browser.'
  ),
  body(
    '  •  The admin dashboard (web) is where your HR and welfare team view anonymised, aggregated results, manage cohort analysis, and run reports. Only your nominated welfare and HR contacts have access.'
  ),
  small(
    'A note on brand and design: your communications team will handle logos, colours and any marketing assets as a separate workstream. There are no design questions in this document.'
  ),
  divider()
);

// ─── 1. About your organisation ───
children.push(
  heading('1. About your organisation'),
  qaTable([
    'Registered company name',
    'Display name (what employees will see in the app)',
    'Company website',
    'Headquarters location (city, country)',
    'Countries this pilot will cover',
    'Total employee headcount',
    'How many employees will be in the first pilot wave?',
    'Preferred pilot launch date',
    'Expected trial duration (e.g. 12 weeks, 6 months)',
    'What does success look like for this pilot? (one or two sentences)',
  ]),
  divider()
);

// ─── 2. People we'll work with ───
children.push(
  heading('2. People we will work with'),
  body(
    'We need at least three named contacts at your organisation so that we always have someone reachable.'
  ),

  heading('2.1 Primary HR / programme owner (required)', HeadingLevel.HEADING_2),
  body('The person who owns the rollout day to day.', { italic: true }),
  qaTable(['Name', 'Job title', 'Work email', 'Direct phone']),
  blank(),

  heading('2.2 Welfare lead (required)', HeadingLevel.HEADING_2),
  body(
    'The person we will escalate to if Mind Measure detects an employee may be at risk of harm. This is often the same person as 2.1, but does not have to be.',
    { italic: true }
  ),
  qaTable([
    'Name',
    'Job title',
    'Work email',
    'Direct phone',
    'Out-of-hours contact (if different)',
  ]),
  blank(),

  heading('2.3 IT / tech contact (required)', HeadingLevel.HEADING_2),
  body(
    'The person who can help with email domains, single sign-on, and ensuring Mind Measure emails are delivered reliably.',
    { italic: true }
  ),
  qaTable(['Name', 'Job title', 'Work email']),
  blank(),

  heading('2.4 Mental Health First Aiders (optional but recommended)', HeadingLevel.HEADING_2),
  body(
    'A list of trained MHFAs at your organisation. We can surface them in the in-app Help screen. List as many as you would like, with name, best way to contact them (email or chat), and any office or team they cover.'
  ),
  longAnswer('e.g. "Sarah Khan, sarah.khan@example.com, Dubai office, all teams"'),
  divider()
);

// ─── 3. How your organisation is structured ───
children.push(
  heading('3. How your organisation is structured'),
  body(
    'Mind Measure becomes much more useful when we can show wellbeing patterns broken down by team, seniority, work setting and location. To do that we need a picture of how your organisation is structured.'
  ),

  heading('3.1 Business units / divisions', HeadingLevel.HEADING_2),
  body(
    'What are your top-level business units? For each one, give us its name, roughly how many people work in it, and the teams or practices that sit underneath it.'
  ),
  longAnswer(
    'e.g. "Consulting, 1,400 people. Practices: Strategy & Operations, Technology Consulting, People & Organisation, Risk Consulting"'
  ),
  blank(),

  heading('3.2 Offices and work sites', HeadingLevel.HEADING_2),
  body(
    'List every physical office or work site this pilot will cover. For each, tell us its name, the city and country it is in, and roughly how many people are based there.'
  ),
  longAnswer('e.g. "Emaar Square, Dubai, UAE, 1,400 employees"'),
  divider()
);

// ─── 4. Workplace details ───
children.push(
  heading('4. Workplace details we ask employees for'),
  body(
    'When an employee completes their first Mind Measure check-in, the mobile app asks them a small number of questions about their role so that we can group their (anonymised) results into useful patterns. Tell us what your organisation calls each of the following, or whether you would like us to collect something else entirely.'
  ),
  fourColTable([
    [
      'Which business unit do you work in?',
      'Business unit',
      '',
      'Uses your answer to 3.1 by default',
    ],
    [
      'Which team or practice?',
      'Department',
      '',
      'Uses your answer to 3.1 by default',
    ],
    [
      'What is your seniority level?',
      'Level',
      '',
      'e.g. Junior, Mid-level, Senior, Lead/Manager, Director+. List your own ladder here if it differs',
    ],
    [
      'How do you mostly work?',
      'Work mode',
      '',
      'e.g. Office, Hybrid, Remote. Add or remove options as needed',
    ],
    [
      'Which is your primary office?',
      'Primary office',
      '',
      'Uses your answer to 3.2 by default',
    ],
  ]),
  blank(),
  heading('4.6 Anything else you would like us to capture?', HeadingLevel.HEADING_2),
  body(
    'Examples: tenure band, line manager name, secondment status, ethnicity, age range. We can add bespoke fields here.'
  ),
  longAnswer(),
  divider()
);

// ─── 5. Signing in ───
children.push(
  heading('5. Signing in'),
  body(
    'Employees sign in to the mobile app; your HR and welfare team sign in to the web admin dashboard. The questions below cover both.'
  ),

  heading('5.1 Which email domains identify your employees?', HeadingLevel.HEADING_2),
  body(
    'Mind Measure uses email domain to recognise an employee belongs to your organisation when they sign up to the mobile app. List every domain that belongs to you.'
  ),
  longAnswer('e.g. "pwc.com, pwc.co.uk, pwc.ae"'),
  blank(),

  heading('5.2 Should contractors or partners be able to use the trial?', HeadingLevel.HEADING_2),
  body('If yes, tell us which contractor or partner domains should also be allowed.'),
  longAnswer(),
  blank(),

  heading('5.3 Should employees signing in with personal email addresses (Gmail, Outlook, etc.) be blocked?', HeadingLevel.HEADING_2),
  longAnswer(),
  blank(),

  heading('5.4 Do you require single sign-on (SSO)?', HeadingLevel.HEADING_2),
  body(
    'SSO can apply to the mobile app, the admin dashboard, or both. If you require it, tell us which provider (Microsoft Azure AD / Entra ID, Okta, Google Workspace, etc.) and whether you have a preferred timeline for switching it on. SSO is not required for the pilot, but most organisations enable it before full rollout.'
  ),
  longAnswer(),
  divider()
);

// ─── 6. Your existing wellbeing support ───
children.push(
  heading('6. Your existing wellbeing support'),
  body(
    'This section is the most important. Mind Measure is designed to route employees back into the support you already provide, never to replace it. Tell us what is already in place so we can build it into the app.'
  ),

  heading('6.1 Employee Assistance Programme (EAP)', HeadingLevel.HEADING_2),
  qaTable([
    'Provider name',
    '24/7 phone number',
    'Web portal URL',
    'How employees access it (e.g. code, login, just call)',
    'Languages offered',
  ]),
  blank(),

  heading('6.2 HR / People support', HeadingLevel.HEADING_2),
  qaTable(['Contact name or team inbox', 'Phone', 'Hours of availability']),
  blank(),

  heading('6.3 Occupational health (if applicable)', HeadingLevel.HEADING_2),
  qaTable(['Provider name', 'How employees access it', 'Contact details']),
  blank(),

  heading('6.4 Manager / line manager escalation', HeadingLevel.HEADING_2),
  body(
    'In one paragraph, tell us how an employee is expected to raise a wellbeing concern through their line manager. We will mirror this in the app so the language and process matches yours.'
  ),
  longAnswer(),
  blank(),

  heading('6.5 Other internal wellbeing programmes (optional)', HeadingLevel.HEADING_2),
  body(
    'Mindfulness sessions, peer support groups, yoga, financial wellbeing programmes, anything similar. Tell us the name and how an employee joins.'
  ),
  longAnswer(),
  divider()
);

// ─── 7. External crisis support ───
children.push(
  heading('7. External crisis support'),
  body(
    'Mind Measure includes sensible defaults for the country you operate in (for example UK: Samaritans 116 123). If your organisation prefers different services, or if you operate in countries we should specifically cover, list them below.'
  ),
  small('For each: service name, phone number, hours, languages, web address.'),
  longAnswer(),
  divider()
);

// ─── 8. High-risk escalation ───
children.push(
  heading('8. If Mind Measure detects a high-risk score, who should we route the employee to first?'),
  body(
    'When a check-in result suggests an employee may be struggling, the app gently offers them a list of help options. By default we suggest:'
  ),
  body('  1. Your line manager / HR business partner'),
  body('  2. Your EAP (24/7)'),
  body('  3. A Mental Health First Aider'),
  body('  4. A national crisis line'),
  body('  5. Emergency services (999 / 112 / local equivalent)'),
  body('Would you like to keep this order, change it, or insert a company-specific step at any point?'),
  longAnswer(),
  divider()
);

// ─── 9. Bespoke Jodie questions ───
children.push(
  heading('9. Bespoke check-in questions (optional)'),
  body(
    "Mind Measure's voice agent, Jodie, runs the daily check-in. She can ask a small number of questions that are specific to your organisation, so we can track sentiment on issues you care about. Examples:"
  ),
  body('  • "How are you finding the workload as we approach year-end?"'),
  body('  • "How has the new hybrid working policy been for you?"'),
  body('  • "Is there anything about the [Project X] engagement you would like to flag?"'),
  body(
    'Up to five bespoke questions are included on the standard tier. For each question you would like us to add, give us: the question itself, when to ask it (always / first month / specific week), and whether the results should appear as a filter on your dashboard.'
  ),
  longAnswer(),
  divider()
);

// ─── 10. Data, privacy, reporting ───
children.push(
  heading('10. Data, privacy and reporting'),
  qaTable([
    'Who in your organisation should be able to see results? (welfare team only / HR + welfare / aggregates only)',
    'Minimum cohort size before scores are shown (we recommend 5, never lower)',
    'How long should we retain anonymised data? (12 months / 24 months / until the employee leaves / other)',
    'How often would you like wellbeing reports? (weekly / monthly / quarterly / on-demand only)',
    'In what format? (dashboard access / PDF report / CSV export / API)',
    'Do you need a Data Processing Agreement signed? (Mind Measure can provide a standard DPA, yes/no)',
    'Any specific data residency requirements? (e.g. EU only, UK only, GCC)',
  ]),
  divider()
);

// ─── 11. Launch and training ───
children.push(
  heading('11. Launch and training'),
  qaTable([
    'Would you like a 45-minute walkthrough of the admin dashboard for your HR and welfare team before launch?',
    'Who owns internal launch communications at your end? (name and email)',
    'Any dates we should avoid for launch? (e.g. peak audit season, Ramadan, year-end close, results week)',
  ]),
  divider()
);

// ─── 12. Anything else? ───
children.push(
  heading('12. Anything else?'),
  body(
    "Anything we have not asked about, anything we should know, anything that makes your organisation a bit different, tell us here."
  ),
  longAnswer(),
  divider()
);

// ─── Sign-off ───
children.push(
  heading('Sign-off'),
  qaTable([
    'Completed by (name and role)',
    'Date',
    'Best email for follow-up questions',
  ]),
  blank(),
  body(
    'Thank you. We will review your answers and come back to you within two working days with anything we need to clarify, alongside a proposed kick-off date.'
  ),
  body('The Mind Measure team', { italic: true })
);

// ─── Build the document ──────────────────────────────────────────────────

const doc = new Document({
  creator: 'Mind Measure',
  title: 'Company Onboarding Questionnaire',
  description: 'Pre-onboarding intake for new Mind Measure customers',
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22 },
        paragraph: { spacing: { line: 300 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.8),
            bottom: convertInchesToTwip(0.8),
            left: convertInchesToTwip(0.9),
            right: convertInchesToTwip(0.9),
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'Mind Measure: Onboarding Questionnaire',
                  color: STEEL,
                  size: 18,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Page ', size: 18, color: STEEL }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: STEEL }),
                new TextRun({ text: ' of ', size: 18, color: STEEL }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: STEEL }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

mkdirSync(OUT_DIR, { recursive: true });
const buffer = await Packer.toBuffer(doc);
writeFileSync(OUT_PATH, buffer);
console.log(`✓ Wrote ${OUT_PATH} (${(buffer.length / 1024).toFixed(1)} KB)`);
