const { createApp } = Vue;

createApp({
    data() {
        return {
            cv: this.loadCVFromLocalStorage() || this.getInitialCVData()
        };
    },
    methods: {
        getInitialCVData() {
            return {
                personal: {
                    nombre: '',
                    email: '',
                    telefono: '',
                    resumen: ''
                },
                educacion: [],
                experiencia: [],
                habilidades: [], // Para software y aplicaciones
                otrosConocimientos: [],
                disponibilidad: ''
            };
        },

        // Educación
        addEducacionItem() {
            this.cv.educacion.push({ titulo: '', institucion: '', fechas: '' });
            this.saveCV();
        },
        removeEducacionItem(index) {
            this.cv.educacion.splice(index, 1);
            this.saveCV();
        },

        // Experiencia
        addExperienciaItem() {
            this.cv.experiencia.push({ puesto: '', empresa: '', fechas: '', descripcion: '' });
            this.saveCV();
        },
        removeExperienciaItem(index) {
            this.cv.experiencia.splice(index, 1);
            this.saveCV();
        },

        // Habilidades / Software
        addHabilidadItem() {
            this.cv.habilidades.push({ nombre: '' });
            this.saveCV();
        },
        removeHabilidadItem(index) {
            this.cv.habilidades.splice(index, 1);
            this.saveCV();
        },

        // Otros Conocimientos
        addOtroConocimientoItem() {
            this.cv.otrosConocimientos.push({ nombre: '' });
            this.saveCV();
        },
        removeOtroConocimientoItem(index) {
            this.cv.otrosConocimientos.splice(index, 1);
            this.saveCV();
        },

        // Guardar y Cargar
        saveCV() {
            localStorage.setItem('myOfflineCV', JSON.stringify(this.cv));
            console.log("CV guardado en LocalStorage.");
        },
        loadCVFromLocalStorage() {
            const savedCV = localStorage.getItem('myOfflineCV');
            if (savedCV) {
                console.log("CV cargado desde LocalStorage.");
                try {
                    return JSON.parse(savedCV);
                } catch (e) {
                    console.error("Error al parsear CV desde LocalStorage:", e);
                    localStorage.removeItem('myOfflineCV'); // Limpiar dato corrupto
                    return null;
                }
            }
            return null;
        },
        clearCV() {
            if (confirm("¿Estás seguro de que quieres borrar todo el CV? Esta acción no se puede deshacer.")) {
                this.cv = this.getInitialCVData();
                this.saveCV(); // Guarda el estado vacío
                console.log("CV limpiado.");
            }
        },
        exportCV() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.cv, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "mi_cv.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            console.log("CV exportado.");
        },
        importCV(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        // Validación básica de la estructura
                        if (importedData && importedData.personal && Array.isArray(importedData.educacion)) {
                             // Fusionar en lugar de reemplazar directamente para mantener reactividad si es necesario
                            // o simplemente asignar si la estructura es idéntica y Vue maneja bien la reactividad
                            Object.assign(this.cv, this.getInitialCVData()); // Resetea a estructura base
                            Object.assign(this.cv, importedData); // Sobrescribe con datos importados
                            
                            this.saveCV();
                            console.log("CV importado correctamente.");
                            alert("CV importado correctamente.");
                        } else {
                            throw new Error("El archivo JSON no tiene la estructura esperada para un CV.");
                        }
                    } catch (err) {
                        console.error("Error al importar CV:", err);
                        alert("Error al importar el archivo: " + err.message);
                    }
                     // Resetear el input para permitir re-importar el mismo archivo
                    event.target.value = null;
                };
                reader.readAsText(file);
            }
        }
    },
    // Guardado automático en cada cambio (alternativa a @input="saveCV" en cada campo)
    // watch: {
    //     cv: {
    //         handler(newValue) {
    //             localStorage.setItem('myOfflineCV', JSON.stringify(newValue));
    //             console.log("CV guardado automáticamente (watch).");
    //         },
    //         deep: true // Necesario para objetos anidados
    //     }
    // },
    mounted() {
        // El CV ya se carga en la propiedad 'data', así que no es necesario aquí
        // si se usa la inicialización directa en 'data'.
        // Si prefieres cargar aquí:
        // const loadedCV = this.loadCVFromLocalStorage();
        // if (loadedCV) {
        //     this.cv = loadedCV;
        // } else {
        //     this.cv = this.getInitialCVData();
        // }
        console.log("Aplicación CV montada.");
    }
}).mount('#app');