// js/store.js
const CVDataStore = {
    STORAGE_KEY: "cvDataSamborskiModular",

    getDefaultData() {
        return {
            name: "Juan Carlos Pérez",
            email: "juanperez@ejemplo.com",
            phone: "+54 11 1234-5678",
            websiteDisplay: "Editor de Currículo Dinámico",
            websiteUrl: "https://samborski.github.io/cv-editor",
            address: "Av. Rivadavia 1234, Buenos Aires",
            birthdate: "15 de marzo de 1990",
            profilePicture: "foto-de-perfil.jpg", // Cargar la imagen predeterminada
            vcfLink: "contact.vcf", // Si aún usas un VCF estático, sino quitar o generar dinámico
            professionalProfile: `Técnico especializado en mantenimiento y reparación de PC, desarrollo de sitios web y electricidad domiciliaria.\nAmplia experiencia como trabajador autónomo en distintas áreas, brindando soluciones tecnológicas y eléctricas a clientes particulares y PyMEs.\nComprometido con la calidad del servicio y con una gran capacidad de adaptación a distintas necesidades del mercado.`,
            education: [
                {
                    id: Utils.generateId(),
                    title: "Auxiliar Mecánico de Motocicletas",
                    institution: "CIC - Centro de Capacitación",
                    details: "",
                },
                {
                    id: Utils.generateId(),
                    title: "Montador Electricista Domiciliario",
                    institution: "Centro de Capacitación Laboral Nº 6619",
                    details: "",
                },
            ],
            experience: [
                {
                    id: Utils.generateId(),
                    title: "Freelance",
                    role: "Paseador de perros",
                    description: "",
                },
                {
                    id: Utils.generateId(),
                    title: "CAR’s Racing",
                    role: "Auxiliar Mecánico Automotriz",
                    description: "",
                },
            ],
            technicalSkills: [
                {
                    id: Utils.generateId(),
                    text: "<strong>Programación y Desarrollo Web:</strong> HTML, CSS, SASS, JavaScript, PHP, MySQL, WordPress, Drupal, Bootstrap, Markdown, Python, .NET, Java",
                },
                {
                    id: Utils.generateId(),
                    text: "<strong>Software y Aplicaciones:</strong> Microsoft Office, LibreOffice, Visual Studio Code, Eclipse, Thunderbird, Google Apps",
                },
                {
                    id: Utils.generateId(),
                    text: "<strong>Otros Conocimientos:</strong> Electricidad domiciliaria",
                },
            ],
            availability: "Tiempo completo, ingreso inmediato",
            socialLinks: {
                linkedin: "juancperez",
                github: "perez",
                twitter: "jcperez",
                facebook: "juancperez",
            },
            // Datos para los enlaces del pie de página (si decides NO usar un componente dedicado)
            githubUsername: "samborski", // Tu nombre de usuario de GitHub
            
            // ¡NUEVA PROPIEDAD AÑADIDA AQUÍ!
            wikiSupportLink:
                "https://github.com/samborski/cv-editor/wiki/Apoyar-el-Proyecto",
        };
    },

    load() {
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Asegurarse de que los socialLinks cargados sean solo usernames si vienen de una versión anterior
                if (parsed.socialLinks) {
                    Object.keys(parsed.socialLinks).forEach((platform) => {
                        if (
                            parsed.socialLinks[platform] &&
                            typeof parsed.socialLinks[platform] === "string" &&
                            parsed.socialLinks[platform].includes("/")
                        ) {
                            const parts =
                                parsed.socialLinks[platform].split("/");
                            parsed.socialLinks[platform] =
                                parts.pop() || parts.pop() || "";
                        }
                    });
                }
                return this.deepMerge(this.getDefaultData(), parsed);
            } catch (e) {
                console.error(
                    "Error parsing data from localStorage, using defaults.",
                    e
                );
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

    deepMerge(target, source) {
        const output = { ...target }; // Clonar el target para no mutarlo directamente
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach((key) => {
                if (key === "socialLinks" && this.isObject(source[key])) {
                    const defaultSocial = this.getDefaultData().socialLinks; // Obtener defaults frescos
                    const mergedSocial = { ...defaultSocial }; // Empezar con defaults
                    Object.keys(source[key]).forEach((platform) => {
                        if (
                            source[key].hasOwnProperty(platform) &&
                            typeof source[key][platform] === "string"
                        ) {
                            if (source[key][platform].includes("/")) {
                                const parts = source[key][platform].split("/");
                                mergedSocial[platform] =
                                    parts.pop() || parts.pop() || "";
                            } else {
                                mergedSocial[platform] = source[key][platform];
                            }
                        } else if (defaultSocial.hasOwnProperty(platform)) {
                            mergedSocial[platform] = defaultSocial[platform]; // Mantener default si source no lo tiene o es inválido
                        }
                    });
                    output[key] = mergedSocial;
                } else if (
                    this.isObject(source[key]) &&
                    target.hasOwnProperty(key) &&
                    this.isObject(target[key])
                ) {
                    output[key] = this.deepMerge(target[key], source[key]);
                } else if (
                    Array.isArray(source[key]) &&
                    Array.isArray(target[key])
                ) {
                    // Para arrays, si el source tiene items, lo usamos, sino el target (simple overwrite)
                    output[key] =
                        source[key].length > 0
                            ? this.deepClone(source[key])
                            : this.deepClone(target[key]);
                } else {
                    // Primitivas, o si la estructura no coincide, source sobrescribe
                    output[key] = source[key];
                }
            });
        }
        // Asegurar que todas las claves del default estén presentes si no estaban en source
        Object.keys(target).forEach((key) => {
            if (!output.hasOwnProperty(key)) {
                output[key] = target[key];
            }
        });
        return output;
    },

    isObject(item) {
        return item && typeof item === "object" && !Array.isArray(item);
    },
};
