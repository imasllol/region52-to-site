import { AccreditationSection } from "@/components/AccreditationSection";
import { AddressSection } from "@/components/AddressSection";
import { ContactsSection } from "@/components/ContactsSection";
import { HeroSection } from "@/components/HeroSection";
import { LegalDocumentsSection } from "@/components/LegalDocumentsSection";
import { OperatorDetailsSection } from "@/components/OperatorDetailsSection";
import { PriceSection } from "@/components/PriceSection";
import { RequiredDocumentsSection } from "@/components/RequiredDocumentsSection";
import { ScheduleSection } from "@/components/ScheduleSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WorkStatusIndicator } from "@/components/WorkStatusIndicator";
import { BookingButton } from "@/features/booking/BookingButton";
import { BookingProvider } from "@/features/booking/BookingProvider";
import { HeroBackground } from "@/features/hero3d/HeroBackground";
import { AmbientBackground } from "@/features/motion/AmbientBackground";
import { AnimatedHeroTitle } from "@/features/motion/AnimatedHeroTitle";
import { MagneticButton } from "@/features/motion/MagneticButton";
import { Reveal } from "@/features/motion/Reveal";
import { ScrollProgressBar } from "@/features/motion/ScrollProgressBar";

export default function HomePage() {
  return (
    <BookingProvider>
      <AmbientBackground />
      <SiteHeader
        action={
          <MagneticButton className="grid">
            <BookingButton variant="compact" />
          </MagneticButton>
        }
        progress={<ScrollProgressBar />}
      />
      <main>
        <HeroSection
          background={<HeroBackground />}
          title={<AnimatedHeroTitle />}
          status={<WorkStatusIndicator />}
          primaryAction={
            <MagneticButton>
              <BookingButton variant="primary" />
            </MagneticButton>
          }
        />
        <Reveal>
          <OperatorDetailsSection />
        </Reveal>
        <AccreditationSection
          renderAction={(code) => <BookingButton variant="card" category={code} />}
        />
        <Reveal>
          <PriceSection />
        </Reveal>

        <section id="documents" aria-labelledby="documents-title" className="section pt-0 md:pt-0">
          <div className="container-site">
            <Reveal>
              <p className="eyebrow">Документы</p>
              <h2 id="documents-title" className="section-title mt-4">
                Что нужно знать перед техосмотром
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <Reveal>
                <RequiredDocumentsSection />
              </Reveal>
              <Reveal delay={0.1}>
                <LegalDocumentsSection />
              </Reveal>
            </div>
          </div>
        </section>

        <Reveal>
          <ScheduleSection />
        </Reveal>

        <section id="contacts" aria-labelledby="contacts-title" className="section">
          <div className="container-site grid gap-10 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <ContactsSection />
            </Reveal>
            <Reveal delay={0.1}>
              <AddressSection />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter
        links={
          <a href="/privacy" className="underline-offset-4 hover:text-accent hover:underline">
            Политика конфиденциальности
          </a>
        }
      />
    </BookingProvider>
  );
}
