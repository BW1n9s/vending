document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('.fullpage-section');
    let currentLang = 'en';

    // Navigation and scrolling
    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Basic navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Responsive navigation
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navMenu.contains(event.target) || menuToggle.contains(event.target);
        if (!isClickInside && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
        }
    });

    // Header visibility
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, false);

    // Language functionality
    const langButtons = document.querySelectorAll('.lang-btn');

    function setLanguage(lang) {
        if (!isLanguageComplete(lang)) {
            alert(`The ${lang.toUpperCase()} version is still being built. Falling back to English.`);
            lang = 'en';
        }

        currentLang = lang;
        document.querySelectorAll('[data-text]').forEach(el => {
            const key = el.dataset.text;
            el.textContent = getNestedValue(messages[lang], key) || 'Still building';
        });

        populateServices();
        populateAbout();
    }

    function isLanguageComplete(lang) {
        const requiredKeys = ['nav', 'hero', 'services', 'about', 'contact'];
        return messages[lang] && requiredKeys.every(key => messages[lang].hasOwnProperty(key));
    }

    function getNestedValue(obj, key) {
        const value = key.split('.').reduce((p, c) => p && p[c], obj);
        return value !== undefined ? value : 'Still building';
    }

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            setLanguage(this.dataset.lang);
        });
    });

    // Services section
    function populateServices() {
        const serviceList = document.getElementById('serviceList');
        serviceList.innerHTML = '';
        const services = messages[currentLang].services.cards || [];
        
        services.forEach((service, index) => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.innerHTML = `
                <h3><span class="service-number">${(index + 1).toString().padStart(2, '0')}</span>${service.title || 'Service Title'}</h3>
                <p>${service.description || 'Service description'}</p>
            `;
            serviceList.appendChild(serviceItem);
        });
    }

    // About section
    function populateAbout() {
        const aboutText = document.getElementById('aboutText');
        const aboutDescription = messages[currentLang].about.description || ['About us'];
        aboutText.innerHTML = aboutDescription.map(p => `<p>${p}</p>`).join('');
    }

    // Form validation
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                alert('Form submitted successfully!');
                form.reset();
            }
        });
    }

    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        if (name && name.value.trim() === '') {
            setError(name, messages[currentLang].contact.form.nameError || 'Name is required');
            isValid = false;
        } else if (name) {
            setSuccess(name);
        }

        if (email && email.value.trim() === '') {
            setError(email, messages[currentLang].contact.form.emailError || 'Email is required');
            isValid = false;
        } else if (email && !isValidEmail(email.value)) {
            setError(email, messages[currentLang].contact.form.emailInvalidError || 'Provide a valid email address');
            isValid = false;
        } else if (email) {
            setSuccess(email);
        }

        if (message && message.value.trim() === '') {
            setError(message, messages[currentLang].contact.form.messageError || 'Message is required');
            isValid = false;
        } else if (message) {
            setSuccess(message);
        }

        return isValid;
    }

    function setError(element, message) {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        if (!errorDisplay) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error';
            errorElement.innerText = message;
            inputControl.appendChild(errorElement);
        } else {
            errorDisplay.innerText = message;
        }

        inputControl.classList.add('error');
        inputControl.classList.remove('success');
    }

    function setSuccess(element) {
        const inputControl = element.parentElement;
        const errorDisplay = inputControl.querySelector('.error');

        if (errorDisplay) {
            errorDisplay.remove();
        }

        inputControl.classList.add('success');
        inputControl.classList.remove('error');
    }

    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Language selector functionality
    const languageButton = document.getElementById('languageButton');
    const languageList = document.getElementById('languageList');

    languageButton.addEventListener('click', function() {
        languageList.classList.toggle('show');
    });

    document.addEventListener('click', function(event) {
        if (!languageSelector.contains(event.target)) {
            languageList.classList.remove('show');
        }
    });

    // Initialize
    setLanguage('en');
});