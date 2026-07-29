import { LucideIcon, Check } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest2 uppercase text-smoke">
      <span className="w-6 h-px bg-ink" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display font-bold text-3xl md:text-4xl tracking-tightest">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-ash leading-relaxed max-w-xl mx-auto md:mx-0">
          {description}
        </p>
      )}
    </div>
  );
}

export function FeatureRow({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 py-3 border-b border-line">
      <Check size={16} strokeWidth={2.5} className="shrink-0" />
      <span className="text-sm">{label}</span>
    </li>
  );
}

export function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-line pl-5">
      <div className="font-display font-bold text-3xl md:text-4xl tracking-tightest">
        {value}
      </div>
      <div className="mt-1 text-xs font-mono uppercase tracking-widest2 text-smoke">
        {label}
      </div>
    </div>
  );
}

export function PrimaryButton({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 text-sm font-medium hover:bg-ash transition-colors"
    >
      {children}
      {Icon && <Icon size={16} />}
    </Link>
  );
}

export function GhostButton({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 border border-ink px-6 py-3.5 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
    >
      {children}
      {Icon && <Icon size={16} />}
    </Link>
  );
}

export function PageHero({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-line">
      <div className="container-x py-20 md:py-28">
        <Eyebrow>{kicker}</Eyebrow>
        <h1 className="mt-5 font-display font-bold text-4xl md:text-6xl tracking-tightest max-w-3xl">
          {title}
        </h1>
        <p className="mt-6 text-ash max-w-xl leading-relaxed">{description}</p>
      </div>
    </section>
  );
}
