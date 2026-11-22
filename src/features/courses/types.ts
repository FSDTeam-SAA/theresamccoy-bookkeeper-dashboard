export type CourseAccent = "blue" | "purple" | "teal";

export type LessonStatus = "done" | "current" | "upcoming";

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  status: LessonStatus;
};

export type ModuleStatus = "completed" | "in-progress" | "not-started";

export type CourseModule = {
  id: string;
  /** 1-based position shown as "Module 3: …". */
  number: number;
  title: string;
  status: ModuleStatus;
  lessonsDone: number;
  lessonsTotal: number;
  /** Empty when the syllabus for the module has not been published yet. */
  lessons: Lesson[];
};

export type Assignment = {
  id: string;
  title: string;
  due: string;
  instructor: string;
  /** One-paragraph brief shown on the course's Assignments tab. */
  summary: string;
  /** Intro sentence + task list shown on the submission page. */
  lead: string;
  tasks: string[];
};

export type Resource = {
  id: string;
  name: string;
  meta: string;
};

export type CourseDetail = {
  level: string;
  lessonsTotal: number;
  lessonsDone: number;
  percent: number;
  /** Module + lesson the learner should resume. */
  currentModuleId: string;
  currentLessonId: string;
  modules: CourseModule[];
  assignments: Assignment[];
  resources: Resource[];
};

export type Course = {
  slug: string;
  title: string;
  instructor: string;
  level: string;
  accent: CourseAccent;
  lessonsDone: number;
  lessonsTotal: number;
  /** Present only for courses whose content exists in the design. */
  detail?: CourseDetail;
};

export type LessonView = {
  topic: string;
  elapsed: string;
  duration: string;
  /** Playback position as a 0–100 percentage. */
  watched: number;
};
