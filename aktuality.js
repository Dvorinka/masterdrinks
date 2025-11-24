// Aktuality Manager - Načítá a zobrazuje aktuality z XML souboru
class AktualityManager {
    constructor() {
        this.xmlFile = 'aktuality.xml';
        this.containerSelector = '.aktuality-grid';
    }

    // Načte XML soubor
    async loadXML() {
        try {
            const response = await fetch(this.xmlFile);
            if (!response.ok) {
                throw new Error(`Chyba při načítání XML: ${response.status}`);
            }
            const xmlText = await response.text();
            return new DOMParser().parseFromString(xmlText, "text/xml");
        } catch (error) {
            console.error('Chyba při načítání aktualit:', error);
            this.showError();
            return null;
        }
    }

    // Zobrazí chybovou zprávu
    showError() {
        const container = document.querySelector(this.containerSelector);
        if (container) {
            container.innerHTML = `
                <div class="aktuality-error">
                    <p>Nepodařilo se načíst aktuality. Zkuste to prosím později.</p>
                </div>
            `;
        }
    }

    // Vytvoří HTML pro jednu položku
    createAktualityItem(polozka) {
        const typ = polozka.querySelector('typ')?.textContent || 'Novinka';
        const datum = polozka.querySelector('datum')?.textContent || '';
        const titulek = polozka.querySelector('titulek')?.textContent || '';
        const popis = polozka.querySelector('popis')?.textContent || '';
        const link = polozka.querySelector('link')?.textContent;
        const linkText = polozka.querySelector('linkText')?.textContent || 'Více informací';

        let linkHtml = '';
        if (link) {
            linkHtml = `
                <a href="${link}" class="aktuality-link">
                    ${linkText} <i class="fas fa-arrow-right"></i>
                </a>
            `;
        }

        return `
            <div class="aktuality-card">
                <span class="aktuality-badge">${typ}</span>
                <div class="aktuality-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${datum}
                </div>
                <h3>${titulek}</h3>
                <p>${popis}</p>
                ${linkHtml}
            </div>
        `;
    }

    // Zobrazí aktuality na stránce
    async displayAktuality() {
        const xmlDoc = await this.loadXML();
        if (!xmlDoc) return;

        const container = document.querySelector(this.containerSelector);
        if (!container) return;

        const polozky = xmlDoc.querySelectorAll('polozka');
        
        if (polozky.length === 0) {
            container.innerHTML = `
                <div class="aktuality-empty">
                    <p>Momentálně žádné aktuality.</p>
                </div>
            `;
            return;
        }

        let html = '';
        polozky.forEach(polozka => {
            html += this.createAktualityItem(polozka);
        });

        container.innerHTML = html;
    }

    // Inicializace - zavolá se při načtení stránky
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.displayAktuality();
        });
    }
}

// Vytvoření instance a inicializace
const aktualityManager = new AktualityManager();
aktualityManager.init();
