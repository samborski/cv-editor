// js/components/CvProfessionalProfile.js
const CvProfessionalProfile = {
    props: ['profile', 'editMode'],
    emits: ['update:profile'],
    template: `
        <div>
            <h2 class="text-primary dark:text-dark-primary text-xl font-bold mb-4 print:!text-black">Perfil Profesional</h2>
            <p v-if="!editMode" class="mb-6 text-customText dark:text-dark-customText print:!text-black"
               v-html="profile.replace(/\\n/g, '<br />')"></p>
            <textarea v-else :value="profile" @input="$emit('update:profile', $event.target.value)"
                      class="edit-textarea mb-6"></textarea>
        </div>
    `
};