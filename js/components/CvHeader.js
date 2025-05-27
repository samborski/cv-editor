// js/components/CvHeader.js
const CvHeader = {
    props: ["cvData", "editMode"],
    emits: ["set-edit-mode"],
    data() {
        return {
            emailError: "",
            websiteUrlError: "",
            // No necesitamos componentId si usamos IDs estáticos y el componente es único
        };
    },
    watch: {
        "cvData.email"(newEmail) {
            if (
                this.editMode &&
                newEmail &&
                newEmail.trim() !== "" &&
                !Utils.isValidEmail(newEmail)
            ) {
                this.emailError = this.t("header.errors.invalidEmail");
            } else {
                this.emailError = "";
            }
        },
        "cvData.websiteUrl"(newUrl) {
            if (
                this.editMode &&
                newUrl &&
                newUrl.trim() !== "" &&
                !Utils.isValidUrl(newUrl)
            ) {
                this.websiteUrlError = this.t("header.errors.invalidUrl");
            } else {
                this.websiteUrlError = "";
            }
        },
    },
    methods: {
        t(key) {
            return window.i18n?.t(key) || key;
        },
        clearField(fieldName) {
            if (this.cvData.hasOwnProperty(fieldName)) {
                this.cvData[fieldName] = "";
                if (fieldName === "email") this.emailError = "";
                if (fieldName === "websiteUrl") this.websiteUrlError = "";
                // No es necesario limpiar explícitamente websiteDisplay/Url si el otro se limpia,
                // ya que v-model los mantendrá sincronizados con cvData.
            }
        },
        triggerFileInput() {
            if (this.$refs.profilePictureFile) {
                this.$refs.profilePictureFile.click();
            }
        },
        handleProfilePictureUpload(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.cvData.profilePicture = e.target.result;
                };
                reader.readAsDataURL(file);
            } else if (file) {
                alert(
                    "Por favor, selecciona un archivo de imagen válido (ej: JPG, PNG, GIF). No se reemplazará la imagen predeterminada."
                );
            }
            event.target.value = null;
        },
        requestEditMode() {
            this.$emit("set-edit-mode", true);
        },
    },
    mounted() {
        // Escuchar cambios de idioma
        this.$root.$on("localeChanged", () => {
            this.$forceUpdate();
        });
    },
    beforeUnmount() {
        this.$root.$off("localeChanged");
    },
    template: `
    <header class="flex flex-col md:flex-row print:flex-row items-center bg-secondary dark:bg-dark-secondary p-5 rounded-lg mb-2 print:mb-4 print:p-2 print:!bg-white">
        <div class="flex-shrink-0 mb-5 md:mb-0 print:mb-0 md:mr-5 print:mr-5 text-center">
            <img v-if="cvData.profilePicture && cvData.profilePicture.trim() !== ''"
                 :src="cvData.profilePicture"
                 alt="Foto de perfil"
                 class="w-32 h-32 max-w-[150px] min-w-[80px] print:w-28 rounded-full object-cover border-2 border-primary print:!border-black shadow mx-auto" />
            
            <div v-if="editMode" class="mt-2 space-y-2">
                <div class="relative">
                    <label for="cvHeaderProfilePictureInput" class="sr-only">URL de la foto de perfil</label>
                    <input id="cvHeaderProfilePictureInput" type="text" v-model="cvData.profilePicture" placeholder="URL o selecciona archivo" class="edit-input pr-8 w-full">
                    <button v-if="cvData.profilePicture"
                       @click="clearField('profilePicture')"
                       type="button"
                       class="icon-button absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                       aria-label="Limpiar URL de foto de perfil">
                       <i class="fa-solid fa-times-circle"></i>
                    </button>
                </div>
                <div>
                    <input type="file" accept="image/*" @change="handleProfilePictureUpload" ref="profilePictureFile" class="hidden">
                    <button @click="triggerFileInput" type="button"
                            class="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                        Seleccionar Archivo...
                    </button>
                </div>
                <p v-if="!cvData.profilePicture && editMode" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Pega una URL o selecciona un archivo de imagen.
                </p>
            </div>
        </div>

        <div class="flex-1 text-center md:text-left print:text-left space-y-2">
            <h1 class="text-primary dark:text-dark-primary text-2xl md:text-3xl font-bold print:!text-black print:!mb-2">
                <span v-if="!editMode" :class="{'field-hoverable': !editMode}" @click="requestEditMode">{{ cvData.name }}</span>
                <div v-else class="relative">
                    <label for="cvHeaderNameInput" class="sr-only">Nombre completo</label>
                    <input id="cvHeaderNameInput" type="text" v-model="cvData.name" placeholder="Nombre completo" class="edit-input text-2xl md:text-3xl font-bold pr-10">
                    <button v-if="cvData.name"
                       @click="clearField('name')"
                       type="button"
                       class="icon-button absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-base"
                       aria-label="Limpiar nombre">
                       <i class="fa-solid fa-times-circle"></i>
                    </button>
                </div>
            </h1>
            
            <p class="print:!text-black">
                <i class="fa-solid fa-envelope text-lightText dark:text-dark-lightText mr-2 print:!text-black" aria-hidden="true"></i>
                <template v-if="!editMode">
                    <a :href="'mailto:' + cvData.email" class="text-primary dark:text-dark-primary hover:underline print:!text-black field-hoverable" @click.prevent="requestEditMode">{{ cvData.email }}</a>
                </template>
                <template v-else>
                    <span class="relative inline-block">
                        <label for="cvHeaderEmailInput" class="sr-only">Correo electrónico</label>
                        <input id="cvHeaderEmailInput" type="email" v-model="cvData.email" placeholder="tu.correo@ejemplo.com" class="edit-input inline-block w-auto pr-8">
                        <button v-if="cvData.email" @click="clearField('email')" type="button" class="icon-button absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm" aria-label="Limpiar correo"><i class="fa-solid fa-times-circle"></i></button>
                    </span>
                    <span v-if="emailError" class="text-red-500 text-xs ml-2 block md:inline" role="alert">{{ emailError }}</span>
                </template>
                
                | 
                <i class="fa-solid fa-phone text-lightText dark:text-dark-lightText mx-2 print:!text-black" aria-hidden="true"></i>
                <template v-if="!editMode">
                    <span :class="{'field-hoverable': !editMode}" @click="requestEditMode">{{ cvData.phone }}</span>
                </template>
                <template v-else>
                    <span class="relative inline-block">
                        <label for="cvHeaderPhoneInput" class="sr-only">Número de teléfono</label>
                        <input id="cvHeaderPhoneInput" type="tel" v-model="cvData.phone" placeholder="+54 11 12345678" class="edit-input inline-block w-auto pr-8">
                        <button v-if="cvData.phone" @click="clearField('phone')" type="button" class="icon-button absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm" aria-label="Limpiar teléfono"><i class="fa-solid fa-times-circle"></i></button>
                    </span>
                </template>
                <a :href="'https://api.whatsapp.com/send?phone=' + (cvData.phone || '').replace(/\\s+/g, '')" target="_blank"
                   class="text-primary dark:text-dark-primary hover:text-green-500 dark:hover:text-green-400 ml-2 print:hidden" title="WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
            </p>

            <p class="print:!text-black">
                <i class="fa-solid fa-globe text-lightText dark:text-dark-lightText mr-2 print:!text-black" aria-hidden="true"></i>
                <template v-if="!editMode">
                    <a :href="cvData.websiteUrl" target="_blank" class="text-primary dark:text-dark-primary hover:underline print:!text-black field-hoverable" @click.prevent="requestEditMode">
                        {{ cvData.websiteDisplay || cvData.websiteUrl }}
                    </a>
                </template>
                <template v-else>
                    <span class="relative inline-block mr-1">
                        <label for="cvHeaderWebsiteDisplayInput" class="sr-only">Texto a mostrar para el sitio web</label>
                        <input id="cvHeaderWebsiteDisplayInput" type="text" v-model="cvData.websiteDisplay" placeholder="Ej: Mi Portafolio" class="edit-input inline-block w-auto pr-8">
                        <button v-if="cvData.websiteDisplay" @click="clearField('websiteDisplay')" type="button" class="icon-button absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm" aria-label="Limpiar texto del sitio web"><i class="fa-solid fa-times-circle"></i></button>
                        <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Texto que se mostrará para el enlace.</span>
                    </span>
                    <span class="relative inline-block">
                        <label for="cvHeaderWebsiteUrlInput" class="sr-only">URL del sitio web</label>
                        <input id="cvHeaderWebsiteUrlInput" type="url" v-model="cvData.websiteUrl" placeholder="https://www.tusitio.com" class="edit-input inline-block w-auto pr-8">
                        <button v-if="cvData.websiteUrl" @click="clearField('websiteUrl')" type="button" class="icon-button absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm" aria-label="Limpiar URL del sitio web"><i class="fa-solid fa-times-circle"></i></button>
                        <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">URL completa de tu sitio web.</span>
                    </span>
                    <span v-if="websiteUrlError" class="text-red-500 text-xs ml-2 block" role="alert">{{ websiteUrlError }}</span>
                </template>
            </p>

            <p class="print:!text-black">
                <i class="fa-solid fa-map-location-dot text-lightText dark:text-dark-lightText mr-2 print:!text-black" aria-hidden="true"></i>
                <span v-if="!editMode" :class="{'field-hoverable': !editMode}" @click="requestEditMode">{{ cvData.address }}</span>
                <span v-else class="relative block">
                    <label for="cvHeaderAddressInput" class="sr-only">Dirección</label>
                    <input id="cvHeaderAddressInput" type="text" v-model="cvData.address" placeholder="Calle Número, Ciudad, Provincia" class="edit-input pr-8">
                    <button v-if="cvData.address" @click="clearField('address')" type="button" class="icon-button absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500" aria-label="Limpiar dirección"><i class="fa-solid fa-times-circle"></i></button>
                </span>
            </p>

            <p class="print:!text-black">
                <i class="fa-solid fa-cake-candles text-lightText dark:text-dark-lightText mr-2 print:!text-black" aria-hidden="true"></i>
                <span v-if="!editMode" :class="{'field-hoverable': !editMode}" @click="requestEditMode">{{ cvData.birthdate }}</span>
                 <span v-else class="relative block">
                    <label for="cvHeaderBirthdateInput" class="sr-only">Fecha de nacimiento</label>
                    <input id="cvHeaderBirthdateInput" type="text" v-model="cvData.birthdate" placeholder="DD de Mes de AAAA (ej: 18 de enero de 1973)" class="edit-input pr-8">
                    <button v-if="cvData.birthdate" @click="clearField('birthdate')" type="button" class="icon-button absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500" aria-label="Limpiar fecha de nacimiento"><i class="fa-solid fa-times-circle"></i></button>
                    <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Este formato se usa para el VCF.</span>
                </span>
            </p>
        </div>
    </header>
    `,
};
