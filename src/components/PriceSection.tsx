import { siteContent } from "@/content/site";
import { FileTextIcon, PhoneIcon } from "./Icons";

export function PriceSection() {
  const { priceDocumentHref, phone } = siteContent;

  return (
    <section id="price" aria-labelledby="price-title" className="section pt-0 md:pt-0">
      <div className="container-site">
        <div className="card relative overflow-hidden p-8 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-accent/20 blur-3xl"
          />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Цены</p>
              <h2 id="price-title" className="section-title mt-4">
                Стоимость ТО
              </h2>
              {priceDocumentHref ? (
                <p className="mt-4 text-muted">
                  Стоимость технического осмотра по категориям транспортных средств указана в
                  документе оператора.
                </p>
              ) : (
                <p className="mt-4 text-lg">
                  Стоимость уточняйте по телефону{" "}
                  <a href={`tel:${phone.tel}`} className="font-semibold text-accent">
                    {phone.display}
                  </a>
                </p>
              )}
            </div>
            {priceDocumentHref ? (
              <a
                href={priceDocumentHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-base"
              >
                <FileTextIcon className="size-5" />
                Стоимость ТО
              </a>
            ) : (
              <a href={`tel:${phone.tel}`} className="btn btn-primary text-base">
                <PhoneIcon className="size-5" />
                Позвонить
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
