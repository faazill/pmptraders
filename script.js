// Product Gallery Functionality
function changeImage(imageSrc, clickedElement) {
    document.getElementById('mainImage').src = imageSrc;
    
    // Remove active class from all grid images
    document.querySelectorAll('.grid-image').forEach(img => {
        img.classList.remove('active');
    });
    
    // Add active class to clicked element
    if (clickedElement) {
        clickedElement.classList.add('active');
    }
}

// Quantity Selector Functionality
function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    let currentQty = parseInt(quantityInput.value);
    let newQty = currentQty + delta;
    
    if (newQty < 1) newQty = 1;
    if (newQty > 10) newQty = 10;
    
    quantityInput.value = newQty;
    updateOrderSummary();
}

// Increase quantity function
function increaseQuantity() {
    changeQuantity(1);
}

// Decrease quantity function
function decreaseQuantity() {
    changeQuantity(-1);
}

// Update order summary based on quantity
function updateOrderSummary() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const basePrice = 6499; // Price from productpages/product1.html
    const subtotal = quantity * basePrice;
    const gst = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + gst;
    
    // Update order summary elements
    document.getElementById('order-qty').textContent = quantity;
    document.getElementById('order-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('order-gst').textContent = `₹${gst.toLocaleString('en-IN')}`;
    document.getElementById('order-total').textContent = `₹${total.toLocaleString('en-IN')}`;
}

// Update total price based on quantity
function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const basePrice = 4999;
    const total = quantity * basePrice;
    document.getElementById('totalPrice').textContent = total.toLocaleString('en-IN');
}

// Add to Cart Functionality
function addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const productName = 'AQUA Water Purifier';
    const price = 4999;
    const total = quantity * price;
    
    showNotification(`${quantity} ${productName} added to cart! Total: ₹${total.toLocaleString('en-IN')}`, 'success');
    
    const cartBtn = document.querySelector('.btn-primary');
    cartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
    cartBtn.style.background = '#34a853';
    
    setTimeout(() => {
        cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        cartBtn.style.background = '#1a73e8';
    }, 2000);
}

// Buy Now Functionality
function buyNow() {
    // Redirect to checkout page
    const quantity = document.getElementById('quantity') ? document.getElementById('quantity').value : 1;
    window.location.href = `checkout.html?quantity=${quantity}`;
}

