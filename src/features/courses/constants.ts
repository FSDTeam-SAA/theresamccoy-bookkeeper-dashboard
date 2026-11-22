import type { Course, CourseAccent, LessonView } from "./types";

/**
 * Copy transcribed verbatim from Figma (file YcS6lbNoziPOaqZ1QPNCSk):
 * courses = 11380:12299, lesson player = 11380:12496,
 * modules = 11392:7707, assignments tab = 11392:7845,
 * assignment submission = 11392:7917, resources = 11392:7967.
 * Static until the LMS endpoints exist.
 */

export const COURSES_HREF = "/dashboard/courses";
export const COURSES_SUBTITLE = "Continue building your certification journey.";
export const SEARCH_PLACEHOLDER = "Search by name, rate, score... ";

export const courseHref = (slug: string) => `${COURSES_HREF}/${slug}`;
export const courseAssignmentsHref = (slug: string) =>
  `${courseHref(slug)}/assignments`;
export const courseResourcesHref = (slug: string) =>
  `${courseHref(slug)}/resources`;
export const assignmentHref = (slug: string, id: string) =>
  `${courseAssignmentsHref(slug)}/${id}`;
export const lessonHref = (slug: string, lessonId: string) =>
  `${courseHref(slug)}/lessons/${lessonId}`;

export const ICONS = {
  search: "/images/courses/search.svg",
  play: "/images/courses/play.svg",
  arrowOutline: "/images/courses/arrow-up-outline.svg",
  arrowLine: "/images/courses/arrow-up-line.svg",
  capCurrent: "/images/courses/cap-current.svg",
  certificate: "/images/courses/certificate-download.svg",
  playCircle: "/images/courses/play-circle.svg",
  book: "/images/courses/book.svg",
  resumePlay: "/images/courses/resume-play.svg",
  tick: "/images/courses/tick-circle.svg",
  caret: "/images/courses/caret-down.svg",
  moduleInProgress: "/images/courses/module-in-progress.svg",
  lessonCurrent: "/images/courses/lesson-current.svg",
  uploadLight: "/images/courses/upload-light.svg",
  uploadDropzone: "/images/courses/upload-dropzone.svg",
  file: "/images/courses/file.svg",
  download: "/images/courses/download.svg",
} as const;

export const ACCENTS: Record<
  CourseAccent,
  { border: string; tile: string; icon: string }
> = {
  blue: {
    border: "border-t-[#009cd5]",
    tile: "bg-[rgba(0,156,213,0.1)]",
    icon: "/images/courses/cap-blue.svg",
  },
  purple: {
    border: "border-t-[#8202be]",
    tile: "bg-[rgba(146,0,213,0.1)]",
    icon: "/images/courses/cap-purple.svg",
  },
  teal: {
    border: "border-t-[#02b8be]",
    tile: "bg-[rgba(2,184,190,0.1)]",
    icon: "/images/courses/cap-teal.svg",
  },
};

export const courseStats = [
  { label: "Remaining Lessons", value: "7", dot: "#f59e0b" },
  { label: "Completed Courses", value: "3", dot: "#10b981" },
  { label: "Training Progress", value: "Module 3 of 5", dot: "#3b82f6" },
];

export const CURRENT_COURSE_SLUG = "quickbooks-fundamentals";

/** Extra copy for the "Current Course" highlight card on the list page. */
export const currentCourseHighlight = {
  moduleLabel: "Module 3 of 6 · Accounts Receivable",
  currentLesson: "Applying Payments & Credits",
  estCompletion: "Dec 15, 2025",
  timeRemaining: "approx. 2h 30m",
};

