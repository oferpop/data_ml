/**
 * Public sign-up page for the show, hosted on Google Apps Script.
 * Anyone with the link can sign up from any phone, with no account and no login.
 * Sign-ups land in your Google Sheet:
 *   - "נרשמים": everything each person filled in,
 *   - "במה": name + song + quiz score only (what the show screen reads; no phones),
 *   - "אנשי קשר": people who agreed to updates, one row per phone, remembered across shows,
 *     with sorted views "לפי אזור ועיר" and "לפי מועדון".
 *
 * Setup (once, on a computer):
 *   1. script.google.com → New project. Paste this file into Code.gs.
 *   2. File "+" → HTML → name it  join  → paste join.html into it.
 *   3. Fill in the settings below, save, and Run "setup" (approve access when Google asks).
 *   4. Deploy → New deployment → type: Web app → Execute as: Me → Who has access: Anyone → Deploy.
 *   5. Run "links" and copy the link from the execution log into the show screen.
 */

// ---------- Settings ----------
const ARTIST = 'שם הלהקה';                       // shown on the page and in the consent texts
const CONTACT = 'טלפון או מייל ליצירת קשר';      // for removal and privacy requests
const GROUP_LINK = '';                           // optional: WhatsApp group link shown after signing up

const AREAS = ['צפון', 'חיפה והקריות', 'שרון', 'מרכז / גוש דן', 'ירושלים והסביבה', 'שפלה', 'דרום', 'אילת והערבה'];

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

const CONTACT_HEADERS = ['טלפון', 'שם', 'עיר', 'אזור', 'מועדונים', 'נרשמו לראשונה', 'עודכן לאחרונה', 'שירים שביקשו'];

// Creates the spreadsheet and its tabs. Run once.
function setup() {
  const ss = SpreadsheetApp.create('נרשמים – ערב ביטלס – ' + ARTIST);
  const all = ss.getSheets()[0].setName('נרשמים');
  all.appendRow(['זמן', 'שם', 'שיר', 'טלפון', 'עיר', 'אזור', 'הופעה', 'מאשר/ת עדכונים', 'ניקוד בחידון']);
  all.getRange('D:D').setNumberFormat('@'); // keep the leading 0 of phone numbers
  all.setFrozenRows(1);
  ss.insertSheet('במה').appendRow(['השם שיוצג על המסך', 'השיר שבחרו', 'ניקוד בחידון']);
  const contacts = ss.insertSheet('אנשי קשר');
  contacts.appendRow(CONTACT_HEADERS);
  contacts.getRange('A:A').setNumberFormat('@');
  contacts.setFrozenRows(1);
  sortedView(ss, 'לפי אזור ועיר', 4, 3, 2);
  sortedView(ss, 'לפי מועדון', 5, 4, 3);
  PropertiesService.getScriptProperties().setProperty('SHEET', ss.getId());
  Logger.log('הגיליון נוצר: ' + ss.getUrl());
  Logger.log('עכשיו: Deploy ← New deployment ← Web app ← Execute as: Me ← Who has access: Anyone ← Deploy. ואז להריץ את links.');
}

function sortedView(ss, title, ...sortCols) {
  const sh = ss.insertSheet(title);
  sh.appendRow(CONTACT_HEADERS);
  sh.setFrozenRows(1);
  sh.getRange('A2').setFormula("=IFERROR(SORT(FILTER('אנשי קשר'!A2:H, 'אנשי קשר'!A2:A<>\"\"), " +
    sortCols.map((c) => c + ', TRUE').join(', ') + '), "")');
}

// Prints the links to use, after the web app is deployed.
function links() {
  const url = ScriptApp.getService().getUrl();
  if (!url) { Logger.log('עוד לא פורסם. Deploy ← New deployment ← Web app ← Who has access: Anyone.'); return; }
  Logger.log('להדביק במשחק, בשדה "הלינק שהקהל יסרוק": ' + url + '?venue=__CLUB__');
  Logger.log('לינק כללי לשליחה בוואטסאפ: ' + url);
  Logger.log('הגיליון: ' + SpreadsheetApp.openById(sheetId()).getUrl());
}

function sheetId() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET');
  if (!id) throw new Error('קודם צריך להריץ את setup');
  return id;
}

// The page itself. ?venue=... comes from the show screen's link for tonight.
function doGet(e) {
  const t = HtmlService.createTemplateFromFile('join');
  const venue = String((e && e.parameter && e.parameter.venue) || '').slice(0, 60);
  const safeJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
  t.data = safeJson({
    artist: ARTIST, contact: CONTACT, group: GROUP_LINK, venue, areas: AREAS, songs: SONGS,
    // The page never gets the right answers; the score is worked out here.
    quiz: QUIZ.map(({ q, right, wrong }) => ({ q, choices: shuffle([right, ...wrong]) })),
  });
  return t.evaluate()
    .setTitle('ערב ביטלס · הרשמה')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Called by the page when someone signs up. Returns their quiz score.
function register(f) {
  const text = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
  const name = text(f.name, 30), song = text(f.song, 80), city = text(f.city, 40), area = text(f.area, 40), venue = text(f.venue, 60);
  if (!name || !SONGS.includes(song) || !city || !AREAS.includes(area) || f.consent !== true) throw new Error('missing');
  const updates = f.updates === true;
  const phone = normalizePhone(f.phone);
  if (updates && !phone) throw new Error('phone');
  const answers = Array.isArray(f.answers) ? f.answers : [];
  const score = QUIZ.filter((q, i) => answers[i] === q.right).length;

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const ss = SpreadsheetApp.openById(sheetId());
    const now = new Date();
    ss.getSheetByName('נרשמים').appendRow([now, safe(name), safe(song), phone, safe(city), safe(area), safe(venue), updates ? 'כן' : 'לא', score]);
    ss.getSheetByName('במה').appendRow([safe(name), safe(song), score]);
    if (updates) saveContact(ss, { phone, name, city, area, venue, song, now });
  } finally {
    lock.releaseLock();
  }
  return score;
}

// One row per phone number: a returning fan gets tonight's venue and song added.
function saveContact(ss, c) {
  const sheet = ss.getSheetByName('אנשי קשר');
  const rows = sheet.getDataRange().getValues();
  const i = rows.findIndex((r, idx) => idx > 0 && normalizePhone(r[0]) === c.phone);
  if (i < 0) {
    sheet.appendRow([c.phone, safe(c.name), safe(c.city), safe(c.area), safe(c.venue), c.now, c.now, safe(c.song)]);
    return;
  }
  const row = rows[i];
  const addTo = (list, item) => {
    const items = String(list || '').split(', ').filter(Boolean);
    if (item && !items.includes(item)) items.push(item);
    return items.join(', ');
  };
  sheet.getRange(i + 1, 1, 1, 8).setValues([[
    c.phone, safe(c.name), safe(c.city), safe(c.area), safe(addTo(row[4], c.venue)), row[5], c.now, safe(addTo(row[7], c.song)),
  ]]);
}

// Text typed by the public must never run as a spreadsheet formula.
function safe(v) {
  const s = String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// 050-123 4567, +972 50 1234567 and 0501234567 are the same person.
function normalizePhone(s) {
  let d = String(s == null ? '' : s).replace(/\D/g, '');
  if (d.startsWith('972')) d = '0' + d.slice(3);
  return /^05\d{8}$/.test(d) ? d : '';
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
