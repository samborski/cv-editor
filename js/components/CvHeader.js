// js/components/CvHeader.js
const CvHeader = {
    // ... (props, data, watch sin cambios)
    props: ['cvData', 'editMode'],
    data() {
        return {
            emailError: ''
        }
    },
    watch: {
        'cvData.email'(newEmail) {
            if (this.editMode && newEmail && !Utils.isValidEmail(newEmail)) {
                this.emailError = 'Formato de email inválido.';
            } else {
                this.emailError = '';
            }
        }
    },
    template: `
    <header class="flex flex-col md:flex-row print:flex-row items-center bg-secondary dark:bg-dark-secondary p-5 rounded-lg mb-2 print:mb-4 print:p-2 print:!bg-white mt-16 print:mt-0">
        <div class="flex-shrink-0 mb-5 md:mb-0 print:mb-0 md:mr-5 print:mr-5">
            <img :src="cvData.profilePicture" alt="Foto de perfil"
                 class="w-32 max-w-[150px] min-w-[80px] print:w-28 rounded-full object-cover border-2 border-primary print:!border-black shadow" />
            <input v-if="editMode" type="text" v-model="cvData.profilePicture" placeholder="URL foto de perfil" class="edit-input mt-2">
        </div>
        <div class="flex-1 text-center md:text-left print:text-left space-y-2">
            <h1 class="text-primary dark:text-dark-primary text-2xl md:text-3xl font-bold print:!text-black print:!mb-2">
                <span v-if="!editMode">{{ cvData.name }}</span>
                <input v-else type="text" v-model="cvData.name" class="edit-input text-2xl md:text-3xl font-bold">
            </h1>
            <p class="print:!text-black">
                <i class="fa-solid fa-envelope text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <a :href="'mailto:' + cvData.email" class="text-primary dark:text-dark-primary hover:underline print:!text-black">
                    <span v-if="!editMode">{{ cvData.email }}</span>
                    <input v-else type="email" v-model="cvData.email" class="edit-input inline-block w-auto">
                </a>
                <span v-if="editMode && emailError" class="text-red-500 text-xs ml-2">{{ emailError }}</span>
                |
                <i class="fa-solid fa-phone text-lightText dark:text-dark-lightText mx-2 print:!text-black"></i>
                <span v-if="!editMode">{{ cvData.phone }}</span>
                <input v-else type="tel" v-model="cvData.phone" class="edit-input inline-block w-auto">
                <a :href="'https://api.whatsapp.com/send?phone=' + cvData.phone.replace(/\\s+/g, '')" target="_blank"
                   class="text-primary dark:text-dark-primary hover:text-green-500 dark:hover:text-green-400 ml-2 print:hidden" title="WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
            </p>
            <p class="print:!text-black">
                <i class="fa-solid fa-globe text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <a :href="cvData.websiteUrl" target="_blank" class="text-primary dark:text-dark-primary hover:underline print:!text-black">
                    <span v-if="!editMode">{{ cvData.websiteDisplay }}</span>
                    <template v-else>
                        <input type="text" v-model="cvData.websiteDisplay" placeholder="Texto a mostrar" class="edit-input inline-block w-auto mr-1">
                        <input type="url" v-model="cvData.websiteUrl" placeholder="URL del website" class="edit-input inline-block w-auto">
                    </template>
                </a>
            </p>
            <p class="print:!text-black">
                <i class="fa-solid fa-map-location-dot text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <span v-if="!editMode">{{ cvData.address }}</span>
                <input v-else type="text" v-model="cvData.address" class="edit-input">
            </p>
            <p class="print:!text-black">
                <i class="fa-solid fa-cake-candles text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <span v-if="!editMode">{{ cvData.birthdate }}</span>
                <input v-else type="text" v-model="cvData.birthdate" class="edit-input">
            </p>
        </div>
    </header>
    `
};