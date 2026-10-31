/**
 * Creates the sign-up form for the show and its spreadsheet.
 *
 * The audience opens one link (from WhatsApp or the QR on the screen), gives consent,
 * picks a Beatles song, says where they live (the venue comes pre-filled from tonight's link), and can answer
 * a 10-question Beatles quiz. Every submission:
 *   - adds name + song + quiz score to the "במה" tab (what the raffle screen reads; no phones),
 *   - and, for people who agreed to receive updates, saves or updates them in "אנשי קשר"
 *     (one row per phone number, remembered across shows), with ready-sorted views
 *     by area/city and by club.
 *
 * How to run: script.google.com → New project → paste this file → fill in the
 * settings below → Run "createSongRaffleForm" → approve access → copy the links
 * from the execution log.
 */

// ---------- Settings ----------
const ARTIST = 'שם הלהקה / האמן';                 // shown in the consent texts
const CONTACT = 'טלפון או מייל ליצירת קשר';         // for removal and privacy requests
const GROUP_LINK = '';                              // optional: one WhatsApp group for everyone, https://chat.whatsapp.com/...
// false = the updates consent is a separate, optional box (recommended).
// true  = signing up for the raffle requires agreeing to receive updates.
const REQUIRE_UPDATES_CONSENT = false;

const AREAS = ['צפון', 'חיפה והקריות', 'שרון', 'מרכז / גוש דן', 'ירושלים והסביבה', 'שפלה', 'דרום', 'אילת והערבה'];
// Optional: a WhatsApp group per area. After choosing their area, people get that area's link.
const AREA_GROUPS = {
  // 'צפון': 'https://chat.whatsapp.com/...',
  // 'מרכז / גוש דן': 'https://chat.whatsapp.com/...',
};

// The band's repertoire: the audience picks from this list. Edit it to match your setlist.
const SONGS = [
  "Love Me Do",
  "Please Please Me",
  "From Me to You",
  "She Loves You",
  "I Want to Hold Your Hand",
  "Twist and Shout",
  "All My Loving",
  "Can't Buy Me Love",
  "A Hard Day's Night",
  "And I Love Her",
  "I Feel Fine",
  "Eight Days a Week",
  "Ticket to Ride",
  "Help!",
  "Yesterday",
  "Day Tripper",
  "We Can Work It Out",
  "Drive My Car",
  "Norwegian Wood",
  "Michelle",
  "In My Life",
  "Nowhere Man",
  "Paperback Writer",
  "Eleanor Rigby",
  "Yellow Submarine",
  "Here, There and Everywhere",
  "Got to Get You into My Life",
  "Penny Lane",
  "Strawberry Fields Forever",
  "With a Little Help from My Friends",
  "Lucy in the Sky with Diamonds",
  "Sgt. Pepper's Lonely Hearts Club Band",
  "When I'm Sixty-Four",
  "A Day in the Life",
  "All You Need Is Love",
  "Hello, Goodbye",
  "Magical Mystery Tour",
  "Lady Madonna",
  "Hey Jude",
  "Revolution",
  "Back in the U.S.S.R.",
  "Ob-La-Di, Ob-La-Da",
  "While My Guitar Gently Weeps",
  "Blackbird",
  "Helter Skelter",
  "Get Back",
  "Don't Let Me Down",
  "The Ballad of John and Yoko",
  "Come Together",
  "Something",
  "Here Comes the Sun",
  "Octopus's Garden",
  "Oh! Darling",
  "Let It Be",
  "The Long and Winding Road",
  "Across the Universe",
];

