import { ArrowUpRight } from "lucide-react";
import { AppLink } from "@/lib/router";
export function NextChapter({
  label,
  title,
  href,
}: {
  label: string;
  title: string;
  href: string;
}) {
  return (
    <section className="next-chapter">
      <div className="eyebrow">{label}</div>
      <AppLink href={href}>
        <h2>{title}</h2>
        <ArrowUpRight strokeWidth={1} />
      </AppLink>
    </section>
  );
}
