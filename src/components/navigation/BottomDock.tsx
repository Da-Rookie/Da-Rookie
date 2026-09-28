import {
  Award,
  BriefcaseBusiness,
  Home,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { AppLink, useRouter } from "@/lib/router";

interface DockItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const items: DockItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: UserRound },
  { href: "/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/recognition", label: "Recognition", icon: Award },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function BottomDock() {
  const { pathname } = useRouter();

  return (
    <nav className="bottom-dock" aria-label="Primary navigation">
      <div className="bottom-dock__inner">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <AppLink
              key={href}
              href={href}
              className={`dock-link${active ? " dock-link--active" : ""}`}
              ariaLabel={`${label}${active ? ", current page" : ""}`}
            >
              <span className="dock-link__icon" aria-hidden="true">
                <Icon size={17} strokeWidth={1.8} />
              </span>
              <span className="dock-link__label">{label}</span>
            </AppLink>
          );
        })}
      </div>
    </nav>
  );
}