// The phone quiz: different questions from the ones shown on the big screen, so the screen never gives answers away.
const QUIZ = [
  { q: 'מי מהביטלס נולד ראשון?', right: "רינגו סטאר", wrong: ["ג׳ון לנון", "פול מקרטני", "ג׳ורג׳ הריסון"] },
  { q: 'מי היה הצעיר בביטלס?', right: "ג׳ורג׳ הריסון", wrong: ["פול מקרטני", "רינגו סטאר", "ג׳ון לנון"] },
  { q: 'איך נקראה הלהקה של ג׳ון לנון לפני הביטלס?', right: "The Quarrymen", wrong: ["Wings", "The Hollies", "The Searchers"] },
  { q: 'איך נקראה הלהקה שהקים פול מקרטני אחרי הביטלס?', right: "Wings", wrong: ["Cream", "Traveling Wilburys", "Plastic Ono Band"] },
  { q: 'באיזה סרט מ‑1964 הביטלס בורחים ממעריצות ברחבי לונדון?', right: "A Hard Day's Night", wrong: ["Help!", "Let It Be", "Magical Mystery Tour"] },
  { q: 'איזה שיר של הביטלס נחשב לשיר עם הכי הרבה גרסאות כיסוי?', right: "Yesterday", wrong: ["Let It Be", "Hey Jude", "Michelle"] },
  { q: 'מי מהביטלס הכניס את הסיטאר ההודי לשירי הלהקה?', right: "ג׳ורג׳ הריסון", wrong: ["ג׳ון לנון", "פול מקרטני", "רינגו סטאר"] },
  { q: 'איך ממשיכה השורה „Ob-la-di, ob-la-da, life goes…”?', right: "on", wrong: ["by", "home", "away"] },
  { q: 'באיזה אצטדיון בניו יורק הופיעו הביטלס ב‑1965 מול יותר מ‑55 אלף איש?', right: "Shea Stadium", wrong: ["Yankee Stadium", "Madison Square Garden", "Wembley"] },
  { q: 'באיזו שנה נרצח ג׳ון לנון?', right: "1980", wrong: ["1975", "1985", "1970"] },
];

// Question titles, shared by the form and the on-submit handler.
const T = {
  name: 'השם שיוצג על המסך',
  song: 'איזה שיר של הביטלס הייתם רוצים לבחור?',
  phone: 'טלפון נייד (לעדכונים בוואטסאפ)',
  city: 'באיזו עיר אתם גרים?',
  area: 'באיזה אזור?',
  club: 'איפה ההופעה הערב?',
  consent: 'אישור השתתפות',
  updates: 'עדכונים על הופעות באזור שלי',
};
const CONTACT_HEADERS = ['טלפון', 'שם', 'עיר', 'אזור', 'מועדונים', 'נרשמו לראשונה', 'עודכן לאחרונה', 'שירים שביקשו'];

