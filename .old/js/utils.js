// js/utils.js
const Utils = {
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
            // Simplificado, asumiendo que el país es Argentina.
            // Para una estructura ADR completa, necesitarías más campos o un parseo más robusto.
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
    }
};