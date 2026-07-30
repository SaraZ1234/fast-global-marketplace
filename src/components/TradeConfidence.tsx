import { ShieldCheck, CreditCard, ClipboardCheck, Truck } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/UI";

const confidenceFeatures = [
  {
    icon: ShieldCheck,
    title: "Verified Suppliers",
    description: "Source products from trusted and verified manufacturers.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Safe international payment options with buyer protection.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspection Services",
    description: "Independent quality inspections before shipment.",
  },
  {
    icon: Truck,
    title: "Global Shipping",
    description: "Worldwide logistics and reliable delivery solutions.",
  },
];

export default function TradeConfidence() {
  return (
    <section className="border-b border-line bg-bone">
      <div className="container-x py-14 sm:py-20 md:py-28">
        <SectionHeading eyebrow="Assurance" title="Trade with Confidence" align="center" />

        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
          {confidenceFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 4) * 0.05}>
                <div className="group bg-paper p-6 sm:p-8 h-full card-hover flex flex-col items-start">
                  <div className="flex items-center justify-center w-11 h-11 border border-ink group-hover:bg-ink group-hover:text-paper transition-colors duration-200">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-display font-semibold text-base sm:text-lg tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-ash leading-relaxed">{f.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
