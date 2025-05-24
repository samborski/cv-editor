// js/utils.js
const Utils = {
    encodeUrl(url) {
        return encodeURIComponent(url);
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Más utilidades (ej. para generar IDs únicos si es necesario para listas)
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
};