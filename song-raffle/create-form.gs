/**
 * Creates the sign-up form for the show (consent, name, song, and a 10-question
 * Beatles quiz answered on the phone), its responses spreadsheet, and a "במה" tab
 * that gets name + song + quiz score on every submission. The raffle reads only
 * that tab; phone numbers stay in the private responses tab.
 *
 * How to run: script.google.com → New project → paste this file → fill in the
 * settings below → Run "createSongRaffleForm" → approve access → copy the links
 * from the execution log.
 */

// ---------- Settings ----------
const ARTIST = 'שם הלהקה / האמן';                 // shown in the consent texts
const CONTACT = 'טלפון או מייל ליצירת קשר';         // for removal and privacy requests
const GROUP_LINK = '';                              // optional: https://chat.whatsapp.com/...
// false = the updates consent is a separate, optional box (recommended).
// true  = signing up for the raffle requires agreeing to receive updates.
const REQUIRE_UPDATES_CONSENT = false;

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

const AREAS = ['צפון', 'חיפה והקריות', 'שרון', 'מרכז / גוש דן', 'ירושלים והסביבה', 'שפלה', 'דרום', 'אילת והערבה'];

function createSongRaffleForm() {
  const form = FormApp.create('🎤 בוחרים שיר בהופעה – ' + ARTIST);
  form.setDescription([
    'נרשמים, בוחרים שיר של הביטלס, ובמהלך ההופעה נגריל מי בוחר את השיר הבא! השיר הכי מבוקש ייסגר את הערב.',
    '',
    'הודעה על איסוף מידע: את הפרטים בטופס אוסף ' + ARTIST + ' (' + CONTACT + ').',
    'השם והשיר משמשים להגרלה ויוצגו על המסך בהופעה. הטלפון והאזור ישמשו רק לשליחת עדכונים על הופעות, ורק אם תסמנו את האישור לכך.',
    'אינכם חייבים למסור את הפרטים, אבל בלי שם ושיר אי אפשר להשתתף בהגרלה.',
    'הפרטים נשמרים בחשבון Google של ' + ARTIST + ', לא יועברו לאחרים, ואפשר לבקש לעיין בהם, לתקן או למחוק אותם בכל עת דרך ' + CONTACT + '.',
  ].join('\n'));
  form.setCollectEmail(false);

  form.addTextItem().setTitle('השם שיוצג על המסך').setRequired(true);
  form.addListItem().setTitle('איזה שיר של הביטלס הייתם רוצים לבחור?').setChoiceValues(SONGS).setRequired(true);
  form.addTextItem()
    .setTitle('טלפון נייד (לעדכונים בוואטסאפ)')
    .setRequired(REQUIRE_UPDATES_CONSENT)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('מספר נייד ישראלי, למשל 050-1234567')
      .requireTextMatchesPattern('^(\\+972-?|0)5\\d[- ]?\\d{3}[- ]?\\d{4}$')
      .build());
  form.addListItem().setTitle('באיזה אזור אתם גרים?').setChoiceValues(AREAS).setRequired(true);
  form.addCheckboxItem()
    .setTitle('אישור השתתפות')
    .setChoiceValues(['קראתי את ההודעה למעלה ואני מאשר/ת להשתתף בהגרלה, ושהשם והשיר שבחרתי יוצגו על המסך בהופעה.'])
    .setRequired(true);
  form.addCheckboxItem()
    .setTitle('עדכונים על הופעות באזור שלי')
    .setChoiceValues(['אני מסכים/ה לקבל מ' + ARTIST + ' הודעות פרסומיות בוואטסאפ וב‑SMS על הופעות באזור שלי. אפשר להסיר את עצמי בכל עת בהודעת "הסר".'])
    .setRequired(REQUIRE_UPDATES_CONSENT);

  form.addPageBreakItem()
    .setTitle('🎸 חידון ביטלס')
    .setHelpText('10 שאלות, לא חובה. מי שעונה הכי הרבה תשובות נכונות יופיע בטבלת המובילים על המסך!');
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
  PropertiesService.getScriptProperties().setProperty('STAGE_SHEET', ss.getId());
  ScriptApp.newTrigger('onSignup').forForm(form).onFormSubmit().create();
  ss.getSheets()
    .filter((s) => s.getSheetId() !== responses.getSheetId() && s.getSheetId() !== stage.getSheetId())
    .forEach((s) => ss.deleteSheet(s));

  Logger.log('לינק לקהל (ל‑QR): ' + form.shortenFormUrl(form.getPublishedUrl()));
  Logger.log('עריכת הטופס: ' + form.getEditUrl());
  Logger.log('הגיליון: ' + ss.getUrl());
  Logger.log('עכשיו בגיליון: קובץ ← שיתוף ← פרסום באינטרנט ← לשונית "במה" ← CSV ← פרסום, ולהדביק את הלינק במשחק.');
}

// Runs on every sign-up: adds name, song and quiz score to the "במה" tab (never the phone number).
function onSignup(e) {
  const answers = {};
  e.response.getItemResponses().forEach((r) => { answers[r.getItem().getTitle()] = r.getResponse(); });
  const score = QUIZ.filter(({ q, right }) => answers[q] === right).length;
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('STAGE_SHEET'));
  ss.getSheetByName('במה').appendRow([
    answers['השם שיוצג על המסך'] || '',
    answers['איזה שיר של הביטלס הייתם רוצים לבחור?'] || '',
    score,
  ]);
}