// Get Quote Functionality
function getQuote() {
    // Open the wholesaler quote modal
    document.getElementById('quoteModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    document.getElementById('quoteModal').style.display = 'none';
    document.body.style.overflow = '';
}

// Close modal when clicking outside the modal-content
window.addEventListener('click', function(e) {
    const modal = document.getElementById('quoteModal');
    if (modal && e.target === modal) {
        closeQuoteModal();
    }
});

// Handle wholesaler quote form submission
async function submitWholesalerQuote(event) {
    event.preventDefault();
    
    console.log('Wholesaler quote form submission started...');
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get product name from the product page
    let productName = '';
    const productHeader = document.querySelector('.product-header h1');
    if (productHeader) {
        productName = productHeader.textContent.trim();
    }
    
    const quoteData = {
        businessName: formData.get('businessName'),
        contactPerson: formData.get('contactPerson'),
        mobile: formData.get('mobile'),
        email: formData.get('email'),
        gst: formData.get('gst'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: formData.get('pincode'),
        nature: formData.get('nature'),
        requirement: formData.get('requirement'),
        message: formData.get('message'),
        productName: productName,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        type: 'wholesaler_quote'
    };
    
    console.log('Wholesaler quote data to submit:', quoteData);
    
    // Get the submit button
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Check if Firebase is initialized
        if (!firebase || !firebase.database) {
            throw new Error('Firebase is not properly initialized');
        }
        
        // Check if database is available
        if (!database) {
            throw new Error('Realtime Database is not available');
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        console.log('Attempting to add wholesaler quote to Firebase...');
        
        // Store in Firebase
        const docRef = database.ref('inquiries').push(quoteData);
        
        console.log('Wholesaler quote document written with ID: ', docRef.key);
        
        // Show success state briefly
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        submitBtn.style.background = '#34a853';
        
        // Show success message
        showNotification('Thank you! Your wholesaler quote request has been submitted.', 'success');
        
        // Reset form
        form.reset();
        
        // Close modal after a short delay
        setTimeout(() => {
            closeQuoteModal();
        }, 1500);
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
        
    } catch (error) {
        console.error('Error submitting wholesaler quote form:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        
        let errorMessage = 'Error submitting quote request. Please try again.';
        
        // Provide more specific error messages
        if (error.code === 'permission-denied') {
            errorMessage = 'Permission denied. Please check Firebase security rules.';
        } else if (error.code === 'unavailable') {
            errorMessage = 'Service temporarily unavailable. Please try again later.';
        } else if (error.message.includes('Firebase is not properly initialized')) {
            errorMessage = 'System error. Please refresh the page and try again.';
        }
        
        showNotification(errorMessage, 'error');
        
        // Reset button state on error
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
    }
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Quantity input event listeners
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        // Handle direct input changes
        quantityInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
                value = 1;
            } else if (value > 10) {
                this.value = 10;
                value = 10;
            }
            updateOrderSummary();
        });
        
        // Handle blur event to ensure valid value
        quantityInput.addEventListener('blur', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
            updateOrderSummary();
        });
        
        // Initialize order summary on page load
        updateOrderSummary();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Smooth scrolling for buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const text = this.textContent.toLowerCase();
        if (text.includes('explore products') || text.includes('products')) {
            e.preventDefault();
            const productsSection = document.querySelector('#products');
            if (productsSection) {
                productsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else if (text.includes('contact us') || text.includes('contact')) {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Initialize EmailJS (only if properly configured)
(function() {
    try {
        if (typeof emailjs !== 'undefined' && "YOUR_PUBLIC_KEY" !== "YOUR_PUBLIC_KEY") {
            emailjs.init("YOUR_PUBLIC_KEY");
            console.log('EmailJS initialized successfully');
        } else {
            console.log('EmailJS not configured - using Formspree fallback');
        }
    } catch (error) {
        console.log('EmailJS initialization failed - using Formspree fallback');
    }
})();

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8G4a8Hlxd_B73OCUETboBB0nT7SBOSDo",
    authDomain: "aquavalor-c8e59.firebaseapp.com",
    databaseURL: "https://aquavalor-c8e59-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "aquavalor-c8e59",
    storageBucket: "aquavalor-c8e59.firebasestorage.app",
    messagingSenderId: "923902120858",
    appId: "1:923902120858:web:d516a29f32e2c61bed6023",
    measurementId: "G-TY5VK0M9YQ"
};

// Initialize Firebase
let database;
try {
    console.log('Initializing Firebase...');
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('Firebase initialized successfully');
    console.log('Realtime Database instance:', database);
} catch (error) {
    console.error('Error initializing Firebase:', error);
}

// Contact Form Submission
async function submitForm(event) {
    event.preventDefault();
    
    console.log('Form submission started...');
    
    const form = event.target;
    const formData = new FormData(form);
    
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        type: 'contact'
    };
    
    console.log('Contact data to submit:', contactData);
    
    // Get the submit button
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Check if Firebase is initialized
        if (!firebase || !firebase.database) {
            throw new Error('Firebase is not properly initialized');
        }
        
        // Check if database is available
        if (!database) {
            throw new Error('Realtime Database is not available');
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        console.log('Attempting to add document to Firebase...');
        
        // Store in Firebase
        const docRef = database.ref('inquiries').push(contactData);
        
        console.log('Document written with ID: ', docRef.key);
        
        // Show success state briefly
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        submitBtn.style.background = '#34a853';
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        
        let errorMessage = 'Error sending message. Please try again.';
        
        // Provide more specific error messages
        if (error.code === 'permission-denied') {
            errorMessage = 'Permission denied. Please check Firebase security rules.';
        } else if (error.code === 'unavailable') {
            errorMessage = 'Service temporarily unavailable. Please try again later.';
        } else if (error.message.includes('Firebase is not properly initialized')) {
            errorMessage = 'System error. Please refresh the page and try again.';
        }
        
        showNotification(errorMessage, 'error');
        
        // Reset button state on error
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
    }
}

// Add a global flag to track if quote modal was opened from hero section
let quoteFromHeroSection = false;

// Update hero section 'Get Quote' button to set the flag
// (Assuming the hero section button has a unique class or id, e.g., .hero-get-quote)
document.addEventListener('DOMContentLoaded', function() {
    const heroGetQuoteBtn = document.querySelector('.hero-slideshow .btn-secondary');
    if (heroGetQuoteBtn) {
        heroGetQuoteBtn.addEventListener('click', function() {
            quoteFromHeroSection = true;
        });
    }
});

// Quote Form Submission
async function submitQuoteForm(event) {
    event.preventDefault();
    
    console.log('Quote form submission started...');
    
    const form = event.target;
    const formData = new FormData(form);
    
    const quoteData = {
        companyName: formData.get('companyName'),
        contactPerson: formData.get('contactPerson'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        gstNumber: formData.get('gstNumber'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: formData.get('pincode'),
        quantity: formData.get('quantity'),
        additionalInfo: formData.get('additionalInfo'),
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        type: 'quote'
    };
    
    console.log('Quote data to submit:', quoteData);
    
    // Get the submit button
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Check if Firebase is initialized
        if (!firebase || !firebase.database) {
            throw new Error('Firebase is not properly initialized');
        }
        
        // Check if database is available
        if (!database) {
            throw new Error('Realtime Database is not available');
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Store in Firebase
        const docRef = database.ref('inquiries').push(quoteData);
        
        console.log('Quote document written with ID: ', docRef.key);
        
        // Show success state briefly
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        submitBtn.style.background = '#34a853';
        
        // Show success message only if not from hero section
        if (!quoteFromHeroSection) {
            showNotification('Quote request submitted successfully! We\'ll contact you soon.', 'success');
        }
        
        // Reset the flag after submission
        quoteFromHeroSection = false;
        
        // Reset form
        form.reset();
        
        // Close modal after a short delay
        setTimeout(() => {
            closeModal();
        }, 1500);
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
        
    } catch (error) {
        console.error('Error submitting quote form:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        
        let errorMessage = 'Error submitting quote request. Please try again.';
        
        // Provide more specific error messages
        if (error.code === 'permission-denied') {
            errorMessage = 'Permission denied. Please check Firebase security rules.';
        } else if (error.code === 'unavailable') {
            errorMessage = 'Service temporarily unavailable. Please try again later.';
        } else if (error.message.includes('Firebase is not properly initialized')) {
            errorMessage = 'System error. Please refresh the page and try again.';
        }
        
        showNotification(errorMessage, 'error');
        
        // Reset button state on error
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
    }
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize product functionality
document.addEventListener('DOMContentLoaded', () => {
    // Set first grid image as active by default
    const firstGridImage = document.querySelector('.grid-image');
    if (firstGridImage) {
        firstGridImage.classList.add('active');
    }
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .stat, .contact-item, .product-card, .section-header');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Initialize product functionality
    updateTotalPrice();
    
    // Quantity input change event
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
            updateTotalPrice();
        });
        
        quantityInput.addEventListener('input', function() {
            updateTotalPrice();
        });
    }
});

// Button click animations
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add loading animation for page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Parallax effect for slideshow
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const slideshow = document.querySelector('.hero-slideshow');
    if (slideshow) {
        const rate = scrolled * -0.3;
        slideshow.style.transform = `translateY(${rate}px)`;
    }
});

