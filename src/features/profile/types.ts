export type PersonalInfo = {
  fullName: string;
  email: string;
  location: string;
  phone: string;
  bio: string;
};

export type Certificate = {
  id: string;
  title: string;
  /** Issuing body, shown under the title on the view page (not edited in the design). */
  issuer?: string;
  year: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  department: string;
  /** Name of the uploaded PDF. Only the name is kept until a backend exists. */
  fileName?: string;
};

export type OtherDetails = {
  hourlyRate: number;
  projectsDone: number;
  experienceYears: number;
  languages: string;
  availability: string;
};

export type Profile = {
  headline: string;
  availableNow: boolean;
  photoUrl: string;
  photoFileName?: string;
  resumeFileName?: string;
  personal: PersonalInfo;
  skills: string[];
  certificates: Certificate[];
  portfolio: PortfolioItem[];
  other: OtherDetails;
};
