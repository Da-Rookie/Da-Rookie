import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface RouterContextValue {
  pathname: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function currentPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function pathnameOnly(path: string) {
  return path.split(/[?#]/)[0] || "/";
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => currentPath());

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const handlePopState = (event: PopStateEvent) => {
      setPath(currentPath());
      const scrollY = typeof event.state?.scrollY === "number" ? event.state.scrollY : 0;
      requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "auto" }));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = new URL(to, window.location.origin);
    const next = `${target.pathname}${target.search}${target.hash}`;
    const now = currentPath();

    if (next === now) {
      if (target.hash) {
        document.querySelector(target.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    window.history.replaceState({ ...window.history.state, scrollY: window.scrollY }, "");
    window.history.pushState({ scrollY: 0 }, "", next);
    setPath(next);

    if (target.hash) {
      requestAnimationFrame(() => {
        document.querySelector(target.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  const value = useMemo(
    () => ({ pathname: pathnameOnly(path), navigate }),
    [path, navigate],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRouter must be used inside RouterProvider");
  return context;
}

interface AppLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export function AppLink({ href, children, className, ariaLabel, onClick }: AppLinkProps) {
  const { navigate } = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    onClick?.();
    navigate(href);
  };

  return (
    <a href={href} className={className} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </a>
  );
}
