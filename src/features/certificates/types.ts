export type Certificate = {
  id: string;
  /** Eyebrow above the course name, e.g. "Certificate of Completion". */
  kind: string;
  course: string;
  awardedTo: string;
  completionDate: string;
  lessons: number;
  instructor: string;
  duration: string;
};
