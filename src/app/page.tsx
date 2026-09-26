export default function HomePage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-site flex h-16 items-center font-display text-sm font-bold">
          ПТО Авдюков
        </div>
      </header>
      <main className="container-site section">
        <p className="eyebrow">Сайт в разработке</p>
        <h1 className="section-title mt-4">Пункт технического осмотра</h1>
        <a href="tel:+79200530730" className="btn btn-primary mt-8">
          Позвонить
        </a>
      </main>
      <footer className="border-t border-line">
        <div className="container-site py-8 text-sm text-muted">ИП Авдюков Сергей Алексеевич</div>
      </footer>
    </>
  );
}
