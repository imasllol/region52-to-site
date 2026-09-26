import { siteContent } from "@/content/site";

export function OperatorDetailsSection() {
  const { ownerName, registryNumber, inn, ogrnip } = siteContent;
  const items = [
    { label: "Оператор техосмотра", value: ownerName, mono: false },
    { label: "Номер в реестре операторов технического осмотра РСА", value: registryNumber, mono: true },
    { label: "ИНН", value: inn, mono: true },
    { label: "ОГРНИП", value: ogrnip, mono: true },
  ];

  return (
    <section aria-labelledby="operator-title" className="section pt-0 md:pt-0">
      <div className="container-site">
        <h2 id="operator-title" className="sr-only">
          Реквизиты оператора
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="card p-5">
              <dt className="text-xs leading-snug text-muted">{item.label}</dt>
              <dd
                className={`mt-2 text-lg font-semibold ${item.mono ? "font-mono tracking-wide tabular-nums" : ""}`}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
