// Advanced form handling
class FormHandler {
    constructor() {
        this.initializeForms();
    }
    
    initializeForms() {
        // Contact form
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            this.setupContactForm(contactForm);
        }
        
        // Newsletter forms
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            this.setupNewsletterForm(form);
        });
        
        // Search form
        const searchForm = document.querySelector('#search-form');
        if (searchForm) {
            this.setupSearchForm(searchForm);
        }
    }
    
    setupContactForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                await this.submitContactForm(form, submitButton);
            }
        });
    }
    
    setupNewsletterForm(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const submitButton = form.querySelector('button[type="submit"]');
            
            if (this.validateEmail(email)) {
                await this.submitNewsletterForm(email, submitButton);
            } else {
                this.showFieldError(form.querySelector('input[type="email"]'), 'Email tidak valid');
            }
        });
    }
    
    setupSearchForm(form) {
        const searchInput = form.querySelector('input[type="search"]');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const isRequired = field.hasAttribute('required');
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required validation
        if (isRequired && !value) {
            this.showFieldError(field, 'Field ini wajib diisi');
            return false;
        }
        
        // Type-specific validation
        if (value) {
            switch (type) {
                case 'email':
                    if (!this.validateEmail(value)) {
                        this.showFieldError(field, 'Format email tidak valid');
                        return false;
                    }
                    break;
                    
                case 'tel':
                    if (!this.validatePhone(value)) {
                        this.showFieldError(field, 'Format nomor telepon tidak valid');
                        return false;
                    }
                    break;
                    
                case 'url':
                    if (!this.validateURL(value)) {
                        this.showFieldError(field, 'Format URL tidak valid');
                        return false;
                    }
                    break;
            }
        }
        
        // Length validation
        const minLength = field.getAttribute('minlength');
        const maxLength = field.getAttribute('maxlength');
        
        if (minLength && value.length < parseInt(minLength)) {
            this.showFieldError(field, `Minimal ${minLength} karakter`);
            return false;
        }
        
        if (maxLength && value.length > parseInt(maxLength)) {
            this.showFieldError(field, `Maksimal ${maxLength} karakter`);
            return false;
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('border-red-500', 'bg-red-50');
        
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error text-red-500 text-sm mt-1';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        field.classList.remove('border-red-500', 'bg-red-50');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    async submitContactForm(form, submitButton) {
        const formData = new FormData(form);
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            const response = await this.mockAPICall(formData);
            
            if (response.success) {
                this.showSuccessMessage(form, 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
                form.reset();
            } else {
                throw new Error(response.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            this.showErrorMessage(form, error.message || 'Terjadi kesalahan saat mengirim pesan');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    
    async submitNewsletterForm(email, submitButton) {
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        
        try {
            // Simulate API call
            const response = await this.mockAPICall({ email });
            
            if (response.success) {
                submitButton.innerHTML = '<i class="fas fa-check mr-2"></i>Berhasil!';
                submitButton.classList.add('bg-green-500');
                
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.classList.remove('bg-green-500');
                    submitButton.disabled = false;
                }, 3000);
            } else {
                throw new Error(response.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            showNotification(error.message, 'error');
        }
    }
    
    performSearch(query) {
        if (query.length < 2) return;
        
        // Simulate search functionality
        console.log('Searching for:', query);
        
        // You can implement actual search logic here
        // For example, filter products, show search results, etc.
    }
    
    showSuccessMessage(form, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4';
        messageElement.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        form.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    showErrorMessage(form, message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4';
        messageElement.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        form.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    // Mock API call for demonstration
    async mockAPICall(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success response
                resolve({ success: true, message: 'Success' });
            }, 1500);
        });
    }
    
    // Validation helpers
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validatePhone(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return re.test(phone);
    }
    
    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

// Initialize form handler
document.addEventListener('DOMContentLoaded', function() {
    new FormHandler();
});
