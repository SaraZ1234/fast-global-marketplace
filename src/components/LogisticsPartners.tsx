import Reveal from "@/components/Reveal";
import { SectionHeading } from "@/components/UI";

/**
 * NOTE: these use neutral text-based placeholder logos generated via placehold.co
 * so no third-party brand assets are bundled with the app. Swap the `logo` URLs
 * below for each company's official logo file once you have the rights/assets
 * (e.g. /logos/dhl.svg), keeping the same grayscale-on-hover classes.
 */
const logisticsPartners = [
  {
    name: "DHL",
    logo: "https://placehold.co/200x64/f5f4f0/1a1a1a?text=DHL&font=montserrat",
  },
  {
    name: "FedEx",
    logo: "https://placehold.co/200x64/f5f4f0/1a1a1a?text=FedEx&font=montserrat",
  },
  {
    name: "Maersk",
    logo: "https://placehold.co/200x64/f5f4f0/1a1a1a?text=Maersk&font=montserrat",
  },
];

export default function LogisticsPartners() {
  return (
    <section className="border-b border-line">
      <div className="container-x py-14 sm:py-20 md:py-24">
        <SectionHeading
          eyebrow="Fulfillment"
          title="Trusted Global Logistics Partners"
          align="center"
        />

        <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-10 sm:gap-16 md:gap-20">
          {logisticsPartners.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.05}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logo}
                alt={`${p.name} logo`}
                className="h-7 sm:h-9 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
