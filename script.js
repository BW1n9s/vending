document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('.fullpage-section');
    let currentLang = 'en';

    // Basic navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Header visibility
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScrollTop > lastScrollTop && currentScrollTop > 50) {
            header.classList.add('hidden');
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, false);

    // Navigation and scrolling
    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const headerShown = !header.classList.contains('hidden');
            const headerHeight = headerShown ? 0 : header.offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Language functionality
    const languageToggle = document.getElementById('languageToggle');

    languageToggle.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'cn' : 'en';
        updateContent();
    });

    function updateContent() {
        document.querySelectorAll('[data-text]').forEach(el => {
            const key = el.dataset.text;
            el.textContent = getNestedValue(messages[currentLang], key) || key;
        });
        populateServices();
        populateAbout();
        populateReviews();
        updateSocialLinks();
    }

    function getNestedValue(obj, key) {
        return key.split('.').reduce((p, c) => p && p[c], obj);
    }

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

    // Reviews section

    // Rolling Reviews Functionality
    const reviewsList = document.getElementById('reviewsList');
    const prevButton = document.getElementById('prevReview');
    const nextButton = document.getElementById('nextReview');
    let currentIndex = 0;

    function populateReviews() {
        reviewsList.innerHTML = '';
        const reviews = messages[currentLang].reviews.items || [];
        if (currentIndex === 0) {
            prevButton.style.display = 'none';
        } else {
                prevButton.style.display = 'block';
            }

        if (currentIndex === reviewsList.children.length - 1) {
            nextButton.style.display = 'none';
        } else {
            nextButton.style.display = 'block';
        }

        reviews.forEach((review, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="review-content">"${review.content}"</div>
                <div class="review-author">${review.name}</div>
                <div class="review-company">from ${review.company}</div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            `;
            reviewsList.appendChild(reviewItem);
        });

        updateReviewsDisplay();
    }

    function updateReviewsDisplay() {
        const itemWidth = reviewsList.children[0].offsetWidth;
        reviewsList.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        if (currentIndex === 0) {
            prevButton.style.display = 'none';
        } else {
                prevButton.style.display = 'block';
            }

        if (currentIndex === reviewsList.children.length - 1) {
            nextButton.style.display = 'none';
        } else {
            nextButton.style.display = 'block';
        }
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateReviewsDisplay();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < reviewsList.children.length - 1) {
            currentIndex++;
            updateReviewsDisplay();
        }
    });

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

    // Contact Tab and Overlay Functionality
    const contactTab = document.getElementById('contactTab');
    const contactOverlay = document.getElementById('contactOverlay');
    const closeOverlay = document.getElementById('closeOverlay');

    contactTab.addEventListener('click', function() {
        contactOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when overlay is open
    });

    closeOverlay.addEventListener('click', function() {
        contactOverlay.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close overlay if clicking outside the content
    contactOverlay.addEventListener('click', function(e) {
        if (e.target === contactOverlay) {
            contactOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Social Media Links
    const links = {
        socialLinks: {
            facebook: "https://www.facebook.com/",
            twitter: "https://twitter.com/",
            instagram: "https://www.instagram.com/",
            linkedin: "https://www.linkedin.com/",
            youtube: "https://youtube.com/",
        }
    }

    function updateSocialLinks() {
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            const social = icon.getAttribute('data-social');
            if (social && links.socialLinks.hasOwnProperty(social)) {
                icon.href = links.socialLinks[social];
                icon.style.display = 'flex'; // Show the icon if it has a valid link
            } else {
                console.warn(`Social link for ${social} is not defined in the config.`);
                icon.style.display = 'none'; // Hide the icon if there's no valid link
            }
        });
    }



    // Initialize
    updateContent();
});