/**
 * Контент сайта (блупринт «Контент сайта»).
 * Единственный источник всех текстов и данных ПТО. Тексты взяты с region52-to.ru.
 * Модуль не импортирует серверные библиотеки и работает и на клиенте, и на сервере.
 */

export type VehicleCategoryCode = "L" | "M1" | "M2" | "M3" | "N1" | "N2" | "N3" | "O3" | "O4";

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1 = понедельник

export type VehicleIcon = "moto" | "car" | "bus" | "truck" | "trailer";

export interface VehicleCategory {
  code: VehicleCategoryCode;
  shortLabel: string;
  description: string;
  icon: VehicleIcon;
}

export interface ScheduleDay {
  weekday: Weekday;
  /** «Понедельник» */
  label: string;
  /** «Пн» */
  short: string;
  /** «в понедельник» — для фразы «откроется в понедельник в 9:00» */
  onLabel: string;
  /** "HH:MM" или null для выходного */
  open: string | null;
  close: string | null;
}

export interface WorkSchedule {
  days: ScheduleDay[];
}

export interface LegalDocument {
  title: string;
  href: string | null;
}

export interface SiteContent {
  ownerName: string;
  ownerShortName: string;
  title: string;
  brand: string;
  registryNumber: string;
  inn: string;
  ogrnip: string;
  phone: { display: string; tel: string };
  email: string;
  busNotice: string;
  address: {
    postalCode: string;
    region: string;
    district: string;
    locality: string;
    street: string;
    full: string;
    short: string;
  };
  /** Координаты ПТО. Взяты по улице Южная на Яндекс Картах, точку здания нужно уточнить. */
  geo: { lat: number; lon: number };
  categories: VehicleCategory[];
  schedule: WorkSchedule;
  legalDocuments: LegalDocument[];
  priceDocumentHref: string | null;
  requiredDocuments: string[];
  timeZone: string;
}

export const siteContent: SiteContent = {
  ownerName: "ИП Авдюков Сергей Алексеевич",
  ownerShortName: "ИП Авдюков С. А.",
  title: "Пункт технического осмотра ИП Авдюков Сергей Алексеевич",
  brand: "ПТО Авдюков",
  registryNumber: "01655",
  inn: "521000335414",
  ogrnip: "304525408500106",
  phone: { display: "+7 (920) 053-07-30", tel: "+79200530730" },
  email: "tatyanagrshina@mail.ru",
  busNotice: "Прохождение ТО автобусов по предварительной записи по телефону",
  address: {
    postalCode: "607340",
    region: "Нижегородская область",
    district: "Вознесенский район",
    locality: "Вознесенское",
    street: "ул. Южная, д. 12",
    full: "607340, Нижегородская область, Вознесенский район, Вознесенское, ул. Южная, д. 12",
    short: "с. Вознесенское, ул. Южная, д. 12",
  },
  geo: { lat: 54.885228, lon: 42.771117 },
  categories: [
    {
      code: "L",
      shortLabel: "Мототехника",
      description:
        "Мопеды, мотовелосипеды, мокики, мотоциклы, мотороллеры, трициклы, квадрициклы.",
      icon: "moto",
    },
    {
      code: "M1",
      shortLabel: "Легковые",
      description:
        "Транспортные средства, используемые для перевозки пассажиров и имеющие, помимо места водителя, не более восьми мест для сидения",
      icon: "car",
    },
    {
      code: "M2",
      shortLabel: "Автобусы до 5 т",
      description:
        "Транспортные средства, используемые для перевозки пассажиров, имеющие, помимо места водителя, более восьми мест для сидения, технически допустимая максимальная масса которых не превышает 5 тонн",
      icon: "bus",
    },
    {
      code: "M3",
      shortLabel: "Автобусы свыше 5 т",
      description:
        "Транспортные средства, используемые для перевозки пассажиров, имеющие, помимо места водителя, более восьми мест для сидения, технически допустимая максимальная масса которых превышает 5 тонн",
      icon: "bus",
    },
    {
      code: "N1",
      shortLabel: "Грузовые до 3,5 т",
      description:
        "Транспортные средства, предназначенные для перевозки грузов, имеющие технически допустимую максимальную массу не более 3,5 тонн",
      icon: "truck",
    },
    {
      code: "N2",
      shortLabel: "Грузовые 3,5–12 т",
      description:
        "Транспортные средства, предназначенные для перевозки грузов, имеющие технически допустимую максимальную массу свыше 3,5 тонн, но не более 12 тонн",
      icon: "truck",
    },
    {
      code: "N3",
      shortLabel: "Грузовые свыше 12 т",
      description:
        "Транспортные средства, предназначенные для перевозки грузов, имеющие технически допустимую максимальную массу более 12 тонн",
      icon: "truck",
    },
    {
      code: "O3",
      shortLabel: "Прицепы 3,5–10 т",
      description:
        "Прицепы, технически допустимая максимальная масса которых свыше 3,5 т, но не более 10 тонн",
      icon: "trailer",
    },
    {
      code: "O4",
      shortLabel: "Прицепы свыше 10 т",
      description: "Прицепы, технически допустимая максимальная масса которых более 10 тонн",
      icon: "trailer",
    },
  ],
  schedule: {
    days: [
      { weekday: 1, label: "Понедельник", short: "Пн", onLabel: "в понедельник", open: null, close: null },
      { weekday: 2, label: "Вторник", short: "Вт", onLabel: "во вторник", open: "09:00", close: "18:00" },
      { weekday: 3, label: "Среда", short: "Ср", onLabel: "в среду", open: "09:00", close: "18:00" },
      { weekday: 4, label: "Четверг", short: "Чт", onLabel: "в четверг", open: "13:00", close: "19:00" },
      { weekday: 5, label: "Пятница", short: "Пт", onLabel: "в пятницу", open: "09:00", close: "18:00" },
      { weekday: 6, label: "Суббота", short: "Сб", onLabel: "в субботу", open: "08:00", close: "16:00" },
      { weekday: 7, label: "Воскресенье", short: "Вс", onLabel: "в воскресенье", open: null, close: null },
    ],
  },
  // Файлы лежат в public/docs под исходными именами от владельца ПТО.
  legalDocuments: [
    { title: "Федеральный закон о техническом осмотре", href: "/docs/zakon_o_to.docx" },
    {
      title: "Правила проведения технического осмотра транспортных средств",
      href: "/docs/pravila_provedenia.docx",
    },
    { title: "Типовой договор", href: "/docs/dogovor%20(1).doc" },
    { title: "Постановление проведения ТО М2, М3", href: "/docs/prikaz.pdf" },
  ],
  priceDocumentHref: "/docs/tarif.pdf",
  requiredDocuments: [
    "Документ, удостоверяющий личность",
    "Свидетельство о регистрации транспортного средства или паспорт транспортного средства",
  ],
  timeZone: "Europe/Moscow",
};

export function getCategory(code: VehicleCategoryCode): VehicleCategory {
  const category = siteContent.categories.find((c) => c.code === code);
  if (!category) throw new Error(`Unknown vehicle category: ${code}`);
  return category;
}

export const vehicleCategoryCodes = siteContent.categories.map((c) => c.code);