// Add some interactive hover effects
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Enhanced product card interactions
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        this.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = this.classList.contains('featured') 
            ? '0 8px 30px rgba(26, 115, 232, 0.15)' 
            : '0 4px 20px rgba(0, 0, 0, 0.08)';
    });
});

// Product action buttons functionality
document.querySelectorAll('.product-actions .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const action = this.textContent.toLowerCase();
        if (action.includes('learn more')) {
            showNotification('Product details page coming soon!', 'info');
        }
    });
});

// Slide button functionality
document.querySelectorAll('.slide-buttons .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const action = this.textContent.toLowerCase();
        if (action.includes('learn more')) {
            showNotification('Product details page coming soon!', 'info');
        } else if (action.includes('view catalog')) {
            showNotification('Product catalog coming soon!', 'info');
        }
    });
});

// Counter animation for stats - Chrome compatible
function animateCounter(element, target, duration = 2000) {
    if (!element || target <= 0) return;
    
    let start = 0;
    const increment = target / (duration / 16);
    let animationId;
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            animationId = requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        }
    }
    
    // Start the animation
    animationId = requestAnimationFrame(updateCounter);
    
    // Cleanup function
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
}

// Trigger counter animation when stats come into view - Improved for Chrome
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h3');
            if (statNumber && !statNumber.dataset.animated) {
                const target = parseInt(statNumber.textContent.replace(/\D/g, ''));
                if (target > 0) {
                    statNumber.dataset.animated = 'true';
                    statNumber.textContent = '0+';
                    setTimeout(() => {
                        animateCounter(statNumber, target);
                    }, 100);
                }
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
});

