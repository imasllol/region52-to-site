import type { Metadata } from "next";
import { siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — ПТО ИП Авдюков С. А.",
  description: "Как пункт техосмотра использует данные из формы онлайн-записи.",
};

export default function PrivacyPage() {
  const { ownerName, inn, ogrnip, address, email, phone } = siteContent;

  return (
    <>
      <header className="border-b border-line">
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <a href="/" className="font-display text-sm font-bold">
            {siteContent.brand}
          </a>
          <a href="/" className="btn btn-ghost min-h-10 px-4 py-2 text-sm">
            На главную
          </a>
        </div>
      </header>

      <main className="container-site section">
        <article className="mx-auto max-w-3xl">
          <p className="eyebrow">Документ</p>
          <h1 className="section-title mt-4">Политика конфиденциальности</h1>

          <div className="mt-10 grid gap-8 leading-relaxed text-muted [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink">
            <section>
              <h2>1. Оператор персональных данных</h2>
              <p className="mt-3">
                {ownerName}, ИНН {inn}, ОГРНИП {ogrnip}. Адрес: {address.full}. Телефон:{" "}
                {phone.display}, электронная почта: {email}.
              </p>
            </section>

            <section>
              <h2>2. Какие данные мы получаем</h2>
              <p className="mt-3">
                Из формы онлайн-записи на техосмотр: имя, номер телефона, категория транспортного
                средства и желаемая дата техосмотра.
              </p>
            </section>

            <section>
              <h2>3. Зачем мы используем данные</h2>
              <p className="mt-3">
                Только для связи с вами: чтобы перезвонить и согласовать время технического осмотра. Мы
                не используем данные для рекламы и не передаем их третьим лицам.
              </p>
            </section>

            <section>
              <h2>4. Основание обработки</h2>
              <p className="mt-3">
                Ваше согласие, которое вы даете отметкой в форме записи, в соответствии с
                Федеральным законом от 27.07.2006 N 152-ФЗ «О персональных данных».
              </p>
            </section>

            <section>
              <h2>5. Как передаются и хранятся данные</h2>
              <p className="mt-3">
                Данные заявки приходят оператору на электронную почту. Сайт не хранит заявки в базе
                данных. Оператор хранит данные не дольше, чем это нужно для записи на техосмотр.
              </p>
            </section>

            <section>
              <h2>6. Как отозвать согласие</h2>
              <p className="mt-3">
                Напишите на{" "}
                <a href={`mailto:${email}`} className="text-ink underline underline-offset-4">
                  {email}
                </a>{" "}
                или позвоните по телефону {phone.display}. Мы удалим ваши данные.
              </p>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
