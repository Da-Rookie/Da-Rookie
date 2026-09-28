export interface Certification {
  id: string;
  name: string;
  issuer: string;
  domain: string;
  year?: string;
  credentialUrl?: string;
  credentialId?: string;
}

export const certifications: Certification[] = [
  {
    id: "ibm-ai-agent-programming",
    name: "AI Agent for Programming",
    issuer: "IBM SkillsBuild",
    domain: "Artificial Intelligence",
  },
  {
    id: "codecademy-computer-science",
    name: "Computer Science Career Path",
    issuer: "Codecademy",
    domain: "Computer Science",
  },
  {
    id: "codecademy-full-stack",
    name: "Full-Stack Engineer Career Path",
    issuer: "Codecademy",
    domain: "Software Engineering",
  },
  {
    id: "codecademy-data-science",
    name: "Data Scientist Career Path",
    issuer: "Codecademy",
    domain: "Data Science & Machine Learning",
  },
];
