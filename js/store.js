// js/store.js
const CVDataStore = {
    STORAGE_KEY: 'cvDataSamborskiModular',

    getDefaultData() {
        // Estructura de datos inicial, ahora con objetos para Educación y Experiencia
        return {
            name: 'Daniel Gustavo Samborski',
            email: 'danielgsamborski@gmail.com',
            phone: '+54 3412294413',
            websiteDisplay: 'samborski.github.io/curriculum',
            websiteUrl: 'https://samborski.github.io/curriculum',
            address: 'San Diego 1129, Villa Gob. Gálvez',
            birthdate: '18 de enero de 1973',
            profilePicture: 'foto-de-perfil.jpg',
            vcfLink: 'contact.vcf',
            professionalProfile: `Técnico especializado en mantenimiento y reparación de PC...`,
            education: [
                { id: Utils.generateId(), title: 'Auxiliar Mecánico de Motocicletas', institution: 'CIC - Centro de Capacitación', details: '' },
                { id: Utils.generateId(), title: 'Montador Electricista Domiciliario', institution: 'Centro de Capacitación Laboral Nº 6619', details: '' },
            ],
            experience: [
                { id: Utils.generateId(), title: 'Freelance', role: 'Paseador de perros', description: '' },
                { id: Utils.generateId(), title: 'CAR’s Racing', role: 'Auxiliar Mecánico Automotriz', description: '' },
            ],
            technicalSkills: [ // Estos pueden seguir siendo simples strings o también objetos si se quiere más estructura
                { id: Utils.generateId(), text: '<strong>Programación y Desarrollo Web:</strong> HTML, CSS, SASS, JavaScript...' },
                { id: Utils.generateId(), text: '<strong>Software y Aplicaciones:</strong> Microsoft Office, LibreOffice...' },
            ],
            availability: 'Tiempo completo, ingreso inmediato',
            socialLinks: {
                linkedin: 'https://www.linkedin.com/in/danielgsamborski',
                github: 'https://github.com/samborski',
                twitter: 'https://x.com/dgsamborski',
                facebook: 'https://www.facebook.com/danielgsamborski',
            }
        };
    },

    load() {
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Fusionar con default para asegurar que todas las propiedades existan si el formato guardado es antiguo
                // Esto necesita una función de fusión profunda para ser robusto
                return this.deepMerge(this.getDefaultData(), parsed);
            } catch (e) {
                console.error("Error parsing data from localStorage, using defaults.", e);
                return this.deepClone(this.getDefaultData());
            }
        }
        return this.deepClone(this.getDefaultData());
    },

    save(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Función simple de deepMerge, se puede mejorar
    deepMerge(target, source) {
        const output = { ...target };
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.deepMerge(target[key], source[key]);
                } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
                    // Simple merge for arrays: overwrite target with source if source has items
                    // For more complex array merging (e.g., by ID), this needs more logic
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