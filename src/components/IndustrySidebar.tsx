import Link from "next/link";
import {
  Cpu,
  Shirt,
  Sofa,
  Cog,
  Car,
  Sparkles,
  Stethoscope,
  Wheat,
  UtensilsCrossed,
  HardHat,
  type LucideIcon,
} from "lucide-react";

export type SidebarIndustry = {
  name: string;
  slug: string;
  icon: LucideIcon;
};

export const sidebarIndustries: SidebarIndustry[] = [
  { name: "Electronics", slug: "electronics", icon: Cpu },
  { name: "Fashion", slug: "fashion", icon: Shirt },
  { name: "Home & Furniture", slug: "home-furniture", icon: Sofa },
  { name: "Machinery", slug: "machinery", icon: Cog },
  { name: "Automotive", slug: "automotive", icon: Car },
  { name: "Beauty", slug: "beauty", icon: Sparkles },
  { name: "Medical", slug: "medical", icon: Stethoscope },
  { name: "Agriculture", slug: "agriculture", icon: Wheat },
  { name: "Food & Beverage", slug: "food-beverage", icon: UtensilsCrossed },
  { name: "Construction", slug: "construction", icon: HardHat },
];

/** Desktop / tablet: vertical list, sits to the left of the hero copy. */
export default function IndustrySidebar() {
  return (
    <nav
      aria-label="Browse industries"
      className="hidden lg:flex flex-col border border-ink bg-paper w-full max-w-[220px] shrink-0"
    >
      {sidebarIndustries.map((ind) => {
        const Icon = ind.icon;
        return (
          <Link
            key={ind.slug}
            href={`/industries/${ind.slug}`}
            className="group flex items-center gap-3 px-4 py-3 border-b border-line last:border-b-0 text-sm text-ink hover:bg-ink hover:text-paper transition-colors duration-200"
          >
            <Icon
              size={16}
              className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            />
            <span className="font-medium tracking-tight">{ind.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Mobile: horizontally scrollable pill list. Rendered above the hero grid on small screens. */
export function IndustrySidebarMobile() {
  return (
    <nav aria-label="Browse industries" className="lg:hidden mb-8 sm:mb-10">
      <div
        className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sidebarIndustries.map((ind) => {
          const Icon = ind.icon;
          return (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="group flex items-center gap-2 shrink-0 snap-start border border-line px-4 py-2.5 text-xs sm:text-sm font-medium text-ink bg-paper hover:bg-ink hover:text-paper hover:border-ink transition-colors duration-200 whitespace-nowrap"
            >
              <Icon
                size={14}
                className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              />
              {ind.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