function createSongRaffleForm() {
  const form = FormApp.create('🎤 בוחרים שיר בהופעה – ' + ARTIST);
  form.setDescription([
    'נרשמים, בוחרים שיר של הביטלס, ובמהלך ההופעה נגריל מי בוחר את השיר הבא! השיר הכי מבוקש ייסגר את הערב.',
    '',
    'הודעה על איסוף מידע: את הפרטים בטופס אוסף ' + ARTIST + ' (' + CONTACT + ').',
    'השם והשיר משמשים להגרלה ויוצגו על המסך בהופעה. הטלפון, העיר, האזור והמועדון ישמשו רק לשליחת עדכונים על הופעות, ורק אם תסמנו את האישור לכך.',
    'אינכם חייבים למסור את הפרטים, אבל בלי שם ושיר אי אפשר להשתתף בהגרלה.',
    'הפרטים נשמרים בחשבון Google של ' + ARTIST + ', לא יועברו לאחרים, ואפשר לבקש לעיין בהם, לתקן או למחוק אותם בכל עת דרך ' + CONTACT + '.',
  ].join('\n'));
  form.setCollectEmail(false);

  form.addTextItem().setTitle(T.name).setRequired(true);
  form.addListItem().setTitle(T.song).setChoiceValues(SONGS).setRequired(true);
  // Filled in automatically: the show screen puts tonight's venue into the link it shows as a QR.
  const clubItem = form.addTextItem().setTitle(T.club).setHelpText('ממולא אוטומטית מהלינק של הערב').setRequired(true);
  form.addTextItem()
    .setTitle(T.phone)
    .setRequired(REQUIRE_UPDATES_CONSENT)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('מספר נייד ישראלי, למשל 050-1234567')
      .requireTextMatchesPattern('^(\\+972-?|0)5\\d[- ]?\\d{3}[- ]?\\d{4}$')
      .build());
  form.addTextItem().setTitle(T.city).setRequired(true);
  const areaItem = form.addListItem().setTitle(T.area).setRequired(true);
  form.addCheckboxItem()
    .setTitle(T.consent)
    .setChoiceValues(['קראתי את ההודעה למעלה ואני מאשר/ת להשתתף בהגרלה, ושהשם והשיר שבחרתי יוצגו על המסך בהופעה.'])
    .setRequired(true);
  form.addCheckboxItem()
    .setTitle(T.updates)
    .setChoiceValues(['אני מסכים/ה לקבל מ' + ARTIST + ' הודעות פרסומיות בוואטסאפ וב‑SMS על הופעות באזור שלי. אפשר להסיר את עצמי בכל עת בהודעת "הסר".'])
    .setRequired(REQUIRE_UPDATES_CONSENT);

  // One page per area that has its own WhatsApp group; the area answer leads there, then on to the quiz.
  const areaPages = {};
  const withGroups = AREAS.filter((a) => AREA_GROUPS[a]);
  withGroups.forEach((a) => {
    areaPages[a] = form.addPageBreakItem()
      .setTitle('📍 ' + a)
      .setHelpText('הצטרפו לקבוצת הוואטסאפ של ' + ARTIST + ' באזור ' + a + ':\n' + AREA_GROUPS[a]);
  });
  const quizPage = form.addPageBreakItem()
    .setTitle('🎸 חידון ביטלס')
    .setHelpText('10 שאלות, לא חובה. מי שעונה הכי הרבה תשובות נכונות יופיע בטבלת המובילים על המסך!');
  // A page break's "go to" applies to the page before it: send each area page straight to the quiz.
  withGroups.slice(1).forEach((a) => areaPages[a].setGoToPage(quizPage));
  if (withGroups.length) areaItem.setChoices(AREAS.map((a) => areaItem.createChoice(a, areaPages[a] || quizPage)));
  else areaItem.setChoiceValues(AREAS);

  QUIZ.forEach(({ q, right, wrong }) => {
    const item = form.addMultipleChoiceItem().setTitle(q);
    item.setChoices([right, ...wrong].sort(() => Math.random() - .5).map((c) => item.createChoice(c, c === right)));
    item.setPoints(1);
  });
  form.setIsQuiz(true);

  form.setConfirmationMessage(GROUP_LINK
    ? 'נרשמתם להגרלה! 🎶 תסתכלו על המסך, אולי תזכו לבחור את השיר הבא.\n\nלהצטרפות לקבוצת הוואטסאפ שלנו: ' + GROUP_LINK
    : 'נרשמתם להגרלה! 🎶 תסתכלו על המסך, אולי תזכו לבחור את השיר הבא.');

  const ss = SpreadsheetApp.create('נרשמים – בוחרים שיר – ' + ARTIST);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();
  Utilities.sleep(3000);

  const responses = SpreadsheetApp.openById(ss.getId()).getSheets().find((s) => s.getFormUrl());
  const stage = ss.insertSheet('במה');
  stage.appendRow(['השם שיוצג על המסך', 'השיר שבחרו', 'ניקוד בחידון']);

  const contacts = ss.insertSheet('אנשי קשר');
  contacts.appendRow(CONTACT_HEADERS);
  contacts.getRange('A:A').setNumberFormat('@'); // keep the leading 0 of phone numbers
  contacts.setFrozenRows(1);
  const sortedView = (title, ...sortCols) => {
    const sh = ss.insertSheet(title);
    sh.appendRow(CONTACT_HEADERS);
    sh.setFrozenRows(1);
    sh.getRange('A2').setFormula("=IFERROR(SORT(FILTER('אנשי קשר'!A2:H, 'אנשי קשר'!A2:A<>\"\"), " +
      sortCols.map((c) => c + ', TRUE').join(', ') + '), "")');
  };
  sortedView('לפי אזור ועיר', 4, 3, 2);
  sortedView('לפי מועדון', 5, 4, 3);

  const keep = new Set([responses, stage, contacts].map((s) => s.getSheetId()).concat(
    ['לפי אזור ועיר', 'לפי מועדון'].map((n) => ss.getSheetByName(n).getSheetId())));
  ss.getSheets().filter((s) => !keep.has(s.getSheetId())).forEach((s) => ss.deleteSheet(s));

  PropertiesService.getScriptProperties().setProperty('STAGE_SHEET', ss.getId());
  ScriptApp.newTrigger('onSignup').forForm(form).onFormSubmit().create();

  // __CLUB__ is a placeholder: the show screen replaces it with the venue you type in before each show.
  Logger.log('להדביק במשחק, בשדה "הלינק שהקהל יסרוק": ' +
    form.createResponse().withItemResponse(clubItem.createResponse('__CLUB__')).toPrefilledUrl());
  Logger.log('עריכת הטופס: ' + form.getEditUrl());
  Logger.log('הגיליון: ' + ss.getUrl());
  Logger.log('עכשיו בגיליון: קובץ ← שיתוף ← פרסום באינטרנט ← לשונית "במה" ← CSV ← פרסום, ולהדביק את הלינק במשחק.');
}

