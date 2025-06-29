// Product Gallery Functionality
function changeImage(thumbnail, imageSrc) {
    document.getElementById('mainProductImage').src = imageSrc;
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

// Quantity Selector Functionality
function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    let currentQty = parseInt(quantityInput.value);
    let newQty = currentQty + delta;
    
    if (newQty < 1) newQty = 1;
    if (newQty > 10) newQty = 10;
    
    quantityInput.value = newQty;
    updateTotalPrice();
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
    const quantity = parseInt(document.getElementById('quantity').value);
    const productName = 'AQUA Water Purifier';
    const price = 4999;
    const total = quantity * price;
    
    showNotification(`Redirecting to checkout for ${quantity} ${productName}. Total: ₹${total.toLocaleString('en-IN')}`, 'info');
    
    setTimeout(() => {
        showNotification('Checkout page coming soon!', 'info');
    }, 1500);
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

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#34a853' : type === 'error' ? '#ea4335' : '#1a73e8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
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
        } else if (action.includes('get quote')) {
            showNotification('Quote request sent! We\'ll contact you soon.', 'success');
        }
    });
});

// Slide button functionality
document.querySelectorAll('.slide-buttons .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const action = this.textContent.toLowerCase();
        if (action.includes('learn more')) {
            showNotification('Product details page coming soon!', 'info');
        } else if (action.includes('get quote')) {
            showNotification('Quote request sent! We\'ll contact you soon.', 'success');
        } else if (action.includes('view catalog')) {
            showNotification('Product catalog coming soon!', 'info');
        }
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h3');
            const target = parseInt(statNumber.textContent);
            animateCounter(statNumber, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
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