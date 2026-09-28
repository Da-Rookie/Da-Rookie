import { RouterProvider, useRouter } from "@/lib/router";
import { HomePage } from "@/pages/Home";
import { AboutPage } from "@/pages/About";
import { ExperiencePage } from "@/pages/Experience";
import { RecognitionPage } from "@/pages/Recognition";
import { ContactPage } from "@/pages/Contact";
import { ProjectDetailPage } from "@/pages/ProjectDetail";

function Pages() {
  const { pathname } = useRouter();

  if (pathname === "/") return <HomePage />;
  if (pathname === "/about") return <AboutPage />;
  if (pathname === "/experience") return <ExperiencePage />;
  if (pathname === "/recognition") return <RecognitionPage />;
  if (pathname === "/contact") return <ContactPage />;
  if (pathname.startsWith("/projects/")) {
    return <ProjectDetailPage slug={decodeURIComponent(pathname.replace("/projects/", ""))} />;
  }

  return <ProjectDetailPage slug="__not-found__" />;
}

export default function App() {
  return (
    <RouterProvider>
      <Pages />
    </RouterProvider>
  );
}
