import { RouterProvider, useRouter } from "@/lib/router";
import { HomePage } from "@/pages/Home";
import { AboutPage } from "@/pages/About";
import { ExperiencePage } from "@/pages/Experience";
import { RecognitionPage } from "@/pages/Recognition";

function Pages() {
  const { pathname } = useRouter();
  if (pathname === "/about") return <AboutPage />;
  if (pathname === "/experience") return <ExperiencePage />;
  if (pathname === "/recognition") return <RecognitionPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <RouterProvider>
      <Pages />
    </RouterProvider>
  );
}
