import { RouterProvider, useRouter } from "@/lib/router";
import { HomePage } from "@/pages/Home";
import { AboutPage } from "@/pages/About";
import { ExperiencePage } from "@/pages/Experience";

function Pages() {
  const { pathname } = useRouter();
  if (pathname === "/about") return <AboutPage />;
  if (pathname === "/experience") return <ExperiencePage />;
  return <HomePage />;
}

export default function App() {
  return (
    <RouterProvider>
      <Pages />
    </RouterProvider>
  );
}
