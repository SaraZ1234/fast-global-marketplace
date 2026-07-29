import Link from "next/link";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Investor Relations", href: "/investors" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { label: "Products", href: "/products" },
      { label: "Industries", href: "/industries" },
      { label: "Suppliers", href: "/suppliers" },
      { label: "Manufacturers", href: "/suppliers" },
      { label: "Brands", href: "/products" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Logistics", href: "/logistics" },
      { label: "Trade Assurance", href: "/services" },
      { label: "Payments", href: "/services" },
      { label: "Advertising", href: "/services" },
      { label: "Business Solutions", href: "/services" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/faq" },
      { label: "Blog", href: "/faq" },
      { label: "Guides", href: "/faq" },
      { label: "API Documentation", href: "/services" },
      { label: "Developers", href: "/services" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal" },
      { label: "Terms & Conditions", href: "/legal" },
      { label: "Refund Policy", href: "/legal" },
      { label: "Cookie Policy", href: "/legal" },
      { label: "Seller Agreement", href: "/legal" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          <div className="col-span-2 md:col-span-3 lg:col-span-1 pr-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-9 bg-paper flex items-center justify-center">
                <span className="text-ink font-display font-bold text-sm">F</span>
              </span>
              <span className="font-display font-bold text-lg tracking-tightest">FAST</span>
            </div>
            <p className="text-sm text-smoke leading-relaxed">
              Connecting manufacturers, wholesalers, retailers, and consumers worldwide on one
              secure trade platform.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs tracking-widest2 text-smoke mb-4 uppercase">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-bone/90 hover:text-paper transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-paper/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-smoke font-mono">
            © {new Date().getFullYear()} FAST GLOBAL MARKETPLACE — ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-6 text-xs text-smoke font-mono uppercase tracking-wide">
            <Link href="/contact" className="hover:text-paper">Email Support</Link>
            <Link href="/contact" className="hover:text-paper">Phone Support</Link>
            <Link href="/contact" className="hover:text-paper">Live Chat</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
