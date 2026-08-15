export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear?: string;
  status: string;
  gpa?: string;
}

export const education: Education[] = [
  {
    id: "umb",
    institution: "Universitas Mercu Buana",
    degree: "S1",
    field: "Teknik Informatika",
    startYear: "2023",
    endYear: undefined,
    status: "Undergraduate / Active Student",
    gpa: "GPA 3.75 / 4.00",
  },
];
