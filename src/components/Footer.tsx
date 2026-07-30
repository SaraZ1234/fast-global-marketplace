import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Headset,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
} from "lucide-react";

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

const trustBadges = [
  { icon: ShieldCheck, label: "Verified Suppliers" },
  { icon: BadgeCheck, label: "Trade Assurance" },
  { icon: Truck, label: "Global Logistics" },
  { icon: Headset, label: "24/7 Support" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

const paymentMethods = ["Visa", "Mastercard", "Amex", "PayPal", "Wire Transfer", "T/T"];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      {/* Trust strip */}
      <div className="border-b border-paper/15">
        <div className="container-x py-6 sm:py-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-paper/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-paper" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-bone/90">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-paper/15">
        <div className="container-x py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg tracking-tightest">
                Stay ahead of the market
              </h3>
              <p className="text-sm text-smoke mt-1">
                Get sourcing insights, supplier updates, and platform news in your inbox.
              </p>
            </div>
            <form className="flex flex-col xs:flex-row w-full lg:w-auto gap-3">
              <input
                type="email"
                required
                placeholder="Enter your business email"
                className="flex-1 lg:w-72 bg-paper/5 border border-paper/20 px-4 py-2.5 text-sm text-paper placeholder:text-smoke focus:outline-none focus:border-paper/50 transition-colors min-w-0"
              />
              <button
                type="submit"
                className="bg-paper text-ink font-mono text-xs uppercase tracking-widest2 px-6 py-2.5 hover:bg-bone transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container-x py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 sm:gap-10">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 sm:pr-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-9 bg-paper flex items-center justify-center shrink-0">
                <span className="text-ink font-display font-bold text-sm">F</span>
              </span>
              <span className="font-display font-bold text-lg tracking-tightest">FAST</span>
            </div>
            <p className="text-sm text-smoke leading-relaxed max-w-sm">
              Connecting manufacturers, wholesalers, retailers, and consumers worldwide on one
              secure trade platform.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center border border-paper/20 hover:border-paper/50 hover:bg-paper/5 transition-colors shrink-0"
                >
                  <Icon className="w-3.5 h-3.5 text-bone/90" strokeWidth={1.75} />
                </Link>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="min-w-0">
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

        {/* Payment methods */}
        <div className="mt-10 sm:mt-14 pt-8 border-t border-paper/15">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-xs tracking-widest2 text-smoke mb-3 uppercase">
                Accepted Payments
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="text-xs font-mono text-bone/80 border border-paper/20 px-3 py-1.5"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs tracking-widest2 text-smoke mb-3 uppercase md:text-right">
                Get the App
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#"
                  className="flex items-center gap-2 border border-paper/20 px-4 py-2 hover:border-paper/50 hover:bg-paper/5 transition-colors"
                >
                  <span className="text-xs font-medium text-bone/90">App Store</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 border border-paper/20 px-4 py-2 hover:border-paper/50 hover:bg-paper/5 transition-colors"
                >
                  <span className="text-xs font-medium text-bone/90">Google Play</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-8 border-t border-paper/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-smoke font-mono text-center md:text-left">
            © {new Date().getFullYear()} FAST GLOBAL MARKETPLACE — ALL RIGHTS RESERVED
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-smoke font-mono uppercase tracking-wide">
            <Link href="/contact" className="hover:text-paper">Email Support</Link>
            <Link href="/contact" className="hover:text-paper">Phone Support</Link>
            <Link href="/contact" className="hover:text-paper">Live Chat</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}