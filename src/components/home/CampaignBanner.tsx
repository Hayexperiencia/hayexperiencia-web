import Link from "next/link";

// Editar estos valores para cambiar el banner de campaña
const CAMPAIGN = {
  title: "Descubre el Oriente Antioqueño",
  subtitle: "Propiedades únicas en los municipios más hermosos de Colombia",
  cta: "Ver propiedades",
  ctaHref: "/propiedades",
  backgroundImage: "/images/hero-oriente.jpg",
};

interface CampaignBannerProps {
  title?: string;
  subtitle?: string;
  cta?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

export default function CampaignBanner({
  title = CAMPAIGN.title,
  subtitle = CAMPAIGN.subtitle,
  cta = CAMPAIGN.cta,
  ctaHref = CAMPAIGN.ctaHref,
  backgroundImage = CAMPAIGN.backgroundImage,
}: CampaignBannerProps) {
  return (
    <section
      className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#110d3f]/75" />
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          {title}
        </h2>
        <p className="mt-4 text-lg md:text-xl text-gray-200">{subtitle}</p>
        <Link
          href={ctaHref}
          className="mt-8 inline-flex items-center px-8 py-3.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors duration-200 text-lg"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
