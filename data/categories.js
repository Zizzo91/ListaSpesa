/* ═══════════════════════════════════════════════════════════════════
   Lista Spesa — dizionario categorie (locale, nessuna dipendenza).
   Espone window.SPESA = { categories, colors, normalize, categorize }.

   - categories: ordine di visualizzazione = ordine "reparti" supermercato
   - colors: colore identificativo per categoria
   - categorize(name): riconosce la categoria da parole chiave IT
   - normalize(name): minuscole, senza accenti, spazi singoli
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  const categories = [
    "Frutta e Verdura",
    "Carne e Pesce",
    "Salumi e Formaggi",
    "Latticini e Uova",
    "Pane e Colazione",
    "Pasta, Riso e Cereali",
    "Conserve e Scatolame",
    "Condimenti e Spezie",
    "Snack e Dolci",
    "Bevande",
    "Surgelati",
    "Casa e Pulizia",
    "Igiene e Persona",
    "Bambini e Animali",
    "Altro"
  ];

  const colors = {
    "Frutta e Verdura": "#4ade80",
    "Carne e Pesce": "#f87171",
    "Salumi e Formaggi": "#fbbf24",
    "Latticini e Uova": "#fde047",
    "Pane e Colazione": "#d6a77a",
    "Pasta, Riso e Cereali": "#f59e0b",
    "Conserve e Scatolame": "#fb923c",
    "Condimenti e Spezie": "#a3e635",
    "Snack e Dolci": "#f472b6",
    "Bevande": "#38bdf8",
    "Surgelati": "#67e8f9",
    "Casa e Pulizia": "#818cf8",
    "Igiene e Persona": "#c084fc",
    "Bambini e Animali": "#f0abfc",
    "Altro": "#94a3b8"
  };

  // Parole chiave (singolari + plurali comuni). L'ordine delle categorie
  // conta: in caso di conflitto vince la categoria più in alto (più specifica).
  const keywords = {
    "Frutta e Verdura": [
      "verdura", "verdure", "frutta", "ortaggio", "ortaggi", "insalata", "lattuga",
      "carota", "carote", "finocchio", "finocchi", "sedano", "sedani", "cipolla", "cipolle",
      "cipollotto", "aglio", "spicchio", "patata", "patate", "pomodoro", "pomodori",
      "pomodorino", "pomodorini", "zucchina", "zucchine", "melanzana", "melanzane",
      "peperone", "peperoni", "cetriolo", "cetrioli", "radicchio", "rucola", "spinaci",
      "spinacio", "broccoli", "broccolo", "cavolfiore", "cavolo", "verza", "bietola",
      "bietole", "zucca", "funghi", "fungo", "champignon", "prezzemolo", "basilico",
      "rosmarino", "salvia", "alloro", "menta", "fagiolini", "piselli", "fave", "mais",
      "asparagi", "asparago", "carciofo", "carciofi", "finocchietto", "cime di rapa",
      "mela", "mele", "pera", "pere", "banana", "banane", "arancia", "arance",
      "mandarino", "mandarini", "clementina", "clementine", "mandarancio", "limone", "limoni",
      "pompelmo", "kiwi", "ananas", "uva", "fragola", "fragole", "pesca", "pesche",
      "albicocca", "albicocche", "susina", "susine", "prugna", "prugne", "ciliegia", "ciliegie",
      "melone", "anguria", "cocomero", "kiwano", "mango", "avocado", "melograno",
      "cachi", "fico", "fichi", "nespola", "nespole", "castagna", "castagne", "mirtilli",
      "mirtillo", "lamponi", "lampone", "more", "mora", "ribes", "papaya", "anacardo",
      "sharon", "lime", "zenzero"
    ],
    "Carne e Pesce": [
      "carne", "pollo", "manzo", "vitello", "maiale", "tacchino", "coniglio", "agnello",
      "salsiccia", "salsicce", "hamburger", "bistecca", "bistecche", "fesa", "fette",
      "petto", "coscia", "cosce", "costine", "arrosto", "spezzatino", "filetto",
      "pesce", "salmone", "tonno", "merluzzo", "branzino", "orata", "gamberi", "gamberetti",
      "gambero", "calamari", "calamaro", "seppie", "seppia", "cozze", "vongole", "polpo",
      "sardine", "sardina", "acciughe", "acciuga", "trota", "platessa", "sgombro",
      "baccala", "nasello", "pesce spada", "granchio", "scampi", "moscardini"
    ],
    "Salumi e Formaggi": [
      "salume", "salumi", "prosciutto", "crudo", "cotto", "salame", "mortadella",
      "bresaola", "speck", "pancetta", "guanciale", "coppa", "wurstel", "wuerstel",
      "bologna", "formaggio", "formaggi", "parmigiano", "grana", "mozzarella",
      "ricotta salata", "gorgonzola", "provola", "provole", "fontina", "scamorza",
      "pecorino", "asiago", "stracchino", "philadelphia", "sottiletta", "sottilette",
      "emmental", "brie", "gouda", "taleggio", "sbrinz", "caprino", "caciotta",
      "mozzarella di bufala", "burrata", "provolone", "groviera", "grana padano"
    ],
    "Latticini e Uova": [
      "latte", "latte intero", "latte parzialmente scremato", "latte scremato",
      "burro", "uovo", "uova", "panna", "panna da cucina", "yogurt", "yoghurt",
      "mascarpone", "besciamella", "kefir", "latte di soia", "latte di mandorla",
      "latte di avena", "latte di riso", "latte vegetale", "ricotta", "stracchino"
    ],
    "Pane e Colazione": [
      "pane", "pagnotta", "baguette", "filone", "rosetta", "panino", "panini",
      "brioche", "cornetto", "cornetti", "biscotti", "biscotto", "fette biscottate",
      "marmellata", "confettura", "miele", "nutella", "crema", "crema di nocciole",
      "cereali", "corn flakes", "muesli", "pane in cassetta", "pancarrè", "grissini",
      "grissino", "cracker", "taralli", "pangrattato", "pancake", "waffel", "merendine",
      "plumcake", "crostatine", "frollini", "gallette", "gallette di riso"
    ],
    "Pasta, Riso e Cereali": [
      "pasta", "spaghetti", "spaghetto", "penne", "penna", "rigatoni", "fusilli",
      "farfalle", "tagliatelle", "tagliolini", "bucatini", "sedani", "ditalini",
      "fettuccine", "pappardelle", "orecchiette", "cavatappi", "maccheroni",
      "riso", "risotto", "farina", "semola", "cous cous", "cuscus", "gnocchi",
      "polenta", "orzo", "quinoa", "farro", "lasagne", "lasagna", "tortellini",
      "ravioli", "cappelletti", "tortelloni", "agnolotti", "paste", "pasta fresca"
    ],
    "Conserve e Scatolame": [
      "pelati", "pelato", "pomodori pelati", "pomodoro pelato", "passata", "passata di pomodoro", "tonno in scatola",
      "tonno sottolio", "sgombro in scatola", "mais in scatola", "fagioli", "fagiolo",
      "ceci", "cece", "lenticchie", "lenticchia", "piselli in scatola", "funghi sottolio",
      "olive", "oliva", "capperi", "cappero", "sottaceti", "sottaceto", "salsa",
      "pesto", "ragù", "ragu", "sugo", "brodo", "dado", "dadi", "concentrato",
      "maionese", "ketchup", "senape", "salsa di soia", "aceto balsamico", "giardiniera"
    ],
    "Condimenti e Spezie": [
      "olio", "olio di oliva", "olio extravergine", "aceto", "sale", "sale fino",
      "sale grosso", "pepe", "peperoncino", "origano", "timo", "cannella",
      "noce moscata", "curcuma", "paprica", "paprika", "zafferano", "chiodi di garofano",
      "semi di sesamo", "sesamo", "vaniglia", "vanillina", "lievito", "bicarbonato",
      "ammoniaca per dolci", "fruttosio", "zucchero", "zucchero di canna", "dolcificante",
      "salsa di pomodoro", "aceto di vino", "aceto di mele", "olio di semi"
    ],
    "Snack e Dolci": [
      "patatine", "patatine fritte", "chips", "arachidi", "noccioline", "snack",
      "cioccolato", "cioccolata", "cioccolatini", "caramelle", "caramella", "gomme",
      "gomme da masticare", "gelato", "gelati", "wafer", "torta", "torte", "dolce",
      "dolci", "biscotti al cioccolato", "tavolette", "praline", "popcorn", "pop corn",
      "croccante", "torrone", "panettone", "pandoro", "colomba", "budino", "budini",
      "panna cotta", "tiramisu", "tiramisù", "cornetti surgelati", "brioches"
    ],
    "Bevande": [
      "acqua", "acqua minerale", "acqua naturale", "acqua frizzante", "bibita", "bibite",
      "coca cola", "coca", "fanta", "sprite", "aranciata", "chinotto", "succo",
      "succo di frutta", "nettare", "the", "tè", "te freddo", "the freddo", "caffe",
      "caffè", "cialde", "capsule", "caffe in grani", "birra", "birre", "vino", "vini",
      "spumante", "prosecco", "champagne", "liquore", "amaro", "grappa", "whisky",
      "gin", "vodka", "rum", "energy drink", "red bull", "tonica", "gassosa", "sciroppo"
    ],
    "Surgelati": [
      "surgelato", "surgelati", "congelato", "congelati", "bastoncini", "filetti di pesce",
      "pizza surgelata", "pizze surgelate", "verdure surgelate", "minestrone",
      "minestrone surgelato", "piselli surgelati", "patatine surgelate", "gateau",
      "sofficini", "crocchette surgelate", "spinaci surgelati", "fagiolini surgelati",
      "gamberi surgelati", "filetti surgelati", "gelato confezionato"
    ],
    "Casa e Pulizia": [
      "detersivo", "detersivi", "detergente", "detergenti", "sapone", "saponi",
      "ammorbidente", "candeggina", "varechina", "sgrassatore", "anticalcare",
      "spugna", "spugne", "strofinaccio", "strofinacci", "panno", "panni", "straccio",
      "scopa", "mocio", "paletta", "sacchi", "sacchetti", "sacchetto", "busta",
      "carta igienica", "carta cucina", "scottex", "tovaglioli", "tovagliolo",
      "pellicola", "alluminio", "stagnola", "carta forno", "stuzzicadenti",
      "fiammiferi", "candele", "candela", "lampadine", "lampadina", "pile", "batterie",
      "guanti", "guanto", "deodorante ambiente", "profumatore", "insetticida",
      "zanzare", "scopino", "disincrostante", "brillantante", "pastiglie lavastoviglie",
      "tablet lavastoviglie", "detersivo piatti", "detersivo lavatrice", "ammorbidente",
      "candeggina delicata", "lavapavimenti", "deumidificatore", "sacchetti spazzatura",
      "carta stagnola", "presine", "scovolini"
    ],
    "Igiene e Persona": [
      "shampoo", "balsamo", "docciaschiuma", "bagnoschiuma", "deodorante",
      "dentifricio", "spazzolino", "filo interdentale", "collutorio", "rasoio",
      "lamette", "lametta", "schiuma da barba", "crema", "crema idratante",
      "crema viso", "crema corpo", "cotton fioc", "cotton", "assorbenti", "assorbente",
      "tamponi", "salviette", "salvietta", "fazzoletti", "fazzoletto", "forbici",
      "tagliaunghie", "spazzola", "pettine", "gel", "lacca", "profumo", "acqua di colonia",
      "struccante", "dischetti struccanti", "sapone intimo", "sapone liquido",
      "bagnodoccia", "olio corpo", "lozione", "deodorante spray", "rasoi", "spugna bagno",
      "cerotti", "cotton fioc", "termometro", "integratori", "vitamine"
    ],
    "Bambini e Animali": [
      "pannolini", "pannolino", "omogeneizzato", "omogeneizzati", "latte in polvere",
      "crema cambio", "ciuccio", "biberon", "tettarelle", "crocchette", "crocchette cane",
      "crocchette gatto", "cibo per cani", "cibo per gatti", "scatolette cane",
      "scatolette gatto", "lettiera", "sabbietta", "guinzaglio", "giochi per animali",
      "snack cane", "snack gatto", "salviette neonato", "pastiglie cane"
    ]
  };

  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")   // accenti
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  // Prima occorrenza per categoria vince (ordine categories).
  const SINGLE = {};
  const PHRASES = [];
  for (const cat of categories) {
    for (const kw of (keywords[cat] || [])) {
      const k = normalize(kw);
      if (!k) continue;
      if (k.includes(" ")) {
        PHRASES.push({ kw: " " + k + " ", cat: cat, len: k.length });
      } else if (!(k in SINGLE)) {
        SINGLE[k] = cat;
      }
    }
  }
  PHRASES.sort((a, b) => b.len - a.len);

  function stem(word) {
    if (word.length > 4 && /[aeio]$/.test(word)) return word.slice(0, -1);
    return word;
  }
  const SINGLE_STEM = {};
  for (const k in SINGLE) {
    const s = stem(k);
    if (!(s in SINGLE_STEM)) SINGLE_STEM[s] = SINGLE[k];
  }

  function categorize(rawName) {
    const s = normalize(rawName);
    if (!s) return "Altro";
    const padded = " " + s + " ";

    for (const p of PHRASES) {
      if (padded.includes(p.kw)) return p.cat;
    }

    const tokens = s.split(" ").filter(Boolean);
    for (const t of tokens) {
      if (t in SINGLE) return SINGLE[t];
    }
    for (const t of tokens) {
      const st = stem(t);
      if (st in SINGLE_STEM) return SINGLE_STEM[st];
    }
    return "Altro";
  }

  window.SPESA = { categories, colors, normalize, categorize };
})();
