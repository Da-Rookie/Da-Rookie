export interface Publication {
  id: string;
  title: string;
  publisher: string;
  journal?: string;
  publishedDate: string;
  institution?: string;
  accreditation: string;
  description: string;
  keywords: string[];
  url?: string;
}

export const publications: Publication[] = [
  {
    id: "piksel-proxy",
    title: "Implementation of Proxy at XYZInc. Study: Experiment on Network Performance Optimization",
    publisher: "PIKSEL — Penelitian Ilmu Komputer Sistem Embedded & Logic",
    publishedDate: "September 30, 2025",
    institution: "Universitas Islam 45 Bekasi",
    accreditation: "SINTA 3",
    description:
      "This research was published in PIKSEL, a computer science journal focusing on embedded systems and logic.",
    keywords: ["Proxy", "Network Performance", "Performance Optimization", "Computer Networking"],
    url: undefined,
  },
  {
    id: "abdi-moestopo",
    title: "Edukasi Keamanan Jaringan dan Kolaborasi Digital di Kelurahan Duri Kepa",
    publisher: "Research and Community Service (LPPM), University of Prof. Dr. Moestopo",
    journal: "ABDI MOESTOPO",
    publishedDate: "July 25, 2025",
    accreditation: "SINTA 4",
    description:
      "A community service publication focusing on network security education and digital collaboration to enhance technological literacy and information security awareness at the community level.",
    keywords: [
      "Network Security",
      "Digital Collaboration",
      "Technology Literacy",
      "Information Security Awareness",
      "Community Service",
    ],
    url: undefined,
  },
];
