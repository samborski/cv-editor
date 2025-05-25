// js/utils.js
const Utils = {
    // ... (encodeUrl, isValidEmail, generateId, generateVCF sin cambios) ...
    encodeUrl(url) {
        return encodeURIComponent(url);
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    generateVCF(cvData) {
        // ... (código de generateVCF sin cambios)
        let vcfContent = "BEGIN:VCARD\n";
        vcfContent += "VERSION:3.0\n";

        const nameParts = cvData.name ? cvData.name.split(' ') : [''];
        const lastName = nameParts.length > 1 ? nameParts.pop() : (nameParts[0] || 'Desconocido');
        const firstName = nameParts.join(' ') || (cvData.name || 'Desconocido');
        vcfContent += `N:${lastName};${firstName};;;\n`;
        vcfContent += `FN:${cvData.name || 'N/A'}\n`;

        if (cvData.phone) {
            vcfContent += `TEL;TYPE=CELL,VOICE:${cvData.phone}\n`;
        }

        if (cvData.email) {
            vcfContent += `EMAIL:${cvData.email}\n`;
        }

        if (cvData.address) {
            const addressParts = cvData.address.split(',');
            const street = addressParts[0] ? addressParts[0].trim() : '';
            const city = addressParts[1] ? addressParts[1].trim() : '';
            vcfContent += `ADR;TYPE=HOME:;;${street};${city};;;Argentina\n`;
        }
        
        if (cvData.websiteUrl) {
            vcfContent += `URL:${cvData.websiteUrl}\n`;
        }

        if (cvData.birthdate) {
            const dateParts = cvData.birthdate.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
            if (dateParts && dateParts.length === 4) {
                const day = dateParts[1].padStart(2, '0');
                const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
                const monthIndex = monthNames.indexOf(dateParts[2].toLowerCase());
                if (monthIndex !== -1) {
                    const month = (monthIndex + 1).toString().padStart(2, '0');
                    const year = dateParts[3];
                    vcfContent += `BDAY:${year}${month}${day}\n`;
                }
            }
        }
        
        vcfContent += `REV:${new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15)}Z\n`;
        vcfContent += "END:VCARD";

        return vcfContent;
    },

    isValidUrl(urlString) {
        if (!urlString || typeof urlString !== 'string') {
            return false;
        }
        // Expresión regular simple para verificar si parece una URL.
        // Para una validación más estricta, se podría usar new URL() pero puede ser demasiado restrictiva
        // para URLs parciales o sin http/https.
        // Esta regex busca algo como "protocolo://dominio.ext" o "www.dominio.ext" o "dominio.ext"
        // Es permisiva, no valida TLDs correctos, etc.
        const urlPattern = new RegExp('^(https?://)?'+ // protocolo
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // nombre de dominio
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // O una IP (v4)
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // puerto y path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        
        if (!urlPattern.test(urlString)) {
            return false;
        }

        // Intenta construir un objeto URL para una validación más robusta si tiene protocolo
        // Si no tiene protocolo, se asume que es un dominio y puede ser válido sin él para ciertos contextos.
        try {
            if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
                new URL(urlString);
            } else {
                // Para dominios sin protocolo, podríamos intentar anteponer http y validar
                // o simplemente aceptarlo si la regex básica pasó.
                // Por ahora, si pasa la regex y no tiene protocolo, la consideramos "potencialmente válida"
                // para no ser demasiado estrictos con entradas como "example.com".
                // new URL('http://' + urlString); // Esto sería más estricto
            }
            return true;
        } catch (e) {
            return false;
        }
    }
};