// Runs on every sign-up.
function onSignup(e) {
  const a = {};
  e.response.getItemResponses().forEach((r) => { a[r.getItem().getTitle()] = r.getResponse(); });
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('STAGE_SHEET'));

  // 1. The raffle screen: name, song and quiz score only.
  const score = QUIZ.filter(({ q, right }) => a[q] === right).length;
  ss.getSheetByName('במה').appendRow([a[T.name] || '', a[T.song] || '', score]);

  // 2. Contacts: only people who agreed to receive updates, one row per phone number.
  const agreed = Array.isArray(a[T.updates]) && a[T.updates].length > 0;
  const phone = normalizePhone(a[T.phone] || '');
  if (!agreed || !phone) return;
  const sheet = ss.getSheetByName('אנשי קשר');
  const now = new Date();
  const rows = sheet.getDataRange().getValues();
  const i = rows.findIndex((r, idx) => idx > 0 && normalizePhone(String(r[0])) === phone);
  if (i < 0) {
    sheet.appendRow([phone, a[T.name] || '', a[T.city] || '', a[T.area] || '', a[T.club] || '', now, now, a[T.song] || '']);
    return;
  }
  // Already known: refresh their details and add tonight's club and song.
  const row = rows[i];
  const addTo = (list, item) => {
    const items = String(list || '').split(', ').filter(Boolean);
    if (item && !items.includes(item)) items.push(item);
    return items.join(', ');
  };
  sheet.getRange(i + 1, 1, 1, 8).setValues([[
    phone,
    a[T.name] || row[1],
    a[T.city] || row[2],
    a[T.area] || row[3],
    addTo(row[4], a[T.club]),
    row[5],
    now,
    addTo(row[7], a[T.song]),
  ]]);
}

// 050-123 4567, +972 50 1234567 and 0501234567 are the same person.
function normalizePhone(s) {
  let d = String(s).replace(/\D/g, '');
  if (d.startsWith('972')) d = '0' + d.slice(3);
  return /^05\d{8}$/.test(d) ? d : '';
}
