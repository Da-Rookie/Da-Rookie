import { RouterProvider, useRouter } from "@/lib/router";
import { HomePage } from "@/pages/Home";
import { AboutPage } from "@/pages/About";
import { ExperiencePage } from "@/pages/Experience";
import { RecognitionPage } from "@/pages/Recognition";
import { ContactPage } from "@/pages/Contact";

function Pages() {
  const { pathname } = useRouter();
  if (pathname === "/about") return <AboutPage />;
  if (pathname === "/experience") return <ExperiencePage />;
  if (pathname === "/recognition") return <RecognitionPage />;
  if (pathname === "/contact") return <ContactPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <RouterProvider>
      <Pages />
    </RouterProvider>
  );
}
