import type {
  AssessmentContent,
  AssessmentMeta,
  LongTextPart,
  TableInputCell,
  TableSelectCell,
} from "./types";

/**
 * All copy below is transcribed verbatim from Figma (file YcS6lbNoziPOaqZ1QPNCSk):
 * hub = node 11380:11553, skills assessment = node 11807:10014.
 */

export const ASSESSMENTS_HUB_HREF = "/dashboard/application";
export const SUBMISSIONS_HREF = "/dashboard/application/submissions";
export const CORE_ASSESSMENT_SLUG = "core-bookkeeping-fundamentals";

export const assessmentHref = (slug: string) =>
  `${ASSESSMENTS_HUB_HREF}/assessments/${slug}`;

export const APPLICATION_SUBTITLE =
  "Complete assessments to verify your skills and advance your platform tier.";

export const ASSESSMENTS: readonly AssessmentMeta[] = [
  {
    slug: CORE_ASSESSMENT_SLUG,
    title: "Core Bookkeeping Fundamentals",
    description:
      "Covers foundational bookkeeping principles, double-entry accounting, and financial statement analysis.",
    duration: "Duration: 45 min",
    hasContent: true,
  },
  {
    slug: "software-proficiency",
    title: "Software Proficiency: QuickBooks & Xero",
    description:
      "Practical assessment of QuickBooks Online and Xero across common bookkeeping workflows.",
    duration: "Duration: 30 min",
    unlockedBy: CORE_ASSESSMENT_SLUG,
    hasContent: false,
  },
  {
    slug: "advanced-reconciliation",
    title: "Advanced Reconciliation",
    description:
      "Complex reconciliation scenarios, multi-currency transactions, and period-end procedures.",
    duration: "Duration: 30 min",
    unlockedBy: "software-proficiency",
    hasContent: false,
  },
];

export const findAssessment = (slug: string) =>
  ASSESSMENTS.find((assessment) => assessment.slug === slug);

/* ---------- helpers for repeated Figma cells ---------- */

const ANSWER_PLACEHOLDER = "Enter your answer here…";
const FORMULA_PLACEHOLDER = "=...";
const SELECT_PLACEHOLDER = "— select —";

const answer = (id: string, label?: string): LongTextPart => ({
  kind: "long-text",
  id,
  label,
  placeholder: ANSWER_PLACEHOLDER,
});

const formula = (id: string, label: string): LongTextPart => ({
  kind: "long-text",
  id,
  label,
  placeholder: FORMULA_PLACEHOLDER,
});

const blankInput: TableInputCell = { input: "text" };

const ACCOUNT_TYPES = [
  "Asset",
  "Liability",
  "Equity",
  "Revenue",
  "COGS",
  "Expense",
] as const;
const accountTypeSelect: TableSelectCell = {
  input: "select",
  options: ACCOUNT_TYPES,
  placeholder: SELECT_PLACEHOLDER,
};

const EFFECTS = ["Increase", "Decrease"] as const;
const effectSelect: TableSelectCell = {
  input: "select",
  options: EFFECTS,
  placeholder: SELECT_PLACEHOLDER,
};

const revenueAccountsInput: TableInputCell = {
  input: "text",
  placeholder: "Revenue accounts…",
};

/* ---------- Bookkeeping Skills Assessment ---------- */

