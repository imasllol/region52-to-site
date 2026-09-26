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

export default function HomePage() {
  return (
    <BookingProvider>
      <SiteHeader action={<BookingButton variant="compact" />} />
      <main>
        <HeroSection
          status={<WorkStatusIndicator />}
          primaryAction={<BookingButton variant="primary" />}
        />
        <OperatorDetailsSection />
        <AccreditationSection
          renderAction={(code) => <BookingButton variant="card" category={code} />}
        />
        <PriceSection />

        <section id="documents" aria-labelledby="documents-title" className="section pt-0 md:pt-0">
          <div className="container-site">
            <p className="eyebrow">Документы</p>
            <h2 id="documents-title" className="section-title mt-4">
              Что нужно знать перед техосмотром
            </h2>
            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <RequiredDocumentsSection />
              <LegalDocumentsSection />
            </div>
          </div>
        </section>

        <ScheduleSection />

        <section id="contacts" aria-labelledby="contacts-title" className="section">
          <div className="container-site grid gap-10 lg:grid-cols-2 lg:items-start">
            <ContactsSection />
            <AddressSection />
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
