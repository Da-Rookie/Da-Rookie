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
    description: "Received a Gold Medal at Pekan Inovasi 2025 for Klik Kelontong.",
    year: "2025",
  },
  {
    id: "p2mw",
    title: "P2MW 2025",
    award: "P2MW 2025 Funding Recipient",
    project: "Klik Kelontong",
    description: "Received P2MW 2025 funding for the development of Klik Kelontong.",
    year: "2025",
  },
];