// Observe stats elements
document.addEventListener('DOMContentLoaded', () => {
    const statElements = document.querySelectorAll('.stat');
    statElements.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Add floating animation to badges
const productBadge = document.querySelector('.product-badge');
if (productBadge) {
    productBadge.style.animation = 'float 3s ease-in-out infinite';
}

// Add floating animation CSS
const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(floatingStyle);

// Add scroll-triggered animations for product badges
const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.badge').forEach(badge => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(20px)';
    badgeObserver.observe(badge);
});

// Add fadeInUp animation CSS
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInStyle);

// Slideshow functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
let slideInterval;

// Initialize slideshow
function initSlideshow() {
    if (slides.length > 0) {
        showSlide(currentSlideIndex);
        startAutoPlay();
    }
}

// Show specific slide
function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentSlideIndex = index;
}

// Change slide
function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    
    if (newIndex >= slides.length) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = slides.length - 1;
    }
    
    showSlide(newIndex);
    resetAutoPlay();
}

// Go to specific slide
function currentSlide(index) {
    showSlide(index - 1);
    resetAutoPlay();
}

// Auto-play functionality
function startAutoPlay() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function resetAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
}

// Pause auto-play on hover
document.querySelector('.slideshow-container').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

document.querySelector('.slideshow-container').addEventListener('mouseleave', () => {
    startAutoPlay();
});

// Initialize slideshow on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
});

// Keyboard navigation for slideshow
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slideshow-container').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.querySelector('.slideshow-container').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            changeSlide(1);
        } else {
            changeSlide(-1);
        }
    }
}

