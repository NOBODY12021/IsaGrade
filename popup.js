const selectA = document.getElementById('selectA');
const selectB = document.getElementById('selectB');
const langSelect = document.getElementById('langSelect');
const darkModeToggle = document.getElementById('darkModeToggle');

const popupUiStrings = {
    de: {
        title: "Verlauf anpassen", left: "Farbe Links:", right: "Farbe Rechts:",
        colors: {
            "#800080": "Klassisch Lila", "#dc2626": "Karmesinrot", "#065f46": "Smaragdgrün", "#1e3a8a": "Tiefblau",
            "#b91c1c": "Rubinrot", "#4b5563": "Schiefergrau", "#0f172a": "Mitternachtsblau", "#1e1b4b": "Kosmisches Indigo",
            "#581c87": "Dunkles Violett", "#701a75": "Beerenpurpur", "#ea580c": "Sonniges Orange", "#ca8a04": "Senfgelb",
            "#be185d": "Magenta", "#9a3412": "Terrakotta", "#0d9488": "Ozeantürkis", "#2563eb": "Königsblau",
            "#16a34a": "Saftiges Grün", "#4f46e5": "Indigoblau", "#ffffff": "Weiss", "#000000": "Schwarz"
        }
    },
    fr: {
        title: "Ajuster le dégradé", left: "Couleur gauche:", right: "Couleur droite:",
        colors: {
            "#800080": "Violet classique", "#dc2626": "Rouge cramoisi", "#065f46": "Vert émeraude", "#1e3a8a": "Bleu profond",
            "#b91c1c": "Rouge rubis", "#4b5563": "Gris ardoise", "#0f172a": "Bleu minuit", "#1e1b4b": "Indigo cosmique",
            "#581c87": "Violet foncé", "#701a75": "Pourpre baie", "#ea580c": "Orange ensoleillé", "#ca8a04": "Jaune moutarde",
            "#be185d": "Magenta", "#9a3412": "Terre cuite", "#0d9488": "Turquoise océan", "#2563eb": "Bleu royal",
            "#16a34a": "Vert juteux", "#4f46e5": "Bleu indigo", "#ffffff": "Blanc", "#000000": "Noir"
        }
    },
    it: {
        title: "Ajusta sfumatura", left: "Colore sinistro:", right: "Colore destro:",
        colors: {
            "#800080": "Viola classico", "#dc2626": "Rosso cremisi", "#065f46": "Verde smeraldo", "#1e3a8a": "Blu profondo",
            "#b91c1c": "Rosso rubino", "#4b5563": "Grigio ardesia", "#0f172a": "Blu notte", "#1e1b4b": "Indigo cosmico",
            "#581c87": "Violetto scuro", "#701a75": "Porpora di bosco", "#ea580c": "Arancione solare", "#ca8a04": "Giallo senape",
            "#be185d": "Magenta", "#9a3412": "Terracotta", "#0d9488": "Turchese oceano", "#2563eb": "Blu reale",
            "#16a34a": "Verde succoso", "#4f46e5": "Blu indaco", "#ffffff": "Bianco", "#000000": "Nero"
        }
    },
    en: {
        title: "Adjust Gradient", left: "Left Color:", right: "Right Color:",
        colors: {
            "#800080": "Classic Purple", "#dc2626": "Crimson Red", "#065f46": "Emerald Green", "#1e3a8a": "Deep Blue",
            "#b91c1c": "Ruby Red", "#4b5563": "Slate Gray", "#0f172a": "Midnight Blue", "#1e1b4b": "Cosmic Indigo",
            "#581c87": "Dark Violet", "#701a75": "Berry Purple", "#ea580c": "Sunny Orange", "#ca8a04": "Mustard Yellow",
            "#be185d": "Magenta", "#9a3412": "Terracotta", "#0d9488": "Ocean Turquoise", "#2563eb": "Royal Blue",
            "#16a34a": "Juicy Green", "#4f46e5": "Indigo Blue", "#ffffff": "White", "#000000": "Black"
        }
    }
};

browser.storage.local.get(['colorA', 'colorB', 'lang', 'darkMode']).then((saved) => {
    if (saved.colorA) selectA.value = saved.colorA;
    if (saved.colorB) selectB.value = saved.colorB;
    if (saved.lang) langSelect.value = saved.lang;
    updateExtension();
});


function updateExtension() {
    const colorA = selectA.value;
    const colorB = selectB.value;
    const lang = langSelect.value;

    browser.storage.local.set({
        colorA: colorA,
        colorB: colorB,
        lang: lang,
    });

    document.getElementById('titleGradient').textContent = popupUiStrings[lang].title;
    document.getElementById('labelLeft').textContent = popupUiStrings[lang].left;
    document.getElementById('labelRight').textContent = popupUiStrings[lang].right;

    [selectA, selectB].forEach(select => {
        Array.from(select.options).forEach(option => {
            const hex = option.value;
            if (popupUiStrings[lang].colors[hex]) {
                option.textContent = popupUiStrings[lang].colors[hex];
            }
        });
    });

    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs && tabs[0] && tabs[0].id) {
            browser.tabs.sendMessage(tabs[0].id, {
                action: "updateSettings",
                colorA: colorA,
                colorB: colorB,
                lang: lang,
            });
        }
    }).catch(err => console.error("Error:", err));
}

langSelect.addEventListener('change', updateExtension);
selectA.addEventListener('change', updateExtension);
selectB.addEventListener('change', updateExtension);
darkModeToggle.addEventListener('change', updateExtension);