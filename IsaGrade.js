function waitfortable(callback) {
    function tryfind() {
    const table = document.querySelector('table')
    if (!table) return null;
    
    const rows = table.rows;
    const foundClasses = [];

    for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].cells[3];
        const firstCell = rows[i].cells[0];
        
        if (cell && firstCell) {
            const text = cell.textContent.trim();
            const firstText = firstCell.textContent.trim();

            if (text.includes('(') && text.includes(')') && firstText.length < 60 && /\(\d/.test(text)) {
                foundClasses.push(i);
            }
        }
    }
    return foundClasses.length > 0 ? foundClasses : null;
}


    const found = tryfind();
    if (found !== null) {
        found.forEach(row => {
            try {
                callback(row);
            } catch (err) {
                console.error('Fehler bei Klassen-Zeile', row, err);
            }
        });
    }

    const observer = new MutationObserver(() => {
        const result = tryfind()
        if (result !== null) {
            observer.disconnect();
            result.forEach(row => {
            try {
                callback(row);
            } catch (err) {
                console.error('Fehler bei Klassen-Zeile', row, err);
            }
        });
        }
    });     

    observer.observe(document.body, {childList: true, subtree: true});
}

waitfortable((WhatClassRow) => {
    const table = document.querySelector('table');
    const rows = table.rows;

    const ClassRow = rows[WhatClassRow]
    const AverageRow = rows[WhatClassRow + 1]

    if (!ClassRow || !AverageRow) return;
    
    const Class = ClassRow.cells[0].textContent.trim();
    const AverageText = AverageRow.cells[3].textContent.trim();
    const Average = parseFloat(AverageText);

    if (isNaN(Average)) return;

    function getRoundUp(value) {
        const roundedNow = Math.round(value * 2) / 2;
        const nextRoundUp = roundedNow + 0.25;
        return nextRoundUp;
    }

    function getRoundDown(value) {
        const roundedNow = Math.round(value * 2) / 2;
        const nextRoundDown = roundedNow - 0.25;
        return nextRoundDown;
    }

    function getTotalCoEff() {
        let total = 0;

        for (let i = WhatClassRow; i < rows.length; i++) {
            const GradeRow = rows[i + 2];
            if (!GradeRow) break;
            const CoEffCell = GradeRow.cells[1];
            const GradeCell = GradeRow.cells[3];

            const CoEffText = CoEffCell.textContent.trim();
            const GradeText = GradeCell.textContent.trim();

            if (CoEffText === '' || GradeText === '') continue;

            if (GradeText.includes('(') && GradeText.includes(')')) {
                break;
            }

            const CoEffValue = parseFloat(CoEffText)
            total += CoEffValue
        }
        return total;
    }

    function getTotalSubtract() {
        let total = 0;

        for (let i = WhatClassRow; i < rows.length; i++) {
            const GradeRow = rows[i + 2];
            if (!GradeRow) break;

            const CoEffCell = GradeRow.cells[1];
            const GradeCell = GradeRow.cells[3];

            const CoEffText = CoEffCell.textContent.trim();
            const GradeText = GradeCell.textContent.trim();



            if (CoEffText === '' || GradeText === '') continue;


            if (GradeText.includes('(') && GradeText.includes(')')) {
                break;
            }

            const CoEffxGrade = parseFloat(CoEffText) * parseFloat(GradeText);
            total += CoEffxGrade
        }
        return total;
    }

    let CoEffX = 1;
    let currentColorA = 'purple';
    let currentColorB = 'blue';

    function getNeededForUp() {
        const GradeNeededForUp = (getRoundUp(Average) * (getTotalCoEff() + CoEffX) - getTotalSubtract()) / CoEffX
        return GradeNeededForUp.toFixed(2);
    }

    function getNeededForDown() {
        const GradeNeededForUp = (getRoundDown(Average) * (getTotalCoEff() + CoEffX) - getTotalSubtract()) / CoEffX
        return GradeNeededForUp.toFixed(2);
    }

    const translations = {
        de: {
            coeff: "Koeff:",
            upText: "um 0.5 zu heben",
            downText: "zu behalten",
            tooltip: "Du brauchst eine {value}, um deinen Durchschnitt {direction}. {phrase}",
            motivation: [
                "Das schaffst du!", 
                "Lets Goooo, das kannst du", 
                "Das hast du Ezz", "Lock in!", 
                "Lock tf in", 
                "Das schaffst du safe."
            ],
            impossibleUp: [
                "Das ist nicht ganz möglich.",
                "Eine Einzelne Prüfung reicht nicht um ihn zu heben.",
                "Damn.",
                "Ich hab schonmal eine 6.2 gesehen, man weiss ja nie.",
                "Du kannst es versuchen...",
                "Brech kurz die Notenskala."
            ],
            impossibleDown: [
                "Der Schnitt ist schonmal sicher.",
                "Den Schnitt behältst du.",
                "Das ist echt wenig.",
                "Schreib mir, wenn du was tieferes schaffst.",
                "Drunter geht nicht, nicht mal wenn du cheatest.",
                "Brech kurz die Notenskala."
            ]
        },
        fr: {
            coeff: "Coeff:",
            upText: "pour augmenter ta moyenne de 0.5",
            downText: "pour maintenir ta moyenne",
            tooltip: "Il te faut un {value} {direction}. {phrase}",
            motivation: [
                "Tu peux le faire !", 
                "Lets Goooo, tu en es capable !", 
                "C'est Ezz pour toi !", 
                "Lock in!", 
                "Lock tf in", 
                "Tu vas gérer safe."
            ],
            impossibleUp: [
                "Ce n'est pas tout à fait possible.",
                "Un seul examen ne suffira pas pour l'augmenter.",
                "Damn.",
                "J'ai déjà vu un 6.2 une fois, on ne sait jamais.",
                "Tu peux toujours essayer...",
                "Explose kurz la grille des notes."
            ],
            impossibleDown: [
                "La moyenne est déjà safe.",
                "Tu vas maintenir cette moyenne.",
                "C'est vraiment très bas.",
                "Écris-moi si tu arrives à faire plus bas.",
                "Impossible d'aller en dessous, même si tu cheats.",
                "explose brièvement l'échelle de notes."
            ]
        },
        en: {
            coeff: "Coeff:",
            upText: "to raise your gpa by 0.5",
            downText: "to maintain your gpa",
            tooltip: "You need a {value} {direction}. {phrase}",
            motivation: [
                "You can do this!", 
                "Lets Goooo, you got this", 
                "That's Ezz for you", 
                "Lock in!", 
                "Lock tf in", 
                "You'll pass safe."
            ],
            impossibleUp: [
                "That's not quite possible.",
                "One exam is not enough to raise it.",
                "Damn.",
                "I've seen a 6.2 once, so you never know.",
                "You can try...",
                "Go ahead and break the grading scale!"
            ],
            impossibleDown: [
                "Your average is already safe.",
                "You will maintain this average.",
                "That is genuinely low.",
                "Hit me up if you manage to do something lower.",
                "You can't go lower, not even if you cheat.",
                "Unless you break the grading scale, youre fine!"
            ]
        },
        it: {
            coeff: "Coeff:",
            upText: "per alzare la tua media di 0.5",
            downText: "per mantenere la tua media",
            tooltip: "Ti serve un {value} {direction}. {phrase}",
            motivation: [
                "Ce la puoi fare!", 
                "Lets Goooo, puoi farcela !", 
                "Questo è Ezz per te !", 
                "Lock in!", 
                "Lock tf in", 
                "Passi safe."
            ],
            impossibleUp: [
                "Non è del tutto possibile.",
                "Un esame non basta per alzarlo.",
                "Damn.",
                "Ho già visto un 6.2 una volta, non si sa mai.",
                "Puoi provare...",
                "Spiega brevemente la scala di valutazione."
            ],
            impossibleDown: [
                "La media è già safe.",
                "Manterrai questa media.",
                "Questo è davvero basso.",
                "Scrivimi se riesci a ottenere un voto più basso.",
                "Non si può andare sotto, neanche se cheats.",
                "Spiega brevemente la scala di valutazione."
            ]
        }
    };

    let currentLang = 'en';
    const browserLang = (navigator.language || navigator.userLanguage).slice(0, 2);

    if (translations[browserLang]) {
        currentLang = browserLang;
    }


    function getRandomPhrase(gradeValue) {
        const num = parseFloat(gradeValue);
        const langData = translations[currentLang] || translations['de'];
        
        if (num > 6) {
            const randomIndex = Math.floor(Math.random() * langData.impossibleUp.length);
            return langData.impossibleUp[randomIndex];
        } else if (num < 1) {
            const randomIndex = Math.floor(Math.random() * langData.impossibleDown.length);
            return langData.impossibleDown[randomIndex];
        } else {
            const randomIndex = Math.floor(Math.random() * langData.motivation.length);
            return langData.motivation[randomIndex];
        }
    }


    function applyRowGradient(row, colorA, colorB) {
        const totalWidth = row.getBoundingClientRect().width;
        let xOffset = 0;

        for (const cell of row.cells) {
            const cellWidth = cell.getBoundingClientRect().width;
            cell.style.backgroundImage = `linear-gradient(to right, ${colorA}, ${colorB})`;
            cell.style.backgroundSize = `${totalWidth}px 100%`;
            cell.style.backgroundPosition = `-${xOffset}px 0`;
            cell.style.border = 'none';

            const centerFraction = (xOffset + cellWidth / 2) / totalWidth;
            const [r, g, b] = interpolateColor(colorA, colorB, centerFraction);
            cell.style.color = getContrastTextColor(r, g, b);

            xOffset += cellWidth;
        }
    }

    applyRowGradient(ClassRow, currentColorA, currentColorB);

    function parseColor(color) {
        const el = document.createElement('div');
        el.style.color = color;
        document.body.appendChild(el);
        const rgb = getComputedStyle(el).color;
        document.body.removeChild(el);
        return rgb.match(/\d+/g).map(Number);
    }

    function interpolateColor(colorA, colorB, fraction) {
        const [r1, g1, b1] = parseColor(colorA);
        const [r2, g2, b2] = parseColor(colorB);
        return [
            r1 + (r2 - r1) * fraction,
            g1 + (g2 - g1) * fraction,
            b1 + (b2 - b1) * fraction
        ];
    }

    function getContrastTextColor(r, g, b) {
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? 'black' : 'white';
    }

    const UpValue = getNeededForUp();
    const Up = UpValue > 6 ? '> 6' : UpValue;
    const DownValue = getNeededForDown();
    const Down = DownValue < 1 ? '< 1' : DownValue;

    function getBadgeBackground(cell) {
        return cell.style.color === 'white' ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0,0,0,0.10)';
    }

    const CoEffBg = getBadgeBackground(ClassRow.cells[1]);

    function getUpStatusColor(value) {
        const num = parseFloat(value);
        if (num > 6) return 'rgb(120, 0, 0)';
        if (num < 1) return 'rgb(60, 60, 150)';
        return 'rgb(10, 120, 10)';
    }

    function getDownStatusColor(value) {
        const num = parseFloat(value);
        if (num < 1) return 'rgb(60, 60, 255)';
        return 'rgb(180, 0, 10)';
    }

    function applyContainerStyle(innerSpanElement, value, type) {
        if (!innerSpanElement) return;
        
        const container = innerSpanElement.parentElement;
        const bg = (type === 'up') ? getUpStatusColor(value) : getDownStatusColor(value);
        const [r, g, b] = parseColor(bg);
        
        container.style.background = bg;
        container.style.color = getContrastTextColor(r, g, b);
        
        const langData = translations[currentLang] || translations['de'];
        const directionText = (type === 'up') ? langData.upText : langData.downText;
        const randomPhrase = getRandomPhrase(value); 
        
        let template = langData.tooltip;
        container.title = template
            .replace("{value}", value)
            .replace("{direction}", directionText)
            .replace("{phrase}", randomPhrase);
    }

    ClassRow.cells[1].textContent = '';

    const coeffLabel = document.createElement('span');
    coeffLabel.className = 'coeff-label';
    coeffLabel.textContent = 'Koeff:';

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = CoEffX;
    inputElement.style.cssText = `width:20%; text-align:center; border-radius:10px; margin-right:10%; background:${CoEffBg};`;

    const downContainer = document.createElement('span');
    downContainer.style.cssText = 'text-align:center; border-radius:6px; padding: 2px 8px; display: inline-block; white-space: nowrap';
    downContainer.appendChild(document.createTextNode('⮟ '));

    const downValue = document.createElement('span');
    downValue.className = 'down-value';
    downValue.textContent = Down;

    downContainer.appendChild(downValue);

    ClassRow.cells[1].append(coeffLabel, inputElement, downContainer);


    ClassRow.cells[2].textContent = '';

    const upContainer = document.createElement('span');
    upContainer.style.cssText = 'text-align:center; border-radius:6px; padding: 2px 8px; display: inline-block; white-space: nowrap';
    upContainer.appendChild(document.createTextNode('⮝ '));

    const upValue = document.createElement('span');
    upValue.className = 'up-value';
    upValue.textContent = Up; // Safely treated as text

    upContainer.appendChild(upValue);

    ClassRow.cells[2].appendChild(upContainer);


    const coeffInput = ClassRow.cells[1].querySelector('input');
    const downSpan = ClassRow.cells[1].querySelector('.down-value');
    const upSpan = ClassRow.cells[2].querySelector('.up-value');

    function updateTooltipsAndTexts() {
        const coeffLabel = ClassRow.cells[1].querySelector('.coeff-label');
            if (coeffLabel) {
                const langData = translations[currentLang] || translations['de'];
                coeffLabel.textContent = langData.coeff;
            }
        const currentUpValue = getNeededForUp();
        const currentDownValue = getNeededForDown();

        upSpan.textContent = currentUpValue > 6 ? '> 6' : currentUpValue;
        downSpan.textContent = currentDownValue < 1 ? '< 1' : currentDownValue;

        applyContainerStyle(upSpan, currentUpValue, 'up');
        applyContainerStyle(downSpan, currentDownValue, 'down');
    }

    updateTooltipsAndTexts();

    coeffInput.addEventListener('input', () => {
        let value = coeffInput.value;
        value = value.replace(/[^0-9.,]/g, '');

        if (value === '' || isNaN(parseFloat(value.replace(',', '.')))) {
            downSpan.textContent = '-.--';
            upSpan.textContent = '-.--';
            return;
        }

        const firstSep = value.search(/[.,]/);
        if (firstSep !== -1) {
            value = value.slice(0, firstSep + 1) + value.slice(firstSep + 1).replace(/[.,]/g, '');
        }

        const sepIndex = value.search(/[.,]/);
        if (sepIndex === -1) {
            value = value.slice(0, 1);
        } else {
            const before = value.slice(0, sepIndex).slice(0, 1);
            const sep = value[sepIndex];
            const after = value.slice(sepIndex + 1, sepIndex + 3);
            value = before + sep + after;
        }

        coeffInput.value = value;

        const parsed = parseFloat(value.replace(',', '.'));
        CoEffX = (value === '' || isNaN(parsed)) ? 1 : parsed;

        updateTooltipsAndTexts();
    });

    function refreshRowAppearance() {
        applyRowGradient(ClassRow, currentColorA, currentColorB);
        coeffInput.style.background = getBadgeBackground(ClassRow.cells[1]);
        coeffInput.style.color = ClassRow.cells[1].style.color;
        coeffInput.style.border = 'none';

        updateTooltipsAndTexts();
    }

    const resizeObserver = new ResizeObserver(() => refreshRowAppearance());
    resizeObserver.observe(ClassRow)

    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "updateSettings") {
            currentColorA = request.colorA;
            currentColorB = request.colorB;

            if (request.lang) {
                currentLang = request.lang;
            }
            
            refreshRowAppearance();
        }
    });
    browser.storage.local.get(['colorA', 'colorB', 'lang']).then((saved) => {
        if (saved.colorA) currentColorA = saved.colorA;
        if (saved.colorB) currentColorB = saved.colorB;
        if (saved.lang) currentLang = saved.lang;
        refreshRowAppearance();
    });
});
