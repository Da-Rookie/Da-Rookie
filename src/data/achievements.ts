export interface Achievement {
  id: string;
  title: string;
  award: string;
  project?: string;
  description: string;
  year: string;
}

export const achievements: Achievement[] = [
  {
    id: "gold-medal",
    title: "Pekan Inovasi 2025",
    award: "Gold Medal",
    project: "Klik Kelontong",
    description:
      "Gold Medal at Pekan Inovasi 2025, awarded for innovation and technical excellence in digital product development for Indonesian MSMEs.",
    year: "2025",
  },
  {
    id: "p2mw",
    title: "P2MW 2025",
    award: "P2MW 2025 Grant Recipient",
    project: "Klik Kelontong",
    description:
      "Selected as a P2MW 2025 grant recipient, demonstrating strong innovation, entrepreneurship, product development potential, and business viability.",
    year: "2025",
  },
];
