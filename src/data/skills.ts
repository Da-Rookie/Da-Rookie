export interface SkillGroup {
  id: string;
  category: string;
  icon: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "engineering",
    category: "Engineering",
    icon: "code",
    items: [
      "React", "TypeScript", "Laravel", "PHP", "FastAPI", "Python", "Flutter", "REST API",
      "Next.js", "Inertia.js", "Livewire", "Tailwind CSS", "Vite",
    ],
  },
  {
    id: "ai",
    category: "AI",
    icon: "brain",
    items: [
      "LLM", "RAG", "LangChain", "AI Agent", "OpenAI", "Ollama",
      "Generative AI", "NLP", "Machine Learning",
    ],
  },
  {
    id: "automation",
    category: "Automation",
    icon: "zap",
    items: [
      "n8n", "Webhook", "REST Integration", "Workflow Automation",
      "Business Process Automation", "AI Automation", "Data Automation",
    ],
  },
  {
    id: "data",
    category: "Data",
    icon: "chart",
    items: [
      "Pandas", "NumPy", "Scikit-learn", "RFM", "Time Series", "Power BI",
      "Matplotlib", "Jupyter", "PySpark", "Apache Spark",
    ],
  },
  {
    id: "infrastructure",
    category: "Infrastructure",
    icon: "server",
    items: ["PostgreSQL", "MySQL", "Redis", "Docker", "Linux", "Git", "GitHub", "Vercel", "ngrok"],
  },
  {
    id: "leadership",
    category: "Project & Leadership",
    icon: "layers",
    items: [
      "Project Management", "Project Monitoring", "Timeline Management", "Milestone Tracking",
      "Cross-functional Coordination", "Stakeholder Management", "Technology Planning",
      "Product Thinking", "Agile", "Sprint Planning", "Backlog Management",
    ],
  },
];
