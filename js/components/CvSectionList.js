// js/components/CvSectionList.js
const CvSectionList = {
    // ... (props, emits, methods sin cambios en definición, solo en template y placeholders)
    props: ['title', 'items', 'editMode', 'itemStructureType'],
    emits: ['update:items'],
    methods: {
        addItem() {
            const newItems = [...this.items];
            let newItem;
            if (this.itemStructureType === 'education') {
                newItem = { id: Utils.generateId(), title: '', institution: '', details: '' }; // Campos vacíos
            } else if (this.itemStructureType === 'experience') {
                newItem = { id: Utils.generateId(), title: '', role: '', description: '' }; // Campos vacíos
            } else { 
                newItem = { id: Utils.generateId(), text: '' }; // Campo vacío
            }
            newItems.push(newItem);
            this.$emit('update:items', newItems);
        },
        removeItem(index) {
            const newItems = [...this.items];
            newItems.splice(index, 1);
            this.$emit('update:items', newItems);
        },
        updateItem(index, field, value) { 
            const newItems = [...this.items];
            newItems[index] = { ...newItems[index], [field]: value };
            this.$emit('update:items', newItems);
        },
        updateSimpleItem(index, value) { 
             const newItems = [...this.items];
             newItems[index] = { ...newItems[index], text: value }; 
             this.$emit('update:items', newItems);
        }
    },
    template: `
        <div>
            <h2 class="text-primary dark:text-dark-primary text-xl font-bold my-4">{{ title }}</h2>
            <ul class="space-y-2 mb-6">
                <li v-for="(item, index) in items" :key="item.id || index"
                    class="hover:bg-secondary dark:hover:bg-dark-secondary hover:pl-2 transition-all duration-300 p-1 rounded border border-transparent dark:border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    
                    <template v-if="itemStructureType === 'simple'">
                        <span v-if="!editMode" v-html="item.text"></span>
                        <template v-else>
                            <textarea :value="item.text" @input="updateSimpleItem(index, $event.target.value)" 
                                      placeholder="Ej: HTML, CSS, JavaScript (puedes usar <strong> para resaltar)" 
                                      class="edit-textarea" rows="2"></textarea>
                            <div class="text-right">
                                <i class="fa-solid fa-trash delete-item-btn" @click="removeItem(index)"></i>
                            </div>
                        </template>
                    </template>

                    <template v-if="itemStructureType === 'education'">
                        <div v-if="!editMode">
                            <b>{{ item.title }}</b> <span v-if="item.institution">({{ item.institution }})</span>
                            <p v-if="item.details" class="text-sm text-lightText dark:text-dark-lightText pl-2" v-html="item.details.replace(/\\n/g, '<br />')"></p>
                        </div>
                        <div v-else class="space-y-1">
                            <input type="text" :value="item.title" @input="updateItem(index, 'title', $event.target.value)" placeholder="Título o Carrera" class="edit-input">
                            <input type="text" :value="item.institution" @input="updateItem(index, 'institution', $event.target.value)" placeholder="Institución Educativa" class="edit-input">
                            <textarea :value="item.details" @input="updateItem(index, 'details', $event.target.value)" placeholder="Detalles adicionales, fechas, logros (opcional)" class="edit-textarea" rows="2"></textarea>
                            <div class="text-right">
                                <i class="fa-solid fa-trash delete-item-btn" @click="removeItem(index)"></i>
                            </div>
                        </div>
                    </template>

                    <template v-if="itemStructureType === 'experience'">
                         <div v-if="!editMode">
                            <b>{{ item.title }}</b> <span v-if="item.role">- {{ item.role }}</span>
                            <p v-if="item.description" class="text-sm text-lightText dark:text-dark-lightText pl-2" v-html="item.description.replace(/\\n/g, '<br />')"></p>
                        </div>
                        <div v-else class="space-y-1">
                            <input type="text" :value="item.title" @input="updateItem(index, 'title', $event.target.value)" placeholder="Empresa o Proyecto" class="edit-input">
                            <input type="text" :value="item.role" @input="updateItem(index, 'role', $event.target.value)" placeholder="Rol o Cargo desempeñado" class="edit-input">
                            <textarea :value="item.description" @input="updateItem(index, 'description', $event.target.value)" placeholder="Descripción de tareas, responsabilidades y logros" class="edit-textarea" rows="3"></textarea>
                            <div class="text-right">
                                <i class="fa-solid fa-trash delete-item-btn" @click="removeItem(index)"></i>
                            </div>
                        </div>
                    </template>
                </li>
                <li v-if="editMode">
                    <button @click="addItem" class="add-item-btn">
                        <i class="fa-solid fa-plus mr-1"></i> Añadir {{ title.singular || title.slice(0,-1).toLowerCase() }} <!-- Asume que title es plural -->
                    </button>
                </li>
            </ul>
        </div>
    `
};