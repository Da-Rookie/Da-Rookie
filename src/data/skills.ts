export interface SkillGroup {
  id: string;
  category: string;
  icon: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "software",
    category: "Software Engineering",
    icon: "code",
    items: [
      "PHP", "JavaScript", "TypeScript", "Python", "SQL",
      "Laravel", "React.js", "Next.js", "Node.js", "FastAPI",
      "Inertia.js", "Livewire", "Tailwind CSS", "Vite",
    ],
  },
  {
    id: "ai-data",
    category: "AI & Data",
    icon: "brain",
    items: [
      "Artificial Intelligence", "Generative AI", "AI Engineering", "NLP",
      "Machine Learning", "LangChain", "Pandas", "NumPy", "Matplotlib",
      "Scikit-learn", "Jupyter", "ydata-profiling", "PySpark", "Apache Spark", "Big Data",
    ],
  },
  {
    id: "infrastructure",
    category: "Infrastructure",
    icon: "server",
    items: ["MySQL", "PostgreSQL", "Redis", "Docker", "Linux", "Git", "Vercel", "ngrok"],
  },
  {
    id: "automation",
    category: "Automation",
    icon: "zap",
    items: [
      "n8n", "Business Process Automation", "AI Automation",
      "Data Automation", "Workflow Automation", "Zapier",
    ],
  },
  {
    id: "product",
    category: "Product & Management",
    icon: "layers",
    items: [
      "SaaS Architecture", "Multi-tenancy", "System Architecture",
      "Product Development", "Product Strategy", "Technical Roadmapping",
      "Business Model Development", "Agile", "Project Management",
      "Project Planning", "Project Scheduling", "Sprint Planning",
      "Backlog Management", "Stakeholder Management", "Cross-functional Coordination",
    ],
  },
];
