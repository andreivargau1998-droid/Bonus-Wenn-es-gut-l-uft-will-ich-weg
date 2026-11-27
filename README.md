# Landing bonus: "Wenn es gut läuft, will ich weg"

Pagina che raccoglie Nome, Cognome ed Email e **solo dopo** l'invio riuscito mostra il link del bonus (la cartella Drive con il PDF).
I lead finiscono nel tuo foglio Google, scheda **"Lead"** (non la prima scheda che si apre: guarda in basso, cerca la linguetta "Lead").

## 1. Google Sheet + Apps Script (5 minuti)
1. Apri il tuo foglio: https://docs.google.com/spreadsheets/d/1XjK4E0A0voVcsN-h2HI6u0PSA69j1LuN6CF_z5Z1wfs/edit
2. Menu **Estensioni → Apps Script**.
3. Cancella tutto il codice che c'è e incolla il contenuto di `apps-script/Code.gs`, poi sostituisci `INSERISCI_QUI_LA_TUA_PASSWORD_SEGRETA` con la tua password segreta (la stessa che metti su Vercel in `APPS_SCRIPT_SECRET`). Il repository è pubblico: non salvare mai la password vera nei file del repo.
4. Clicca **Esegui il deployment → Nuovo deployment** → ingranaggio → **Applicazione web**.
   - Esegui come: **Me**
   - Chi può accedere: **Chiunque**
5. **Esegui il deployment** → **Autorizza l'accesso** → scegli il tuo account.
   Se compare "Google non ha verificato questa app" è normale (è il tuo script): **Avanzate → Vai al progetto (non sicuro) → Consenti**.
6. Copia l'URL che finisce con `/exec`. Ti serve al punto 3.

## 2. GitHub
1. Su github.com crea un repository nuovo (privato va bene).
2. **Add file → Upload files** e trascina TUTTO il contenuto di questa cartella (anche `.gitignore` e `.env.example`; la cartella `api` e `apps-script` devono restare cartelle). Conferma con **Commit**.

## 3. Vercel
1. Su vercel.com: **Add New → Project** → importa il repository.
2. **Prima di cliccare Deploy**, apri "Environment Variables" e aggiungi (i valori sono in `.env.example`):
   - `GOOGLE_SCRIPT_URL` = l'URL `/exec` del punto 1
   - `APPS_SCRIPT_SECRET` = la tua password segreta (la stessa di `Code.gs` in Apps Script)
   - `BONUS_DRIVE_URL` = il link Drive già scritto in `.env.example`
3. **Deploy**. Se aggiungi o cambi le variabili dopo un deploy già fatto, devi fare **Redeploy** (Deployments → ⋯ → Redeploy), altrimenti la funzione non le legge.

## 4. Prova
1. Apri l'indirizzo che ti dà Vercel e inserisci dati di prova (e il consenso).
2. Il link del bonus deve comparire solo dopo l'invio.
3. Nel foglio, scheda **Lead**, deve esserci la riga. Se non c'è, su Vercel apri **Logs → Runtime Logs** (non i log di build) per vedere l'errore.

## Se modifichi Code.gs in futuro
Apps Script → Esegui il deployment → **Gestisci deployment** → matita → **Nuova versione** → Esegui il deployment. Non fare "Nuovo deployment": cambierebbe l'URL `/exec`.

## Da fare prima di pubblicizzare la pagina
In Germania servono **Impressum** e **Datenschutzerklärung** raggiungibili dalla pagina: in `index.html` i due link in fondo sono segnaposto (`href="#"`), sostituiscili con le tue pagine.
