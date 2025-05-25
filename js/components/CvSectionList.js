// js/components/CvSectionList.js
const CvSectionList = {
  props: ['title', 'items', 'editMode', 'itemStructureType'],
  emits: ['update:items'],
  methods: {
    updateSimpleItem(index, value) {
      const updatedItem = { ...this.items[index], text: value };
      this.$emit('update:items', [
        ...this.items.slice(0, index),
        updatedItem,
        ...this.items.slice(index + 1),
      ]);
    },
    updateItem(index, key, value) {
      const updatedItem = { ...this.items[index], [key]: value };
      this.$emit('update:items', [
        ...this.items.slice(0, index),
        updatedItem,
        ...this.items.slice(index + 1),
      ]);
    },
    removeItem(index) {
      this.$emit(
        'update:items',
        this.items.filter((_, i) => i !== index)
      );
    },
    addItem() {
      const newItem = {};

      if (this.itemStructureType === 'simple') {
        newItem.text = '';
      } else if (this.itemStructureType === 'education') {
        newItem.title = '';
        newItem.institution = '';
        newItem.details = '';
      } else if (this.itemStructureType === 'experience') {
        newItem.title = '';
        newItem.role = '';
        newItem.description = '';
      }

      newItem.id = Utils.generateId(); // Generar un ID único para el nuevo elemento
      this.$emit('update:items', [...this.items, newItem]);
    },
  },
  template: `
        <div>
            <h2 class="text-primary dark:text-dark-primary text-xl font-bold my-4">{{ title }}</h2>
            <ul class="space-y-4 mb-6">
                <li v-for="(item, index) in items" :key="item.id || index"
                    class="hover:bg-secondary dark:hover:bg-dark-secondary transition-all duration-300 p-2 rounded border border-transparent dark:border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    
                    <template v-if="itemStructureType === 'simple'">
                        <span v-if="!editMode" v-html="item.text"></span>
                        <template v-else>
                            <label :for="'simpleItemText-' + item.id" class="sr-only">Texto del ítem de {{ title }}</label>
                            <textarea :id="'simpleItemText-' + item.id"
                                      :value="item.text" @input="updateSimpleItem(index, $event.target.value)" 
                                      placeholder="Ej: HTML, CSS (puedes usar <strong>)" 
                                      class="edit-textarea" rows="2"></textarea>
                            <div class="text-right mt-1">
                                <i class="fa-solid fa-trash delete-item-btn" @click="removeItem(index)" role="button" :aria-label="'Eliminar ítem ' + (index + 1) + ' de ' + title"></i>
                            </div>
                        </template>
                    </template>

                    <template v-if="itemStructureType === 'education'">
                        <div v-if="!editMode">
                            <b>{{ item.title }}</b> <span v-if="item.institution">({{ item.institution }})</span>
                            <p v-if="item.details" class="text-sm text-lightText dark:text-dark-lightText pl-2" v-html="item.details.replace(/\\n/g, '<br />')"></p>
                        </div>
                        <div v-else class="space-y-2">
                            <div>
                                <label :for="'eduTitle-' + item.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título o Carrera</label>
                                <input :id="'eduTitle-' + item.id" type="text" :value="item.title" @input="updateItem(index, 'title', $event.target.value)" placeholder="Ej: Ingeniería en Sistemas" class="edit-input">
                            </div>
                            <div>
                                <label :for="'eduInstitution-' + item.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institución Educativa</label>
                                <input :id="'eduInstitution-' + item.id" type="text" :value="item.institution" @input="updateItem(index, 'institution', $event.target.value)" placeholder="Ej: Universidad Nacional" class="edit-input">
                            </div>
                            <div>
                                <label :for="'eduDetails-' + item.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Detalles (opcional)</label>
                                <textarea :id="'eduDetails-' + item.id" :value="item.details" @input="updateItem(index, 'details', $event.target.value)" placeholder="Fechas, logros, especialización..." class="edit-textarea" rows="2"></textarea>
                            </div>
                            <div class="text-right mt-1">
                                <i class="fa-solid fa-trash delete-item-btn" @click="removeItem(index)" role="button" :aria-label="'Eliminar ' + item.title + ' de ' + title"></i>
                            </div>
                        </div>
                    </template>

                    <template v-if="itemStructureType === 'experience'">
                         <div v-if="!editMode">
                            <b>{{ item.title }}</b> <span v-if="item.role">- {{ item.role }}</span>
                            <p v-if="item.description" class="text-sm text-lightText dark:text-dark-lightText pl-2" v-html="item.description.replace(/\\n/g, '<br />')"></p>
                        </div>
                        <div v-else class="space-y-2">
                            <div>
                                <label :for="'expTitle-' + item.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Empresa o Proyecto</label>
                                <input :id="'expTitle-' + item.id" type="text" :value="item.title" @input="updateItem(index, 'title', $event.target.value)" placeholder="Ej: Nombre de Empresa S.A." class="edit-input">
                            </div>
                            <div>
                                <label :for="'expRole-' + item.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol o Cargo</label>
                                <input :id="'expRole-' + item.id" type="text" :value="item.role" @input="updateItem(index, 'role', $event.target.value)" placeholder="Ej: Desarrollador Web Full Stack" class="edit-input">
                            </div>
                            <div>
                                <label :for="'expDesc-' + item.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                <textarea :id="'expDesc-' + item.id" :value="item.description" @input="updateItem(index, 'description', $event.target.value)" placeholder="Responsabilidades, tecnologías usadas, logros clave..." class="edit-textarea" rows="3"></textarea>
                            </div>
                            <div class="text-right mt-1">
                                <i class="fa-solid fa-trash delete-item-btn" @click="removeItem(index)" role="button" :aria-label="'Eliminar ' + item.title + ' de ' + title"></i>
                            </div>
                        </div>
                    </template>
                </li>
                <li v-if="editMode">
                    <button @click="addItem" class="add-item-btn">
                        <i class="fa-solid fa-plus mr-1"></i> Añadir {{ title.singular || title.slice(0,-1).toLowerCase() }}
                    </button>
                </li>
            </ul>
        </div>
    `,
};
