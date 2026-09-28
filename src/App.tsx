import { RouterProvider, useRouter } from "@/lib/router";
import { HomePage } from "@/pages/Home";
import { AboutPage } from "@/pages/About";

function Pages() {
  const { pathname } = useRouter();
  return pathname === "/about" ? <AboutPage /> : <HomePage />;
}

export default function App() {
  return (
    <RouterProvider>
      <Pages />
    </RouterProvider>
  );
}
