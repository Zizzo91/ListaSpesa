# Lista Spesa — Web App (PWA, mobile-first)

Lista della spesa condivisa: aggiungi prodotti, **spunta** quelli acquistati,
**categorizzazione automatica** con raggruppamento per reparto, **sync realtime**
tra dispositivi su Supabase (schema dedicato `spesa`). Nessun login: l'accesso
è tramite **link condiviso** (id stanza casuale nell'URL).

## Avvio / test
- Locale: `./start.local.command` → http://localhost:8756
- GitHub Pages: pubblica questa cartella come repo (branch `main`, root)
- iPhone: apri il link → Condividi → "Aggiungi a Home Screen" (PWA installabile)

## Struttura
```
Lista Spesa/
├── index.html                 → SPA single-file (vanilla JS, dark)
├── config/supabase-config.js  → URL + anon key progetto gfglazxhxxplhoteaahr, schema `spesa`
├── data/categories.js         → 15 categorie ordinate + dizionario keyword IT + categorizzatore
├── db/001_spesa_schema.sql    → schema Supabase (`items`, `catalog`, RLS, trigger)
├── manifest.webmanifest, sw.js
├── icon-192/512.png, apple-touch-icon.png, favicon.png
└── start.local.command
```

## Setup Supabase (una tantum)
1. Dashboard → **SQL Editor** → incolla e lancia `db/001_spesa_schema.sql`.
2. Esponi lo schema in modo **additivo**:
   `ALTER ROLE authenticator SET pgrst.db_schemas='public, graphql_public, storybook, soundtube, spesa';`
   `notify pgrst, 'reload config';` — oppure Settings → API → Exposed schemas → aggiungi `spesa`.
3. Abilita Realtime: `alter publication supabase_realtime add table spesa.items;`
   (o Dashboard → Database → Replication).
4. Deploy GitHub Pages.

## Modello di sicurezza (nessun login)
L'accesso è **capability-based**: il segreto è il `room_id` (UUID 128-bit) nel link
`...#r=<uuid>`, mai nel repo. La anon key è pubblica. Non è cifratura: adatto a uso
personale a basso rischio. Per più sicurezza si può aggiungere un PIN senza cambiare schema.

## Funzionalità
- **Aggiunta rapida**: campo in basso con quantità/unità opzionale (`2 kg mele`).
- **Categorizzazione automatica**: dizionario locale IT (singolari/plurali) →
  in alternativa la categoria **appresa** (salvata in `spesa.catalog` e sincronizzata).
- **Raggruppamento per reparto**: gli articoli della stessa categoria finiscono
  vicini anche se inseriti in ordine sparso (es. carote/finocchi; frutta e verdura insieme).
- **Duplicati**: se l'articolo è già presente l'app avvisa con tre azioni —
  *Aggiungi comunque* (**incrementa la quantità**), *Vai all'articolo* (scroll+flash), *Annulla*.
- **Spunta** gli acquistati (finiscono nella sezione collassabile "Comprati").
- Modifica nome/quantità, cambia categoria (apprende), elimina.
- **Condivisione**: "Condividi / copia link" nelle Azioni; "Unisciti a un link" per entrare in una lista.
- **Offline-first**: cache `localStorage` + outbox; sync quando torna la rete.

## Note tecniche
- Client Supabase creato con `db: { schema: 'spesa' }`.
- Realtime: canale `postgres_changes` su `spesa.items` filtrato `room_id=eq.<uuid>`.
- Lo schema `spesa` è isolato: `public`, `storybook`, `soundtube` non vengono toccati.
- Nessun segreto nel repo: solo anon key pubblica. Aggiornamenti: bump `SW_VERSION` in `sw.js`.
