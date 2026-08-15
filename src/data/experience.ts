export interface Experience {
  id: string;
  position: string;
  company: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  location: string;
  workMode: string;
  description: string[];
}

export const experiences: Experience[] = [
  {
    id: "recreate",
    position: "Project Manager",
    company: "ReCreate Academy",
    employmentType: "Apprenticeship",
    startDate: "Aug 2026",
    endDate: undefined,
    location: "South Jakarta, Jakarta, Indonesia",
    workMode: "Remote",
    description: [
      "Manage and monitor projects across four divisions.",
      "Develop project timelines and schedules to keep project stages on target and on time.",
      "Coordinate communication between teams and stakeholders.",
      "Facilitate cross-functional collaboration.",
      "Monitor project progress and deliverables.",
      "Minimize miscommunication between teams and stakeholders.",
      "Ensure project execution remains aligned with objectives and deadlines.",
    ],
  },
  {
    id: "klik-kelontong",
    position: "Product & Technology Lead",
    company: "Klik Kelontong",
    employmentType: "Self-employed",
    startDate: "Dec 2024",
    endDate: "Apr 2026",
    location: "South Jakarta, Jakarta, Indonesia",
    workMode: "Hybrid",
    description: [
      "Spearheaded the overall technical roadmap, product lifecycle strategy, and business model formulation for a multi-tenant SaaS digital ecosystem designed to accelerate the digital transformation of Indonesian MSMEs.",
      "Architected a highly scalable SaaS platform leveraging Laravel multi-tenant architecture, implementing strict data isolation and dynamic tenant routing policies to securely onboard and manage thousands of independent MSME vendors within a single unified codebase.",
      "Formulated a high-converting, SEO-optimized web application utilizing Next.js to deliver a seamless product storefront experience across various tenant domains.",
      "Designed a responsive business management portal using Laravel Inertia.js and React.js for real-time stock, multi-tenancy configurations, and transaction handling.",
      "Integrated Laravel Filament to provide corporate operators with unified tenant management, global data-monitoring, billing/subscription governance, and analytical dashboards.",
      "Optimized system performance and background processing by establishing a low-latency data architecture leveraging Redis for caching alongside Laravel Queue + Redis to handle asynchronous multi-tenant workflows and concurrent user traffic.",
      "Led a cross-functional technical team using Agile frameworks, aligning fast-paced engineering execution with SaaS unit economics, long-term strategic growth, and market expansion partnerships.",
    ],
  },
  {
    id: "pertamedika-dev",
    position: "Full-Stack Developer",
    company: "PT Pertamina Bina Medika IHC",
    employmentType: "Apprenticeship",
    startDate: "Sep 2025",
    endDate: "Dec 2025",
    location: "South Jakarta, Jakarta, Indonesia",
    workMode: "On-site",
    description: [
      "Developed a full-stack attendance management system using Laravel, Inertia.js, and React.js, featuring real-time face recognition with face-api.js and geolocation-based attendance validation through geofencing technology.",
      "Built an integrated employee management system / HRIS (Admin-only dashboard) powered by Laravel Filament and Livewire to efficiently handle master data, attendance tracking, leave management (permission, sick, annual), payroll-related data, and training & certification modules.",
      "Designed and structured a robust relational database schema utilizing PostgreSQL to ensure data integrity, optimized query performance, and secure transactional logging across multiple synchronized modules.",
      "Collaborated directly with internal clients using Agile methodologies to gather deep business requirements, manage sprint backlogs, and deliver high-value technical solutions aligned with corporate operational workflows.",
    ],
  },
  {
    id: "umb-assistant",
    position: "Web Programming Lecture Assistant",
    company: "Universitas Mercu Buana",
    employmentType: undefined,
    startDate: "Feb 2024",
    endDate: "May 2024",
    location: "Central Jakarta, Jakarta, Indonesia",
    workMode: "On-site",
    description: [
      "Assisted in teaching Web Programming courses.",
      "Guided students in frontend fundamentals.",
      "Guided students in backend fundamentals.",
      "Assisted with HTML, CSS, JavaScript, PHP, and MySQL.",
      "Provided practical assistance during coding sessions.",
      "Helped students debug code.",
      "Supported students in completing web-based assignments.",
    ],
  },
  {
    id: "pertamedika-it",
    position: "Information Technology Support Assistant",
    company: "PT Pertamina Bina Medika IHC",
    employmentType: "Contract",
    startDate: "Jun 2023",
    endDate: "Aug 2023",
    location: "South Jakarta, Jakarta, Indonesia",
    workMode: "On-site",
    description: [
      "Provided technical support for enterprise IT infrastructure, including hardware deployment, software installation, and system maintenance to ensure operational continuity.",
      "Monitored internal systems and assisted in troubleshooting network, hardware, and software issues across multiple departments.",
      "Supported digital adoption initiatives by assisting employees with enterprise applications and delivering technical guidance for internal systems.",
    ],
  },
  {
    id: "pertamedika-payroll",
    position: "Human Resources Payroll Assistant",
    company: "PT Pertamina Bina Medika IHC",
    employmentType: "Contract",
    startDate: "Sep 2020",
    endDate: "Dec 2020",
    location: "South Jakarta, Jakarta, Indonesia",
    workMode: "On-site",
    description: [
      "Assist in managing and calculating overtime pay for non-permanent employees in an accurate and timely manner.",
      "Handle simple inquiries or requests from employees regarding salary information, contracts, and personal data.",
      "Recap and verify attendance, absence, leave and sick leave data for payroll purposes.",
      "Maintain confidentiality of all payroll data and employee financial information.",
    ],
  },
  {
    id: "pertamedika-hr",
    position: "Human Resources Generalist",
    company: "PT Pertamina Bina Medika IHC",
    employmentType: "Contract",
    startDate: "Jul 2020",
    endDate: "Sep 2020",
    location: "South Jakarta, Jakarta, Indonesia",
    workMode: "On-site",
    description: [
      "Process and complete employee personal data, including administrative documents and entry into the system.",
      "Compile daily and monthly HR reports such as attendance, overtime, and contract employee data.",
      "Support employee attendance and attendance process, including recap and reporting to the payroll department.",
      "Maintain confidentiality of employee data and HR documents in a professional manner.",
    ],
  },
];
