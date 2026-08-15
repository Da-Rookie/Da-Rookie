export interface Project {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  role: string[];
  period: string;
  technologies: string[];
  features: string[];
  architecture?: string[];
  caseStudyUrl?: string;
}

export const projects: Project[] = [
  {
    id: "klik-kelontong",
    label: "01 / PRODUCT + TECHNOLOGY",
    title: "Klik Kelontong",
    subtitle: "Multi-tenant SaaS platform for Indonesian MSMEs.",
    description:
      "A digital ecosystem designed to help Indonesian MSMEs and warung kelontong digitize inventory, storefront, transactions, delivery, COD, marketing, and business operations.",
    role: ["Product & Technology Lead", "Founder"],
    period: "Dec 2024 — Apr 2026",
    technologies: ["Laravel", "Next.js", "React.js", "Inertia.js", "Filament", "Redis"],
    features: [
      "Multi-tenant SaaS",
      "Dynamic tenant routing",
      "Data isolation",
      "Product storefront",
      "Business dashboard",
      "Inventory management",
      "Transaction handling",
      "Subscription management",
      "Analytics",
      "Background processing",
    ],
    architecture: [
      "Customer Storefront",
      "Partner Dashboard",
      "Admin Management",
      "Multi-Tenant Backend",
      "Redis + Queue",
    ],
    caseStudyUrl: undefined,
  },
  {
    id: "pertamedika-hris",
    label: "02 / ENTERPRISE SYSTEM",
    title: "Integrated HRIS & Smart Attendance",
    subtitle: "Enterprise-grade employee management system.",
    description:
      "An integrated employee management and attendance system developed during an apprenticeship at PT Pertamina Bina Medika IHC.",
    role: ["Full-Stack Developer"],
    period: "Sep 2025 — Dec 2025",
    technologies: ["Laravel", "React.js", "Inertia.js", "Filament", "Livewire", "PostgreSQL", "face-api.js"],
    features: [
      "Employee master data",
      "Attendance tracking",
      "Face recognition",
      "Geolocation",
      "Geofencing",
      "Permission management",
      "Sick leave",
      "Annual leave",
      "Payroll-related data",
      "Training & certification",
    ],
    architecture: [
      "Employee Portal",
      "Admin Dashboard",
      "Face Recognition Engine",
      "Geofencing Validator",
      "PostgreSQL Database",
    ],
  },
  {
    id: "ai-automation",
    label: "03 / AI + AUTOMATION",
    title: "Data-Driven Automation for Smart Sellers",
    subtitle: "AI-powered workflow automation for e-commerce.",
    description:
      "An automation concept combining AI, data, and workflow automation to help sellers research markets, understand customers, and automate repetitive business tasks.",
    role: ["AI Engineer", "Developer"],
    period: "2025 — Present",
    technologies: ["Python", "AI", "NLP", "n8n", "LangChain", "Data Analytics"],
    features: [
      "Competitor Research Automation",
      "Review Sentiment Analyzer",
      "Auto Product Description Generator",
      "Insight Reports",
    ],
    architecture: [
      "Competitor Research",
      "Review Analysis",
      "AI Insight",
      "Business Decision",
    ],
  },
];
