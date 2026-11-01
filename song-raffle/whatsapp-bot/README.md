# בוט ההרשמה בוואטסאפ

מי שכותב למספר הוואטסאפ של הלהקה מדבר עם Claude: הוא שואל שם, שיר ביטלס, עיר ואזור, מבקש אישור השתתפות ושואל אם רוצים עדכונים. כשהכול מוכן ההרשמה נכנסת לגיליון הגוגל (אותו גיליון של דף ההרשמה), והשם עולה להגרלות במשחק.

```
וואטסאפ → Twilio → Cloudflare Worker (הבוט, Claude) → Google Apps Script → גיליון גוגל
                         ↑ התשובה חוזרת דרך Twilio
```

## מה צריך
- חשבון **Twilio** (מספר וואטסאפ), חשבון **Cloudflare** (חינמי), ומפתח API של **Anthropic** (console.anthropic.com).
- דף ההרשמה (`../signup-app`) כבר מותקן בגיליון ופורסם כ‑Web app.

## הגדרה
1. **הגיליון:** בעורך ה‑Apps Script של הגיליון מדביקים את `Code.gs` המעודכן, מריצים `makeBotSecret` ומעתיקים את הסוד מהיומן. אחרי שינוי בקוד: פריסה ← ניהול פריסות ← עריכה ← גרסה חדשה.
2. **Cloudflare:** בתיקייה הזו:
   ```bash
   npm install
   npx wrangler login
   npx wrangler kv namespace create CONVERSATIONS   # מדביקים את ה‑id ב‑wrangler.toml
   npx wrangler secret put ANTHROPIC_API_KEY
   npx wrangler secret put TWILIO_ACCOUNT_SID
   npx wrangler secret put TWILIO_AUTH_TOKEN
   npx wrangler secret put SHEET_URL       # הלינק של ה‑Web app (…/exec)
   npx wrangler secret put SHEET_SECRET    # הסוד מ‑makeBotSecret
   npm run deploy                          # מדפיס את הכתובת של הבוט
   ```
   ב‑`wrangler.toml` משנים את `ARTIST` לשם הלהקה, ולפני כל הופעה אפשר לעדכן את `VENUE` ולהריץ `npm run deploy`.
3. **Twilio:** Messaging ← Try it out ← Send a WhatsApp message ← Sandbox settings. בשדה **When a message comes in** מדביקים את כתובת הבוט, שיטה **POST**, ושומרים.

## בדיקה (Sandbox)
ב‑Sandbox של Twilio כל מי שבודק שולח קודם למספר של Twilio את המילים `join <מילה>` שמופיעות במסך ה‑Sandbox, ורק אחר כך כותב „היי”. לקהל אמיתי צריך מספר וואטסאפ משלכם ב‑Twilio (WhatsApp Sender), שעובר אישור של Meta.

## חשוב לדעת
- `התחלה מחדש` מאפס את השיחה.
- כל הודעה היא קריאה אחת ל‑Claude (`claude-opus-5-5`, effort נמוך), בערך סנט אחד להודעה. החלפה למודל זול יותר היא שינוי של שורה אחת ב‑`src/index.ts`.
- הבוט מאמת שכל בקשה באמת הגיעה מ‑Twilio (חתימה), והגיליון מקבל רק בקשות עם הסוד.
- `server-side fallback` מופעל: אם Claude מסרב לבקשה, היא עוברת אוטומטית למודל אחר.
