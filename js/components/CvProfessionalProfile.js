// js/components/CvProfessionalProfile.js
const CvProfessionalProfile = {
    props: ['profile', 'editMode'],
    emits: ['update:profile'],
    template: `
        <div>
            <h2 class="text-primary dark:text-dark-primary text-xl font-bold mb-4 print:!text-black">Perfil Profesional</h2>
            <p v-if="!editMode" class="mb-6 text-customText dark:text-dark-customText print:!text-black"
               v-html="profile.replace(/\\n/g, '<br />')"></p>
            <template v-else>
                <label for="professionalProfileTextarea" class="sr-only">Descripción del Perfil Profesional</label>
                <textarea id="professionalProfileTextarea"
                          :value="profile" @input="$emit('update:profile', $event.target.value)"
                          placeholder="Describe brevemente tu experiencia, especialidades y objetivos profesionales..."
                          class="edit-textarea mb-2"></textarea>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">
                    Puedes usar saltos de línea simples; se convertirán en <br> en la vista.
                </p>
            </template>
        </div>
    `
};