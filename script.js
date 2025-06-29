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
function submitWholesalerQuote(event) {
    event.preventDefault();
    // You can add AJAX/email logic here. For now, just show a notification.
    showNotification('Thank you! Your wholesaler quote request has been submitted.', 'success');
    closeQuoteModal();
    document.getElementById('wholesalerQuoteForm').reset();
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

// Contact Form Submission with direct email service
function submitForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    // Get form values
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Validate form
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Method 1: Try EmailJS (if properly configured)
    if (typeof emailjs !== 'undefined' && emailjs.init && "YOUR_PUBLIC_KEY" !== "YOUR_PUBLIC_KEY") {
        const templateParams = {
            to_email: 'taskaelite@gmail.com',
            from_name: name,
            from_email: email,
            subject: subject,
            message: message,
            reply_to: email
        };
        
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            }, function(error) {
                console.log('FAILED...', error);
                // Fallback to Formspree
                sendViaFormspree(formData, submitBtn, originalText);
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    } else {
        // Method 2: Use Formspree (free service)
        sendViaFormspree(formData, submitBtn, originalText);
    }
}

// Fallback email service using Formspree
function sendViaFormspree(formData, submitBtn, originalText) {
    // Create a temporary form for Formspree
    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = 'https://formspree.io/f/YOUR_FORMSPREE_ID'; // You'll need to replace this
    tempForm.style.display = 'none';
    
    // Add form data
    formData.forEach((value, key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        tempForm.appendChild(input);
    });
    
    // Add recipient email
    const recipientInput = document.createElement('input');
    recipientInput.type = 'hidden';
    recipientInput.name = '_replyto';
    recipientInput.value = 'taskaelite@gmail.com';
    tempForm.appendChild(recipientInput);
    
    // Add subject
    const subjectInput = document.createElement('input');
    subjectInput.type = 'hidden';
    subjectInput.name = '_subject';
    subjectInput.value = `New Contact Form Submission: ${formData.get('subject')}`;
    tempForm.appendChild(subjectInput);
    
    // Submit the form
    document.body.appendChild(tempForm);
    
    fetch(tempForm.action, {
        method: 'POST',
        body: new FormData(tempForm),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            document.getElementById('contactForm').reset();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    })
    .finally(() => {
        // Clean up
        document.body.removeChild(tempForm);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
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

// Share Product Functionality
function shareProduct() {
    const productName = 'AQUA Water Purifier';
    const productUrl = window.location.href;
    const shareText = `Check out this amazing ${productName} from PMP Traders! ${productUrl}`;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: productName,
            text: `Check out this amazing ${productName} from PMP Traders!`,
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

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#34a853';
        case 'error': return '#ea4335';
        case 'warning': return '#fbbc04';
        default: return '#1a73e8';
    }
}

// Enhanced About Section Animations
function initAboutAnimations() {
    const aboutSection = document.querySelector('.about');
    const stats = document.querySelectorAll('.stat');
    const aboutText = document.querySelector('.about-text');
    
    if (!aboutSection) return;
    
    // Create intersection observer for about section
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate text elements
                const textElements = entry.target.querySelectorAll('h2, p');
                textElements.forEach((el, index) => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 200);
                });
                
                // Animate stats with staggered delay
                stats.forEach((stat, index) => {
                    stat.style.opacity = '0';
                    stat.style.transform = 'translateY(50px) scale(0.8)';
                    setTimeout(() => {
                        stat.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0) scale(1)';
                    }, 800 + (index * 300));
                });
                
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    aboutObserver.observe(aboutSection);
    
    // Add interactive hover effects for stats
    stats.forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: radial-gradient(circle, rgba(26, 115, 232, 0.2) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: rippleExpand 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
        
        // Add magnetic effect
        stat.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });
        
        stat.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleExpand {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize about animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAboutAnimations();
    
    // Existing code...
    const statElements = document.querySelectorAll('.stat');
    statElements.forEach(stat => {
        statsObserver.observe(stat);
    });
});

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