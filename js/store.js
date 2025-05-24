// js/store.js
const CVDataStore = {
    STORAGE_KEY: 'cvDataSamborskiModular',

    getDefaultData() {
        return {
            // ... (otras propiedades como name, email, etc. se mantienen igual) ...
            name: 'Daniel Gustavo Samborski',
            email: 'danielgsamborski@gmail.com',
            phone: '+54 3412294413',
            websiteDisplay: 'samborski.github.io/curriculum',
            websiteUrl: 'https://samborski.github.io/curriculum',
            address: 'San Diego 1129, Villa Gob. Gálvez',
            birthdate: '18 de enero de 1973',
            profilePicture: 'foto-de-perfil.jpg',
            vcfLink: 'contact.vcf',
            professionalProfile: `Técnico especializado en mantenimiento y reparación de PC...`, // Mantener el texto completo
            education: [
                { id: Utils.generateId(), title: 'Auxiliar Mecánico de Motocicletas', institution: 'CIC - Centro de Capacitación', details: '' },
                { id: Utils.generateId(), title: 'Montador Electricista Domiciliario', institution: 'Centro de Capacitación Laboral Nº 6619', details: '' },
            ],
            experience: [
                { id: Utils.generateId(), title: 'Freelance', role: 'Paseador de perros', description: '' },
                { id: Utils.generateId(), title: 'CAR’s Racing', role: 'Auxiliar Mecánico Automotriz', description: '' },
            ],
            technicalSkills: [
                { id: Utils.generateId(), text: '<strong>Programación y Desarrollo Web:</strong> HTML, CSS, SASS, JavaScript...' },
                { id: Utils.generateId(), text: '<strong>Software y Aplicaciones:</strong> Microsoft Office, LibreOffice...' },
            ],
            availability: 'Tiempo completo, ingreso inmediato',
            socialLinks: { // <<--- CAMBIOS AQUÍ
                linkedin: 'danielgsamborski', // Solo el ID/username
                github: 'samborski',         // Solo el username
                twitter: 'dgsamborski',      // Solo el username (sin @)
                facebook: 'danielgsamborski' // Solo el username/ID
            }
        };
    },

    load() {
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Asegurarse de que los socialLinks cargados sean solo usernames si vienen de una versión anterior
                if (parsed.socialLinks) {
                    Object.keys(parsed.socialLinks).forEach(platform => {
                        if (typeof parsed.socialLinks[platform] === 'string' && parsed.socialLinks[platform].includes('/')) {
                            // Intenta extraer el username de una URL completa (esto es una heurística)
                            const parts = parsed.socialLinks[platform].split('/');
                            parsed.socialLinks[platform] = parts.pop() || parts.pop(); // Toma el último segmento no vacío
                        }
                    });
                }
                return this.deepMerge(this.getDefaultData(), parsed);
            } catch (e) {
                console.error("Error parsing data from localStorage, using defaults.", e);
                return this.deepClone(this.getDefaultData());
            }
        }
        return this.deepClone(this.getDefaultData());
    },

    // ... (el resto de los métodos: save, deepClone, deepMerge, isObject se mantienen igual) ...
    save(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    deepMerge(target, source) {
        const output = { ...target };
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (key === 'socialLinks' && this.isObject(source[key])) { // Manejo especial para socialLinks
                    const defaultSocial = this.getDefaultData().socialLinks;
                    const mergedSocial = { ...defaultSocial };
                    Object.keys(source[key]).forEach(platform => {
                        if (typeof source[key][platform] === 'string') {
                            if (source[key][platform].includes('/')) { // Si es una URL, intentar extraer username
                                const parts = source[key][platform].split('/');
                                mergedSocial[platform] = parts.pop() || parts.pop() || '';
                            } else {
                                mergedSocial[platform] = source[key][platform];
                            }
                        } else {
                             mergedSocial[platform] = defaultSocial[platform] || '';
                        }
                    });
                     output[key] = mergedSocial;

                } else if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.deepMerge(target[key], source[key]);
                } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
                    output[key] = source[key].length > 0 ? this.deepClone(source[key]) : this.deepClone(target[key]);
                }
                else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    },

    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
};