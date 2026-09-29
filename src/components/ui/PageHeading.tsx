import type { ReactNode } from "react";
export function PageHeading({
  index,
  label,
  children,
  description,
}: {
  index: string;
  label: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <header className="page-heading">
      <div className="eyebrow">
        <span>
          {index} / {label}
        </span>
        <span>THE PRACTICE OF PRASETYO</span>
      </div>
      <h1>{children}</h1>
      {description && <p className="page-heading-description">{description}</p>}
    </header>
  );
}
