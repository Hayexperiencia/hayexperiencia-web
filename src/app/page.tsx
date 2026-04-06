import Hero from "@/components/home/Hero";
import CampaignBanner from "@/components/home/CampaignBanner";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import WhyUs from "@/components/home/WhyUs";
import ContactForm from "@/components/ui/ContactForm";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <CampaignBanner />
      <FeaturedProperties />
      <ProjectsPreview />
      <WhyUs />

      {/* CTA final con formulario */}
      <section className="py-20 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-xl px-4">
          <ContactForm
            source="home-cta"
            title="Listo para dar el paso?"
            subtitle="Dejanos tus datos y te contactamos hoy"
            showMessage={true}
            compact={false}
            className="bg-white rounded-2xl p-8"
          />
        </div>
      </section>
    </>
  );
}