// Share Product Function
function shareProduct(productName, productDescription) {
    const productUrl = window.location.href;
    const shareText = `Check out this amazing ${productName} from Aquavalor! ${productDescription} ${productUrl}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: productName,
            text: `Check out this amazing ${productName} from Aquavalor! ${productDescription}`,
            url: productUrl
        }).then(() => {
            showNotification('Product shared successfully!', 'success');
        }).catch((error) => {
            console.log('Error sharing:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// Fallback sharing method
function fallbackShare(shareText) {
    // Try to copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Product link copied to clipboard!', 'success');
        }).catch(() => {
            // If clipboard fails, show the text in an alert
            alert('Share this link: ' + shareText);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Product link copied to clipboard!', 'success');
        } catch (err) {
            alert('Share this link: ' + shareText);
        }
        document.body.removeChild(textArea);
    }
}

// WhatsApp Functionality
function openWhatsApp() {
    const phoneNumber = '919946170056';
    const message = 'Hi! I\'m interested in your water purifier products. Can you please provide more information?';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show notification
    showNotification('Opening WhatsApp...', 'info');
}

// Quote Modal Functions
function openQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    const form = document.getElementById('quoteForm');
    if (form) {
        form.reset();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('quoteModal');
    if (event.target === modal) {
        closeQuoteModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeQuoteModal();
    }
});

// Sticky scroll-driven product card effect for desktop (true sticky version)
(function() {
  const products = [
    {
      img: 'assets/aqua-2090-RO+Alkaline.jpeg',
      alt: 'Aqua 2090 (White + Blue)',
      name: 'Aqua 2090 (White + Blue)',
      desc: 'Advanced RO + Alkaline water purifier with 8-stage filtration system',
      type: 'RO + Alkaline',
      qty: 'Available: 10 units',
      price: '₹7,999',
      original: '₹9,999',
      buy: 'productpages/product1.html',
      quote: 'productpages/product1.html'
    },
    {
      img: 'assets/AQUA Raga Green.jpeg',
      alt: 'Aqua Raga (Each 1 Colour)',
      name: 'Aqua Raga',
      desc: 'Compact RO + Alkaline purifier with smart LED indicators',
      type: 'RO + Alkaline',
      qty: 'Available: 5 units',
      price: '₹8,499',
      original: '₹10,499',
      buy: 'productpages/product2.html',
      quote: 'productpages/product2.html'
    },
    {
      img: 'assets/Mars White and blue.jpeg',
      alt: 'Mars (White + Blue)',
      name: 'Mars (White + Blue)',
      desc: 'Premium RO + Alkaline system with UV sterilization technology',
      type: 'RO + Alkaline',
      qty: 'Available: 5 units',
      price: '₹7,499',
      original: '₹9,499',
      buy: 'productpages/product3.html',
      quote: 'productpages/product3.html'
    },
    {
      img: 'assets/Nova Star RO under Sink without pressure Tank.jpeg',
      alt: 'Nova Star',
      name: 'Nova Star Without Pressure Tank',
      desc: 'Space-saving under-sink RO system with 6-stage filtration',
      type: 'RO',
      qty: 'Available: 3 units',
      price: '₹7,499',
      original: '₹8,999',
      buy: 'productpages/product4.html',
      quote: 'productpages/product4.html'
    },
    {
      img: 'assets/Nova Star RO under sink with pressure tank.jpeg',
      alt: 'Nova Star with Pressure Tank',
      name: 'Nova Star with Pressure Tank',
      desc: 'Under-sink RO system with pressure tank for continuous water supply',
      type: 'RO',
      qty: 'Available: 2 units',
      price: '₹11,499',
      original: '₹13,999',
      buy: 'productpages/product5.html',
      quote: 'productpages/product5.html'
    }
  ];

  function isDesktop() {
    return window.innerWidth >= 769;
  }
  var wrapper = document.querySelector('.products-scroll-wrapper');
  var stickyCard = document.querySelector('.sticky-product-card');
  if (!wrapper || !stickyCard) return;

  function renderProduct(index) {
    const p = products[index];
    stickyCard.style.opacity = 0;
    setTimeout(() => {
      stickyCard.innerHTML = `
        <div class="product-card featured">
          <div class="product-gallery">
            <div class="main-image">
              <img src="${p.img}" alt="${p.alt}">
            </div>
          </div>
          <div class="product-content">
            <h3>${p.name}</h3>
            <p class="product-description">${p.desc}</p>
            <div class="product-type">Type: ${p.type}</div>
            <div class="product-quantity">${p.qty}</div>
            <div class="product-price">
              <span class="current-price">${p.price}</span>
              <span class="original-price">${p.original}</span>
            </div>
            <div class="product-actions">
              <a href="${p.buy}" class="btn btn-primary btn-buy-now">Buy Now</a>
              <a href="${p.quote}" class="btn btn-secondary btn-quote">Get Quote</a>
            </div>
          </div>
        </div>
      `;
      stickyCard.style.opacity = 1;
    }, 200);
  }

  function setWrapperHeight() {
    if (!isDesktop()) {
      stickyCard.style.display = 'none';
      return;
    }
    stickyCard.style.display = 'block';
    var vh = window.innerHeight;
    wrapper.style.height = (vh * products.length) + 'px';
  }

  function onScroll() {
    if (!isDesktop()) return;
    var vh = window.innerHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var wrapperTop = wrapper.offsetTop;
    var index = Math.floor((scrollY - wrapperTop + vh/2) / vh);
    index = Math.max(0, Math.min(products.length - 1, index));
    renderProduct(index);
  }

  setWrapperHeight();
  renderProduct(0);
  onScroll();

  window.addEventListener('resize', function() {
    setWrapperHeight();
    onScroll();
  });
  window.addEventListener('scroll', onScroll);
})();

// Tab switching for product details (Description, Warranty & Support)
function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to the clicked button
    event.target.classList.add('active');
}

// Cookie Consent Functionality
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice && cookieConsent) {
        // Show cookie consent popup after a short delay
        setTimeout(() => {
            cookieConsent.style.display = 'block';
            setTimeout(() => {
                cookieConsent.classList.add('show');
            }, 100);
        }, 1000);
    }
    
    // Handle accept button click
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            hideCookieConsent();
        });
    }
    
    // Handle decline button click
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            hideCookieConsent();
            showNotification('Cookie preferences saved. Some features may be limited.', 'info');
        });
    }
}

function hideCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        cookieConsent.classList.remove('show');
        setTimeout(() => {
            cookieConsent.style.display = 'none';
        }, 300);
    }
}

function hasCookieConsent() {
    return localStorage.getItem('cookieConsent') === 'accepted';
}

// Initialize cookie consent when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCookieConsent();
});