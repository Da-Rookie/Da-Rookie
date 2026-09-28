import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BottomDock } from "@/components/navigation/BottomDock";
import { SplashScreenV2 } from "@/components/motion/SplashScreenV2";
import { RouterProvider, useRouter } from "@/lib/router";
import { HomePage } from "@/pages/Home";
import { AboutPage } from "@/pages/About";
import { ExperiencePage } from "@/pages/Experience";
import { RecognitionPage } from "@/pages/Recognition";
import { ContactPage } from "@/pages/Contact";
import { ProjectDetailPage } from "@/pages/ProjectDetail";

const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Eko Prasetyo Pratomo — Full-Stack Developer, AI Engineer & Project Manager",
    description:
      "Portfolio of Eko Prasetyo Pratomo — Full-Stack Developer, AI Engineer, and Project Manager building digital products, intelligent systems, automation, and technology projects for real operational needs.",
  },
  "/about": {
    title: "About — Eko Prasetyo Pratomo",
    description:
      "About Eko Prasetyo Pratomo: engineering, AI, automation, project management, capabilities, skills, and education.",
  },
  "/experience": {
    title: "Experience — Eko Prasetyo Pratomo",
    description:
      "Professional experience of Eko Prasetyo Pratomo across software engineering, AI engineering, product technology, operations, and project management.",
  },
  "/recognition": {
    title: "Recognition — Eko Prasetyo Pratomo",
    description:
      "Achievements, publications, and professional certificates of Eko Prasetyo Pratomo.",
  },
  "/contact": {
    title: "Contact — Eko Prasetyo Pratomo",
    description:
      "Contact Eko Prasetyo Pratomo for software, AI, automation, technical collaboration, project collaboration, and professional opportunities.",
  },
};

function updateMeta(title: string, description: string) {
  document.title = title;

  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = description;
}

function PortfolioApp() {
  const { pathname } = useRouter();
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  const completeSplash = useCallback(() => setReady(true), []);

  const route = useMemo(() => {
    if (pathname === "/") return <HomePage />;
    if (pathname === "/about") return <AboutPage />;
    if (pathname === "/experience") return <ExperiencePage />;
    if (pathname === "/recognition") return <RecognitionPage />;
    if (pathname === "/contact") return <ContactPage />;

    if (pathname.startsWith("/projects/")) {
      const slug = decodeURIComponent(pathname.replace("/projects/", ""));
      return <ProjectDetailPage slug={slug} />;
    }

    return <ProjectDetailPage slug="__not-found__" />;
  }, [pathname]);

  useEffect(() => {
    const direct = pageMeta[pathname];
    if (direct) {
      updateMeta(direct.title, direct.description);
      return;
    }

    if (pathname.startsWith("/projects/")) {
      const slug = pathname.replace("/projects/", "");
      const readable = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      updateMeta(
        `${readable} — Eko Prasetyo Pratomo`,
        `Project case study by Eko Prasetyo Pratomo: ${readable}.`,
      );
      return;
    }

    updateMeta(
      "Eko Prasetyo Pratomo — Portfolio",
      "Portfolio of Eko Prasetyo Pratomo.",
    );
  }, [pathname]);

  return (
    <div className="heritage-app">
      <AnimatePresence mode="wait">
        {!ready ? (
          <SplashScreenV2 key="splash" onComplete={completeSplash} />
        ) : null}
      </AnimatePresence>

      {ready ? (
        <>
          <a className="skip-link" href="#main-content">
            Skip to main content
          </a>

          <div id="main-content" tabIndex={-1}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="route-scene"
                key={pathname}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={
                  reduceMotion
                    ? { duration: 0.12 }
                    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {route}
              </motion.div>
            </AnimatePresence>
          </div>

          <BottomDock />
        </>
      ) : null}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <PortfolioApp />
    </RouterProvider>
  );
}
