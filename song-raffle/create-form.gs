/**
 * Creates the sign-up form for the song raffle, its responses spreadsheet,
 * and a "במה" tab holding only name + song (that tab is what the raffle reads;
 * phone numbers stay in the private responses tab).
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

  form.setConfirmationMessage(GROUP_LINK
    ? 'נרשמתם להגרלה! 🎶 תסתכלו על המסך, אולי תזכו לבחור את השיר הבא.\n\nלהצטרפות לקבוצת הוואטסאפ שלנו: ' + GROUP_LINK
    : 'נרשמתם להגרלה! 🎶 תסתכלו על המסך, אולי תזכו לבחור את השיר הבא.');

  const ss = SpreadsheetApp.create('נרשמים – בוחרים שיר – ' + ARTIST);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();
  Utilities.sleep(3000);

  const responses = SpreadsheetApp.openById(ss.getId()).getSheets().find((s) => s.getFormUrl());
  const stage = ss.insertSheet('במה');
  stage.getRange('A1').setFormula(
    "=QUERY('" + responses.getName() + "'!A:C, \"select B, C where B is not null\", 1)");
  ss.getSheets()
    .filter((s) => s.getSheetId() !== responses.getSheetId() && s.getSheetId() !== stage.getSheetId())
    .forEach((s) => ss.deleteSheet(s));

  Logger.log('לינק לקהל (ל‑QR): ' + form.shortenFormUrl(form.getPublishedUrl()));
  Logger.log('עריכת הטופס: ' + form.getEditUrl());
  Logger.log('הגיליון: ' + ss.getUrl());
  Logger.log('עכשיו בגיליון: קובץ ← שיתוף ← פרסום באינטרנט ← לשונית "במה" ← CSV ← פרסום, ולהדביק את הלינק במשחק.');
}