export const CORE_ASSESSMENT: AssessmentContent = {
  title: "Bookkeeping Skills Assessment",
  subtitle: "Candidate Screening Evaluation | Designed by Theresa McCoy, CPA",
  instructionsLead: "Instructions:",
  instructions:
    "Complete all sections. Show your work where calculations are required. For open-ended questions, write complete, professional sentences. This assessment evaluates foundational bookkeeping skills.",
  candidateFields: [
    { id: "candidate.name", label: "Candidate name:", placeholder: "Full name" },
    { id: "candidate.date", label: "Date:", placeholder: "MM/DD/YYYY" },
    {
      id: "candidate.position",
      label: "Position applied for:",
      placeholder: "Position title",
    },
  ],
  candidateStatic: { label: "Date:", value: "45 minutes" },
  sections: [
    {
      id: "s1",
      title: "Section 1 — Math: Decimals & Percentages",
      questions: [
        {
          id: "q1a",
          label: "Question 1A",
          prompt:
            "A small business had gross sales of $48,750.00 in Q1. Calculate the following:",
          hint: "Show all work. Round to two decimal places.",
          parts: [
            answer("q1a.a", "(a) Sales tax owed at a rate of 6.5%:"),
            answer(
              "q1a.b",
              "(b) Net sales after deducting a 3.25% merchant processing fee:",
            ),
            answer(
              "q1a.c",
              "(c) If operating expenses totaled $31,200.00, what is the net profit margin as a percentage of gross sales?",
            ),
          ],
        },
        {
          id: "q1b",
          label: "Question 1B",
          prompt:
            "A vendor invoice shows the items below. Calculate the total amount due, including 7% sales tax on taxable items only (T = taxable, E = exempt).",
          parts: [
            {
              kind: "table-fill",
              id: "q1b.invoice",
              caption: "Vendor invoice",
              columns: [
                { key: "item", header: "Item" },
                { key: "amount", header: "Amount", align: "center" },
                { key: "tax", header: "Tax?", align: "center", variant: "muted" },
                { key: "answer", header: "Modules", align: "center" },
              ],
              rows: [
                {
                  id: "office-supplies",
                  cells: { item: "Office supplies", amount: "$185.40", tax: "T", answer: blankInput },
                },
                {
                  id: "legal-retainer",
                  cells: {
                    item: "Professional services — legal retainer",
                    amount: "$1,200.00",
                    tax: "E",
                    answer: blankInput,
                  },
                },
                {
                  id: "software",
                  cells: { item: "Software subscription", amount: "$49.99", tax: "T", answer: blankInput },
                },
                {
                  id: "postage",
                  cells: { item: "Postage & shipping", amount: "$23.75", tax: "E", answer: blankInput },
                },
                {
                  id: "tax-subtotal",
                  cells: { item: "Tax subtotal (7% on taxable)", amount: null, tax: null, answer: blankInput },
                },
                {
                  id: "total-due",
                  variant: "highlight",
                  cells: { item: "TOTAL DUE", amount: null, tax: null, answer: blankInput },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "s2",
      title: "Section 2 — Excel Formula Knowledge",
      questions: [
        {
          id: "q2a",
          label: "Question 2A",
          prompt:
            "Write the correct Excel formula for each task below. Write the formula exactly as you would enter it in a cell.",
          parts: [
            formula("q2a.a", "(a) Sum all values in column B, rows 2 through 50:"),
            formula("q2a.b", "(b) Calculate the average of values in C2 through C20:"),
            formula(
              "q2a.c",
              '(c) IF formula: if D5 > 1000, display "Over Budget"; otherwise display "On Track":',
            ),
            formula(
              "q2a.d",
              "(d) VLOOKUP: find the value in cell A2 in column A of Sheet2 (range A1:D100) and return column 3:",
            ),
            formula(
              "q2a.e",
              '(e) SUMIF: sum all values in column D where column B equals "Advertising":',
            ),
          ],
        },
        {
          id: "q2b",
          label: "Question 2B",
          prompt:
            "Scenario: Column A = date, B = vendor, C = expense category, D = amount (rows 2–200).",
          parts: [
            formula(
              "q2b.total",
              'Write a formula to total all "Meals & Entertainment" expenses:',
            ),
            formula(
              "q2b.count",
              'Write a formula to count the number of "Meals & Entertainment" transactions:',
            ),
          ],
        },
      ],
    },
    {
      id: "s3",
      title: "Section 3 — Chart of Accounts",
      questions: [
        {
          id: "q3a",
          label: "Question 3A",
          prompt:
            "Classify each account. Account types: Asset | Liability | Equity | Revenue | COGS | Expense",
          parts: [
            {
              kind: "table-fill",
              id: "q3a.accounts",
              caption: "Account classification",
              columns: [
                { key: "index", header: "#", align: "center", variant: "index" },
                { key: "name", header: "Account name" },
                { key: "type", header: "Account type (fill in)", align: "center" },
              ],
              rows: [
                "Accounts Receivable",
                "Unearned Revenue",
                "Owner's Draw",
                "Merchant Processing Fees",
                "Prepaid Insurance",
                "Sales Tax Payable",
                "Cost of Goods Sold",
                "Notes Payable – Long Term",
                "Service Revenue",
                "Accumulated Depreciation",
                "Wages Payable",
                "Office Rent Expense",
              ].map((name, index) => ({
                id: `row-${index + 1}`,
                cells: { index: String(index + 1), name, type: accountTypeSelect },
              })),
            },
          ],
        },
        {
          id: "q3b",
          label: "Question 3B",
          prompt:
            'Where in a standard QuickBooks chart of accounts would you find "Owner\'s Draw"? Explain why.',
          parts: [answer("q3b.answer")],
        },
        {
          id: "q3c",
          label: "Question 3C",
          prompt:
            "A client's transactions include 'Stripe Payouts,' 'Square Deposits,' and 'Client Retainers Received.' How would you categorize each, and what account type applies?",
          parts: [answer("q3c.answer")],
        },
      ],
    },
    {
      id: "s4",
      title: "Section 4 — Debits & Credits",
      questions: [
        {
          id: "q4a",
          label: "Question 4A",
          prompt:
            "For each account type, describe the effect of a debit and a credit on the balance. Use the words 'increase' or 'decrease.'",
          parts: [
            {
              kind: "table-fill",
              id: "q4a.effects",
              caption: "Debit and credit effects",
              // Both answer headers read "Account type (fill in)" in Figma.
              columns: [
                { key: "name", header: "Account name" },
                { key: "debit", header: "Account type (fill in)", align: "center" },
                { key: "credit", header: "Account type (fill in)", align: "center" },
              ],
              rows: [
                "Asset",
                "Liability",
                "Equity / Owner's Capital",
                "Revenue",
                "Expense",
              ].map((name, index) => ({
                id: `row-${index + 1}`,
                cells: { name, debit: effectSelect, credit: effectSelect },
              })),
            },
          ],
        },
        {
          id: "q4b",
          label: "Question 4B",
          prompt:
            "A client pays $2,500 monthly office rent. Identify both accounts affected and state whether each is debited or credited. Explain why.",
          parts: [answer("q4b.answer")],
        },
        {
          id: "q4c",
          label: "Question 4C",
          prompt:
            "A client receives $5,000 from a customer as an advance payment for services not yet rendered. How do you record this? Which accounts are affected and why?",
          parts: [answer("q4c.answer")],
        },
      ],
    },
    {
      id: "s5",
      title: "Section 5 — Identifying & Correcting Errors",
      questions: [
        {
          id: "q5a",
          label: "Question 5A",
          prompt:
            "Describe your process for detecting personal expenses recorded as business expenses. What specific red flags do you look for?",
          parts: [answer("q5a.answer")],
        },
        {
          id: "q5b",
          label: "Question 5B",
          prompt:
            "You find a bank feed transaction labeled only 'Zelle Payment – $450.' The client is unavailable. Walk through every step you would take to research and classify this transaction.",
          parts: [answer("q5b.answer")],
        },
        {
          id: "q5c",
          label: "Question 5C",
          prompt:
            "Month-end review shows total debits and credits are out of balance by $180. List at least four possible causes and describe how you would systematically locate the error.",
          parts: [answer("q5c.answer")],
        },
      ],
    },
    {
      id: "s6",
      title: "Section 6 — Industry-Specific Knowledge",
      questions: [
        {
          id: "q6a",
          label: "Question 6A",
          prompt:
            "Do you make an effort to understand the specific revenue and expense categories pertinent to a client's industry? Describe how you approach learning a new industry's financial structure when onboarding a new client.",
          parts: [answer("q6a.answer")],
        },
        {
          id: "q6b",
          label: "Question 6B",
          prompt:
            "For each business below, name at least two revenue accounts and two expense accounts unique or important to that industry's chart of accounts.",
          parts: [
            {
              kind: "table-fill",
              id: "q6b.industries",
              caption: "Industry accounts",
              columns: [
                { key: "industry", header: "Industry" },
                { key: "revenue", header: "Key revenue accounts", align: "center" },
                { key: "expense", header: "Key expense accounts", align: "center" },
              ],
              // Row labels and both placeholders are exactly as drawn in Figma.
              rows: [
                "Asset",
                "Liability",
                "Equity / Owner's Capital",
                "Revenue",
                "Expense",
              ].map((industry, index) => ({
                id: `row-${index + 1}`,
                cells: {
                  industry,
                  revenue: revenueAccountsInput,
                  expense: revenueAccountsInput,
                },
              })),
            },
          ],
        },
      ],
    },
    {
      id: "s7",
      // Figma repeats the Section 6 heading on this block.
      title: "Section 6 — Industry-Specific Knowledge",
      questions: [
        {
          id: "q7a",
          label: "Question 7A",
          prompt: "Review the sample P&L below and answer the questions that follow.",
          hint: "Identify anomalies, misclassifications, or items that warrant follow-up.",
          parts: [
            {
              kind: "statement",
              caption: "Sample profit and loss statement",
              rows: [
                { label: "Revenue", variant: "section" },
                { label: "Service Revenue", amount: "$84,200.00", variant: "line" },
                { label: "Product Sales", amount: "$12,450.00", variant: "line" },
                {
                  label: "Other Income — Personal Loan Repayment",
                  amount: "$3,000.00",
                  variant: "anomaly",
                },
                { label: "TOTAL REVENUE", amount: "$99,650.00", variant: "total" },
                { label: "Cost of Goods Sold", variant: "section" },
                { label: "Inventory Purchased", amount: "$18,300.00", variant: "line" },
                { label: "TOTAL COGS", amount: "$18,300.00", variant: "total" },
                { label: "GROSS PROFIT", amount: "$81,350.00", variant: "total" },
                { label: "Operating Expenses", variant: "section" },
                { label: "Rent Expense", amount: "$24,000.00", variant: "line" },
                { label: "Wages & Salaries", amount: "$31,500.00", variant: "line" },
                { label: "Meals & Entertainment", amount: "$8,750.00", variant: "line" },
                {
                  label: "Owner's Personal Groceries",
                  amount: "$1,100.00",
                  variant: "anomaly",
                },
                { label: "Utilities", amount: "$1,800.00", variant: "line" },
                { label: "Marketing & Advertising", amount: "$3,200.00", variant: "line" },
                { label: "Office Supplies", amount: "$420.00", variant: "line" },
                {
                  label: "TOTAL OPERATING EXPENSES",
                  amount: "$70,770.00",
                  variant: "total",
                },
                { label: "NET INCOME", amount: "$10,580.00", variant: "grand-total" },
              ],
            },
            {
              kind: "note",
              text: "Note: Items in red are intentional anomalies for this exercise.",
            },
          ],
        },
        {
          id: "q7b",
          label: "Question 7B",
          prompt:
            "Identify at least three items in this P&L that concern you and explain what action you would take for each.",
          parts: [answer("q7b.answer")],
        },
        {
          id: "q7c",
          label: "Question 7C",
          prompt:
            "Meals & Entertainment of $8,750 represents ~10% of total revenue. What questions would you ask, and what IRS guidelines apply?",
          parts: [answer("q7c.answer")],
        },
        {
          id: "q7d",
          label: "Question 7D",
          prompt:
            "Net income is $10,580 but the client says they should have more cash. What are three possible explanations you would investigate?",
          parts: [answer("q7d.answer")],
        },
      ],
    },
    {
      id: "s8",
      title: "Section 8 — Bank Reconciliation",
      questions: [
        {
          id: "q8a",
          label: "Question 8A",
          prompt:
            "Explain in your own words the purpose of a bank reconciliation and how often it should be performed.",
          parts: [answer("q8a.answer")],
        },
        {
          id: "q8b",
          label: "Question 8B",
          prompt: "Complete the bank reconciliation using the data below.",
          hint: "Use the standard format: start with the bank statement balance, adjust for outstanding items, reconcile to the adjusted book balance.",
          parts: [
            {
              kind: "facts",
              lines: [
                "Bank statement ending balance (May 31): $14,820.50",
                "Outstanding checks: Check #1042 – $325.00 | Check #1047 – $780.25",
                "Deposit in transit (in books, not on statement): $2,100.00",
                "Book balance per QuickBooks (May 31): $15,262.75",
                "Bank service charge (not yet recorded in books): $18.50",
                "NSF check returned (customer payment, not recorded): $635.00",
              ],
            },
            {
              kind: "table-fill",
              id: "q8b.reconciliation",
              caption: "Bank reconciliation",
              columns: [
                { key: "label", header: "Bank Side" },
                { key: "amount", header: "" },
              ],
              rows: [
                { id: "bank-side", label: "Bank Side" },
                { id: "bank-balance", label: "Bank statement ending balance" },
                { id: "deposits-in-transit", label: "Add: Deposits in transit" },
                { id: "check-1042", label: "Less: Outstanding checks — #1042" },
                { id: "check-1047", label: "Less: Outstanding checks — #1047" },
                { id: "adjusted-bank", label: "Adjusted bank balance", strong: true },
                { id: "book-side", label: "Book Side" },
                { id: "book-balance", label: "Book balance per QuickBooks" },
                { id: "service-charge", label: "Less: Bank service charge" },
                { id: "nsf-check", label: "Less: NSF check returned" },
                { id: "adjusted-book", label: "Adjusted book balance", strong: true },
              ].map(({ id, label, strong }) => ({
                id,
                variant: strong ? ("strong" as const) : undefined,
                cells: { label, amount: blankInput },
              })),
            },
          ],
        },
        {
          id: "q8c",
          label: "Question 8C",
          prompt:
            "After completing the reconciliation, the adjusted bank balance and adjusted book balance do not agree. List three common reasons and describe how you would resolve each.",
          parts: [answer("q8c.answer")],
        },
      ],
    },
    {
      id: "s9",
      title: "Section 9 — Bank Reconciliation & Financial Statement Concepts",
      questions: [
        {
          id: "q9a",
          label: "Question 9A",
          prompt:
            "If a deposit is in transit, does this reduce or increase the book balance? Explain your answer.",
          parts: [answer("q9a.answer")],
        },
        {
          id: "q9b",
          label: "Question 9B",
          prompt:
            "If a check payment is uncleared (outstanding), does this reduce or increase the bank balance? Explain your answer.",
          parts: [answer("q9b.answer")],
        },
        {
          id: "q9c",
          label: "Question 9C",
          prompt:
            "If a company has three consecutive months of losses, where will this be reflected in the financial statements?",
          parts: [answer("q9c.answer")],
        },
        {
          id: "q9cd",
          label: "Question 9CD",
          prompt:
            "Which of the following is INCORRECT for a balanced balance sheet? (A = Assets, L = Liabilities, E = Equity) Select one.",
          parts: [
            {
              kind: "multiple-choice",
              id: "q9cd.choice",
              options: ["A = L + E", "E = A − L", "L = E + A", "L = A − E"],
            },
          ],
        },
      ],
    },
  ],
  acknowledgment: {
    title: "Candidate Acknowledgment",
    text: "By submitting this assessment, I confirm that all answers are my own work completed without assistance.",
    signature: {
      id: "acknowledgment.signature",
      label: "Candidate signature:",
      placeholder: "Type full name as signature",
    },
    date: { id: "acknowledgment.date", label: "Date:", placeholder: "MM/DD/YYYY" },
  },
  submitLabel: "Submit Assessment",
  downloadLabel: "Download Pdf",
  footer: "Confidential — For Recruitment Use Only",
};

/** Question sets by slug; assessments without one show a "coming soon" state. */
export const ASSESSMENT_CONTENT: Record<string, AssessmentContent | undefined> = {
  [CORE_ASSESSMENT_SLUG]: CORE_ASSESSMENT,
};