export const COURSES: readonly Course[] = [
  {
    slug: CURRENT_COURSE_SLUG,
    title: "QuickBooks Fundamentals",
    instructor: "James Foster",
    level: "Intermediate Level",
    accent: "teal",
    lessonsDone: 13,
    lessonsTotal: 18,
    detail: {
      level: "Intermediate",
      lessonsDone: 13,
      lessonsTotal: 18,
      percent: 72,
      currentModuleId: "accounts-receivable",
      currentLessonId: "applying-payments-credits",
      modules: [
        {
          id: "introduction-to-quickbooks",
          number: 1,
          title: "Introduction to QuickBooks",
          status: "completed",
          lessonsDone: 4,
          lessonsTotal: 4,
          lessons: [],
        },
        {
          id: "chart-of-accounts-setup",
          number: 2,
          title: "Chart of Accounts Setup",
          status: "completed",
          lessonsDone: 3,
          lessonsTotal: 3,
          lessons: [],
        },
        {
          id: "accounts-receivable",
          number: 3,
          title: "Accounts Receivable",
          status: "in-progress",
          lessonsDone: 2,
          lessonsTotal: 3,
          lessons: [
            {
              id: "introduction-to-accounts-receivable",
              title: "Introduction to Accounts Receivable",
              duration: "13 min",
              status: "done",
            },
            {
              id: "creating-customer-invoices",
              title: "Creating Customer Invoices",
              duration: "16 min",
              status: "done",
            },
            {
              id: "applying-payments-credits",
              title: "Applying Payments & Credits",
              duration: "14 min",
              status: "current",
            },
          ],
        },
      ],
      assignments: [
        {
          id: "module-3-practical",
          title: "Module 3 Practical Assignment",
          due: "Nov 25, 2025",
          instructor: "James Foster",
          summary:
            "Using the sample company data provided, complete the following tasks in QuickBooks Online: Create 3 customer invoices for the given scenarios, record 2 customer payments and apply them to the correct invoices, issue 1 credit memo, and run an Accounts Receivable Ageing report. Export as PDF and upload below.",
          lead: "Using the sample company data provided, complete the following tasks in QuickBooks Online:",
          tasks: [
            "Create 3 customer invoices for the provided client scenarios",
            "Record 2 customer payments and apply them to the correct invoices",
            "Issue 1 credit memo for a returned item",
            "Run an Accounts Receivable Ageing report and export as PDF",
          ],
        },
      ],
      resources: [
        {
          id: "lecture-notes",
          name: "Module 3 Lecture Notes.pdf",
          meta: "PDF · 420 KB",
        },
        {
          id: "ar-ageing",
          name: "AR Ageing Report Sample.pdf",
          meta: "PDF · 156 KB",
        },
        {
          id: "invoice-workflow",
          name: "Invoice Workflow Guide.pdf",
          meta: "PDF · 312 KB",
        },
      ],
    },
  },
  {
    slug: "xero-certified-advisor",
    title: "Xero Certified Advisor",
    instructor: "Lisa Park",
    level: "Advanced Level",
    accent: "blue",
    lessonsDone: 0,
    lessonsTotal: 22,
  },
  {
    // Figma repeats the Xero card with a purple accent; kept as designed.
    slug: "xero-certified-advisor-advanced",
    title: "Xero Certified Advisor",
    instructor: "Lisa Park",
    level: "Advanced Level",
    accent: "purple",
    lessonsDone: 0,
    lessonsTotal: 22,
  },
  {
    slug: "payroll-management-fundamentals",
    title: "Payroll Management Fundamentals",
    instructor: "Tom Walsh",
    level: "Beginner",
    accent: "teal",
    lessonsDone: 12,
    lessonsTotal: 12,
  },
];

/** Player-only metadata per lesson id (Figma 11380:12496). */
export const LESSON_VIEWS: Record<string, LessonView> = {
  "applying-payments-credits": {
    topic: "Accounts Receivable",
    elapsed: "2:22",
    duration: "14 min",
    watched: 71,
  },
};

export const UPLOAD_ACCEPT = ".pdf,.docx,.xlsx";
export const UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

export const findCourse = (slug: string) =>
  COURSES.find((course) => course.slug === slug);

export const percentOf = (done: number, total: number) =>
  total > 0 ? Math.round((done / total) * 100) : 0;

export function findLesson(slug: string, lessonId: string) {
  const detail = findCourse(slug)?.detail;
  for (const courseModule of detail?.modules ?? []) {
    const lesson = courseModule.lessons.find(({ id }) => id === lessonId);
    if (lesson) return { module: courseModule, lesson };
  }
  return undefined;
}

export const findAssignment = (slug: string, id: string) =>
  findCourse(slug)?.detail?.assignments.find(
    (assignment) => assignment.id === id,
  );

export const COMING_SOON =
  "This will be available once course content is connected.";
