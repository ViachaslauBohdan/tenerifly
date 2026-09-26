import type { Locale } from "@/types/locale";

export type CookiePolicySection = {
  title: string;
  text: string;
};

export type CookiePolicyCopy = {
  title: string;
  backToHome: string;
  intro: string;
  sections: CookiePolicySection[];
};

const COPY: Record<Locale, CookiePolicyCopy> = {
  en: {
    title: "Cookie policy",
    backToHome: "Back to home",
    intro:
      "This policy explains how {brand} ({host}) uses cookies and similar storage. The site operator and data controller is PanaFera.",
    sections: [
      {
        title: "Who is responsible",
        text: "PanaFera operates {brand} at {host} as an online tourism intermediary. For questions about this policy or your data, call {phone}.",
      },
      {
        title: "Essential storage",
        text: "Your cookie choice is stored in this browser (localStorage, key tenerifly-cookie-consent) until you change it or clear site data. That storage is necessary to remember Accept or Reject. Staff who sign in to the admin area receive a strictly necessary cookie named atlantico_admin. It lasts 12 hours, is not used for advertising, and is sent only after that sign-in.",
      },
      {
        title: "Advertising",
        text: "If you choose Accept, the site loads Google Ads, tag {adsId}. Google may set cookies to measure whether an advertisement led to a visit or booking. Google sets those lifetimes: conversion cookies commonly last up to 90 days, and some advertising cookies can last up to 13 months. Google describes them at https://policies.google.com/technologies/cookies. The legal basis is your consent. If you choose Reject, this tag is not loaded.",
      },
      {
        title: "Payments",
        text: "If you pay by card, Stripe processes the payment and may set cookies needed to complete it. Those cookies are used only for the payment you requested.",
      },
      {
        title: "Changing your mind",
        text: "The cookie banner is shown each time you open the site, including after you have already chosen. You can also press Cookie settings to open it again on the same page. Accept turns advertising measurement on. Reject turns it off and withdraws consent. Withdrawing consent is the same action as refusing it.",
      },
      {
        title: "Your rights",
        text: "You can ask PanaFera for access to, correction of, or deletion of your personal data, and you can withdraw consent at any time. You can also lodge a complaint with the Spanish Data Protection Agency (AEPD): https://www.aepd.es.",
      },
    ],
  },
  ru: {
    title: "Политика cookie",
    backToHome: "На главную",
    intro:
      "Эта политика объясняет, как {brand} ({host}) использует cookie и похожие технологии. Оператор сайта и контролёр данных — PanaFera.",
    sections: [
      {
        title: "Кто отвечает",
        text: "PanaFera ведёт {brand} на {host} как онлайн-посредник в туризме. Вопросы по этой политике или вашим данным: {phone}.",
      },
      {
        title: "Необходимое хранение",
        text: "Ваш выбор cookie хранится в этом браузере (localStorage, ключ tenerifly-cookie-consent), пока вы его не измените или не очистите данные сайта. Это нужно, чтобы запомнить «Принять» или «Отклонить». Сотрудники, которые входят в админку, получают строго необходимый cookie atlantico_admin. Он живёт 12 часов, не используется для рекламы и ставится только после входа.",
      },
      {
        title: "Реклама",
        text: "Если вы нажимаете «Принять», сайт загружает Google Ads, тег {adsId}. Google может ставить cookie, чтобы измерить, привёл ли рекламный показ к визиту или бронированию. Срок задаёт Google: cookie конверсий обычно живут до 90 дней, часть рекламных cookie — до 13 месяцев. Описание: https://policies.google.com/technologies/cookies. Основание — ваше согласие. Если вы нажимаете «Отклонить», этот тег не загружается.",
      },
      {
        title: "Оплата",
        text: "Если вы платите картой, платёж проводит Stripe. Stripe может поставить cookie, нужные для завершения оплаты. Они используются только для платежа, который вы запросили.",
      },
      {
        title: "Как передумать",
        text: "Баннер cookie показывается при каждом открытии сайта, в том числе после уже сделанного выбора. Кнопка «Настройки cookie» открывает его снова на той же странице. «Принять» включает измерение рекламы. «Отклонить» выключает его и отзывает согласие. Отозвать согласие так же просто, как отказать в нём.",
      },
      {
        title: "Ваши права",
        text: "Вы можете запросить у PanaFera доступ к своим данным, их исправление или удаление и в любой момент отозвать согласие. Жалобу можно подать в Испанское агентство по защите данных (AEPD): https://www.aepd.es.",
      },
    ],
  },
  ua: {
    title: "Політика cookie",
    backToHome: "На головну",
    intro:
      "Ця політика пояснює, як {brand} ({host}) використовує cookie та подібні технології. Оператор сайту і контролер даних — PanaFera.",
    sections: [
      {
        title: "Хто відповідає",
        text: "PanaFera веде {brand} на {host} як онлайн-посередник у туризмі. Питання щодо цієї політики або ваших даних: {phone}.",
      },
      {
        title: "Необхідне зберігання",
        text: "Ваш вибір cookie зберігається в цьому браузері (localStorage, ключ tenerifly-cookie-consent), доки ви його не зміните або не очистите дані сайту. Це потрібно, щоб запам’ятати «Прийняти» або «Відхилити». Працівники, які входять в адмінку, отримують суворо необхідний cookie atlantico_admin. Він діє 12 годин, не використовується для реклами і ставиться лише після входу.",
      },
      {
        title: "Реклама",
        text: "Якщо ви натискаєте «Прийняти», сайт завантажує Google Ads, тег {adsId}. Google може ставити cookie, щоб виміряти, чи привів рекламний показ до візиту або бронювання. Строк задає Google: cookie конверсій зазвичай живуть до 90 днів, частина рекламних cookie — до 13 місяців. Опис: https://policies.google.com/technologies/cookies. Підстава — ваша згода. Якщо ви натискаєте «Відхилити», цей тег не завантажується.",
      },
      {
        title: "Оплата",
        text: "Якщо ви платите карткою, платіж проводить Stripe. Stripe може поставити cookie, потрібні для завершення оплати. Вони використовуються лише для платежу, який ви запросили.",
      },
      {
        title: "Як передумати",
        text: "Банер cookie показується щоразу, коли ви відкриваєте сайт, зокрема після вже зробленого вибору. Кнопка «Налаштування cookie» відкриває його знову на тій самій сторінці. «Прийняти» вмикає вимірювання реклами. «Відхилити» вимикає його і відкликає згоду. Відкликати згоду так само просто, як відмовити в ній.",
      },
      {
        title: "Ваші права",
        text: "Ви можете запитати в PanaFera доступ до своїх даних, їх виправлення або видалення і будь-коли відкликати згоду. Скаргу можна подати до Іспанського агентства захисту даних (AEPD): https://www.aepd.es.",
      },
    ],
  },
  pl: {
    title: "Polityka cookie",
    backToHome: "Powrót do strony głównej",
    intro:
      "Ta polityka wyjaśnia, jak {brand} ({host}) używa plików cookie i podobnych technologii. Operatorem strony i administratorem danych jest PanaFera.",
    sections: [
      {
        title: "Kto odpowiada",
        text: "PanaFera prowadzi {brand} pod adresem {host} jako internetowy pośrednik turystyczny. Pytania o tę politykę lub Twoje dane: {phone}.",
      },
      {
        title: "Niezbędne zapisy",
        text: "Twój wybór cookie jest zapisany w tej przeglądarce (localStorage, klucz tenerifly-cookie-consent), dopóki go nie zmienisz lub nie wyczyścisz danych strony. Zapis jest potrzebny, aby pamiętać Akceptuję albo Odrzucam. Pracownicy logujący się do panelu otrzymują ściśle niezbędne cookie atlantico_admin. Działa 12 godzin, nie służy reklamie i jest ustawiane tylko po zalogowaniu.",
      },
      {
        title: "Reklama",
        text: "Jeśli wybierzesz Akceptuję, strona ładuje Google Ads, tag {adsId}. Google może ustawiać cookie, aby mierzyć, czy reklama doprowadziła do wizyty lub rezerwacji. Czas określa Google: cookie konwersji zwykle trwają do 90 dni, a niektóre cookie reklamowe do 13 miesięcy. Opis: https://policies.google.com/technologies/cookies. Podstawą jest Twoja zgoda. Jeśli wybierzesz Odrzucam, ten tag się nie ładuje.",
      },
      {
        title: "Płatności",
        text: "Jeśli płacisz kartą, płatność obsługuje Stripe. Stripe może ustawić cookie potrzebne do jej dokończenia. Służą one tylko płatności, o którą prosisz.",
      },
      {
        title: "Zmiana decyzji",
        text: "Baner cookie pojawia się przy każdym otwarciu strony, także po wcześniejszym wyborze. Przycisk Ustawienia cookie otwiera go ponownie na tej samej stronie. Akceptuję włącza pomiar reklamy. Odrzucam wyłącza go i wycofuje zgodę. Wycofanie zgody jest tak samo proste jak jej odmowa.",
      },
      {
        title: "Twoje prawa",
        text: "Możesz poprosić PanaFera o dostęp do swoich danych, ich poprawienie lub usunięcie oraz w każdej chwili wycofać zgodę. Skargę można złożyć do hiszpańskiego organu ochrony danych (AEPD): https://www.aepd.es.",
      },
    ],
  },
  de: {
    title: "Cookie-Richtlinie",
    backToHome: "Zur Startseite",
    intro:
      "Diese Richtlinie erklärt, wie {brand} ({host}) Cookies und ähnliche Speicher nutzt. Betreiber der Website und Verantwortlicher ist PanaFera.",
    sections: [
      {
        title: "Wer verantwortlich ist",
        text: "PanaFera betreibt {brand} unter {host} als Online-Vermittler für Tourismus. Fragen zu dieser Richtlinie oder Ihren Daten: {phone}.",
      },
      {
        title: "Notwendige Speicherung",
        text: "Ihre Cookie-Auswahl wird in diesem Browser gespeichert (localStorage, Schlüssel tenerifly-cookie-consent), bis Sie sie ändern oder die Websitedaten löschen. Das ist nötig, um Akzeptieren oder Ablehnen zu merken. Mitarbeiter, die sich im Admin-Bereich anmelden, erhalten ein unbedingt erforderliches Cookie namens atlantico_admin. Es gilt 12 Stunden, dient nicht der Werbung und wird nur nach der Anmeldung gesetzt.",
      },
      {
        title: "Werbung",
        text: "Wenn Sie Akzeptieren wählen, lädt die Website Google Ads, Tag {adsId}. Google kann Cookies setzen, um zu messen, ob eine Anzeige zu einem Besuch oder einer Buchung geführt hat. Die Laufzeit legt Google fest: Conversion-Cookies gelten häufig bis zu 90 Tage, manche Werbe-Cookies bis zu 13 Monate. Beschreibung: https://policies.google.com/technologies/cookies. Rechtsgrundlage ist Ihre Einwilligung. Wenn Sie Ablehnen wählen, wird dieses Tag nicht geladen.",
      },
      {
        title: "Zahlungen",
        text: "Wenn Sie mit Karte zahlen, verarbeitet Stripe die Zahlung und kann Cookies setzen, die dafür nötig sind. Sie werden nur für die von Ihnen angeforderte Zahlung verwendet.",
      },
      {
        title: "Entscheidung ändern",
        text: "Das Cookie-Banner erscheint bei jedem Öffnen der Website, auch nach einer bereits getroffenen Wahl. Über Cookie-Einstellungen öffnen Sie es auf derselben Seite erneut. Akzeptieren schaltet die Werbemessung ein. Ablehnen schaltet sie aus und widerruft die Einwilligung. Der Widerruf ist genauso einfach wie die Ablehnung.",
      },
      {
        title: "Ihre Rechte",
        text: "Sie können von PanaFera Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen und die Einwilligung jederzeit widerrufen. Eine Beschwerde können Sie bei der spanischen Datenschutzbehörde (AEPD) einreichen: https://www.aepd.es.",
      },
    ],
  },
  es: {
    title: "Política de cookies",
    backToHome: "Volver al inicio",
    intro:
      "Esta política explica cómo {brand} ({host}) usa cookies y almacenamientos similares. El operador del sitio y responsable del tratamiento es PanaFera.",
    sections: [
      {
        title: "Quién es el responsable",
        text: "PanaFera opera {brand} en {host} como intermediario turístico online. Para preguntas sobre esta política o sus datos, llame al {phone}.",
      },
      {
        title: "Almacenamiento esencial",
        text: "Su elección de cookies se guarda en este navegador (localStorage, clave tenerifly-cookie-consent) hasta que la cambie o borre los datos del sitio. Es necesario para recordar Aceptar o Rechazar. El personal que entra en el área de administración recibe una cookie estrictamente necesaria llamada atlantico_admin. Dura 12 horas, no se usa para publicidad y solo se envía después de ese acceso.",
      },
      {
        title: "Publicidad",
        text: "Si elige Aceptar, el sitio carga Google Ads, etiqueta {adsId}. Google puede instalar cookies para medir si un anuncio llevó a una visita o a una reserva. Google fija esos plazos: las cookies de conversión suelen durar hasta 90 días, y algunas cookies publicitarias hasta 13 meses. Google las describe en https://policies.google.com/technologies/cookies. La base jurídica es su consentimiento. Si elige Rechazar, esta etiqueta no se carga.",
      },
      {
        title: "Pagos",
        text: "Si paga con tarjeta, Stripe procesa el pago y puede instalar cookies necesarias para completarlo. Esas cookies se usan solo para el pago que usted solicita.",
      },
      {
        title: "Cambiar de opinión",
        text: "El banner de cookies aparece cada vez que abre el sitio, también después de haber elegido. El botón Ajustes de cookies lo abre de nuevo en la misma página. Aceptar activa la medición publicitaria. Rechazar la desactiva y retira el consentimiento. Retirar el consentimiento es la misma acción que rechazarlo.",
      },
      {
        title: "Sus derechos",
        text: "Puede pedir a PanaFera acceso, rectificación o supresión de sus datos personales, y puede retirar el consentimiento en cualquier momento. También puede reclamar ante la Agencia Española de Protección de Datos (AEPD): https://www.aepd.es.",
      },
    ],
  },
  fr: {
    title: "Politique cookies",
    backToHome: "Retour à l'accueil",
    intro:
      "Cette politique explique comment {brand} ({host}) utilise des cookies et des stockages similaires. L'exploitant du site et responsable du traitement est PanaFera.",
    sections: [
      {
        title: "Qui est responsable",
        text: "PanaFera exploite {brand} sur {host} en tant qu'intermédiaire touristique en ligne. Pour toute question sur cette politique ou vos données, appelez le {phone}.",
      },
      {
        title: "Stockage essentiel",
        text: "Votre choix de cookies est enregistré dans ce navigateur (localStorage, clé tenerifly-cookie-consent) jusqu'à ce que vous le changiez ou effaciez les données du site. Ce stockage est nécessaire pour mémoriser Accepter ou Refuser. Le personnel qui se connecte à l'administration reçoit un cookie strictement nécessaire nommé atlantico_admin. Il dure 12 heures, ne sert pas à la publicité et n'est déposé qu'après cette connexion.",
      },
      {
        title: "Publicité",
        text: "Si vous choisissez Accepter, le site charge Google Ads, balise {adsId}. Google peut déposer des cookies pour mesurer si une publicité a mené à une visite ou à une réservation. Google fixe ces durées : les cookies de conversion durent en général jusqu'à 90 jours, et certains cookies publicitaires jusqu'à 13 mois. Google les décrit sur https://policies.google.com/technologies/cookies. La base juridique est votre consentement. Si vous choisissez Refuser, cette balise n'est pas chargée.",
      },
      {
        title: "Paiements",
        text: "Si vous payez par carte, Stripe traite le paiement et peut déposer des cookies nécessaires pour le terminer. Ces cookies servent uniquement au paiement que vous demandez.",
      },
      {
        title: "Changer d'avis",
        text: "Le bandeau cookies s'affiche à chaque ouverture du site, y compris après un choix déjà fait. Le bouton Paramètres des cookies le rouvre sur la même page. Accepter active la mesure publicitaire. Refuser la désactive et retire le consentement. Retirer le consentement est la même action que le refuser.",
      },
      {
        title: "Vos droits",
        text: "Vous pouvez demander à PanaFera l'accès, la rectification ou l'effacement de vos données, et retirer votre consentement à tout moment. Vous pouvez aussi introduire une réclamation auprès de l'agence espagnole de protection des données (AEPD) : https://www.aepd.es.",
      },
    ],
  },
};

export function cookiePolicyCopy(locale: Locale): CookiePolicyCopy {
  return COPY[locale] ?? COPY.en;
}

export function fillCookiePolicy(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}
