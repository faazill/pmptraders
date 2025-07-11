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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Google Analytics Tracking Functions
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

function trackPurchase(orderId, productName, productPrice, quantity = 1, paymentMethod = 'cod') {
    trackEvent('purchase', {
        transaction_id: orderId,
        value: productPrice * quantity,
        currency: 'INR',
        payment_method: paymentMethod,
        items: [{
            item_id: productName.toLowerCase().replace(/\s+/g, '_'),
            item_name: productName,
            price: productPrice,
            quantity: quantity
        }]
    });
}

function trackBeginCheckout(productName, productPrice, quantity = 1) {
    trackEvent('begin_checkout', {
        currency: 'INR',
        value: productPrice * quantity,
        items: [{
            item_id: productName.toLowerCase().replace(/\s+/g, '_'),
            item_name: productName,
            price: productPrice,
            quantity: quantity
        }]
    });
}

function trackAddToCart(productName, productPrice, quantity = 1) {
    trackEvent('add_to_cart', {
        currency: 'INR',
        value: productPrice * quantity,
        items: [{
            item_id: productName.toLowerCase().replace(/\s+/g, '_'),
            item_name: productName,
            price: productPrice,
            quantity: quantity
        }]
    });
}

// Razorpay Test Key (safe to expose on frontend for test mode)
const RAZORPAY_KEY_ID = 'rzp_test_IF47t2qC8TS3qz';

document.addEventListener('DOMContentLoaded', function() {
    // Test Razorpay integration
    console.log('Razorpay available:', typeof Razorpay !== 'undefined');
    if (typeof Razorpay !== 'undefined') {
        console.log('Razorpay SDK loaded successfully');
    } else {
        console.error('Razorpay SDK not loaded');
    }

    const checkoutForm = document.getElementById('checkout-form');
    const qtySpan = document.getElementById('order-qty');
    const subtotalSpan = document.getElementById('order-subtotal');
    const totalSpan = document.getElementById('order-total');
    const gstSpan = document.getElementById('order-gst');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const paymentInputs = document.querySelectorAll('.payment-method input[type="radio"]');
    const gstRate = 0.18;

    // Coupon functionality
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-code');
    let appliedCoupon = null;
    let discountAmount = 0;

    // Function to get URL parameters
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Get quantity from URL parameter
    const urlQuantity = getUrlParameter('quantity');
    const initialQuantity = urlQuantity ? parseInt(urlQuantity) : 1;
    
    // Validate quantity range
    const validQuantity = Math.max(1, Math.min(10, initialQuantity));

    // Product data mapping
    const products = {
        'product1': {
            name: 'AQUA 2090 RO+Alkaline Water Purifier – 10L (Premium Metallic Blue)',
            price: 7999,
            image: 'assets/aqua-2090-RO+Alkaline.jpeg'
        },
        'product2': {
            name: 'Aqua Raga RO+Alkaline Water Purifier (Green)',
            price: 8499,
            image: 'assets/AQUA Raga Green.jpeg'
        },
        'product3': {
            name: 'Mars RO+Alkaline Water Purifier (White + Blue)',
            price: 7499,
            image: 'assets/Mars White and blue.jpeg'
        },
        'product4': {
            name: 'Nova Star RO Water Purifier (Without Pressure Tank)',
            price: 7499,
            image: 'assets/Nova Star RO under Sink without pressure Tank.jpeg'
        },
        'product5': {
            name: 'Nova Star RO Water Purifier (With Pressure Tank)',
            price: 11499,
            image: 'assets/Nova Star RO under sink with pressure tank.jpeg'
        }
    };

    // Get product from URL parameter
    const urlProduct = getUrlParameter('product');
    const selectedProduct = products[urlProduct] || products['product1'];

    // Update order summary with selected product
    const orderProductImg = document.querySelector('.order-product-img');
    const orderProductName = document.querySelector('.order-product-name');
    const orderProductPrice = document.querySelector('.order-product-price');

    if (orderProductImg) orderProductImg.src = selectedProduct.image;
    if (orderProductName) orderProductName.textContent = selectedProduct.name;
    if (orderProductPrice) orderProductPrice.textContent = `₹${selectedProduct.price.toLocaleString('en-IN')}`;

    // Use selected product price for calculations
    const productBasePrice = selectedProduct.price;

    // Add quantity controls to order summary
    if (qtySpan) {
        const qtyControls = document.createElement('div');
        qtyControls.className = 'quantity-section';
        qtyControls.innerHTML = `
            <div class="quantity-controls">
                <button type="button" id="qty-minus" class="quantity-btn">-</button>
                <input type="number" id="qty-input" class="quantity-input" value="${validQuantity}" min="1" max="10">
                <button type="button" id="qty-plus" class="quantity-btn">+</button>
            </div>
        `;
        qtySpan.parentNode.appendChild(qtyControls);
        qtySpan.style.display = 'none';

        const qtyInput = document.getElementById('qty-input');
        const minusBtn = document.getElementById('qty-minus');
        const plusBtn = document.getElementById('qty-plus');

        minusBtn.onclick = function() {
            let val = parseInt(qtyInput.value);
            if (val > 1) {
                qtyInput.value = val - 1;
                updateSummary();
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        };
        plusBtn.onclick = function() {
            let val = parseInt(qtyInput.value);
            if (val < 10) {
                qtyInput.value = val + 1;
                updateSummary();
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        };
        qtyInput.oninput = function() {
            let val = parseInt(qtyInput.value);
            if (isNaN(val) || val < 1) qtyInput.value = 1;
            if (val > 10) qtyInput.value = 10;
            updateSummary();
        };

        // Update button states based on quantity
        function updateButtonStates() {
            const currentVal = parseInt(qtyInput.value);
            minusBtn.disabled = currentVal <= 1;
            plusBtn.disabled = currentVal >= 10;
        }

        // Call updateButtonStates initially and after each change
        updateButtonStates();
        qtyInput.addEventListener('input', updateButtonStates);
        minusBtn.addEventListener('click', updateButtonStates);
        plusBtn.addEventListener('click', updateButtonStates);
    }

    function updateSummary() {
        const qty = document.getElementById('qty-input') ? parseInt(document.getElementById('qty-input').value) : 1;
        const subtotal = qty * productBasePrice;
        // GST is included in price, so do not add it
        const total = subtotal - discountAmount;
        
        if (qtySpan) qtySpan.textContent = qty;
        if (subtotalSpan) subtotalSpan.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        // GST row is now just a message in HTML, no value to update
        if (totalSpan) totalSpan.textContent = `₹${total.toLocaleString('en-IN')}`;
        
        // Update discount display
        const discountRow = document.getElementById('discount-row');
        const discountSpan = document.getElementById('order-discount');
        if (discountRow && discountSpan) {
            if (discountAmount > 0) {
                discountRow.style.display = 'flex';
                discountSpan.textContent = `-₹${discountAmount.toLocaleString('en-IN')}`;
            } else {
                discountRow.style.display = 'none';
            }
        }
    }
    updateSummary();

    // Payment method sync
    paymentInputs.forEach(input => {
        input.addEventListener('change', function() {
            paymentInputs.forEach(i => i.parentElement.classList.remove('selected'));
            if (this.checked) this.parentElement.classList.add('selected');
        });
    });

    // Form validation and order confirmation
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('Form submitted!');
            
            // Collect form data
            const formData = new FormData(checkoutForm);
            
            // Get payment method from radio buttons outside the form
            const selectedPaymentMethod = document.querySelector('input[name="payment"]:checked');
            const paymentMethod = selectedPaymentMethod ? selectedPaymentMethod.value : 'prepaid';
            
            // Debug: Check all form data
            console.log('All form data:');
            for (let [key, value] of formData.entries()) {
                console.log(key + ': ' + value);
            }
            
            const currentQuantity = document.getElementById('qty-input') ? parseInt(document.getElementById('qty-input').value) : validQuantity;
            const subtotal = currentQuantity * productBasePrice;
            // GST is included in price, so do not add it
            const total = subtotal - discountAmount;
            
            console.log('Payment method from radio buttons:', paymentMethod);
            console.log('Payment method type:', typeof paymentMethod);
            console.log('Payment method length:', paymentMethod ? paymentMethod.length : 'null');
            
            const orderData = {
                // Customer Information
                firstName: formData.get('first-name'),
                lastName: formData.get('last-name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                
                // Address Information
                country: formData.get('country'),
                streetAddress: formData.get('street-address'),
                city: formData.get('city'),
                state: formData.get('state'),
                pincode: formData.get('pincode'),
                
                // Business Information
                gstin: formData.get('gstin'),
                couponCode: formData.get('coupon-code'),
                orderNotes: formData.get('order-notes'),
                
                // Order Details
                productName: selectedProduct.name,
                productId: urlProduct,
                productImage: selectedProduct.image,
                productPrice: selectedProduct.price,
                quantity: currentQuantity,
                subtotal: subtotal,
                total: total,
                discount: discountAmount,
                paymentMethod: paymentMethod,
                orderDate: new Date().toISOString(),
                orderId: generateOrderId()
            };

            // Handle different payment methods
            console.log('Payment method selected:', paymentMethod);
            console.log('Order data prepared:', orderData);
            
            // Track begin checkout with Google Analytics
            trackBeginCheckout(orderData.productName, orderData.productPrice, orderData.quantity);
            
            if (paymentMethod === 'prepaid') {
                console.log('Initializing Razorpay for prepaid payment...');
                // Initialize Razorpay for prepaid payment
                initializeRazorpay(orderData);
            } else {
                console.log('Processing COD order...');
                // Handle COD order directly to Firebase (no payment needed)
                saveOrderToFirebase(orderData);
            }
        });
    }

    function generateOrderId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }

    function initializeRazorpay(orderData) {
        console.log('Initializing Razorpay with order data:', orderData);
        console.log('Payment method:', orderData.paymentMethod);
        console.log('Total amount:', orderData.total);
        
        // Razorpay configuration
        const options = {
            key: RAZORPAY_KEY_ID, // Use the test key constant
            amount: orderData.total * 100, // Amount in paise
            currency: 'INR',
            name: 'Aquavalor',
            description: orderData.productName,
            image: 'assets/logo.png',
            order_id: '', // This will be generated by your backend
            handler: function(response) {
                console.log('Payment successful:', response);
                // Payment successful
                orderData.paymentId = response.razorpay_payment_id;
                orderData.paymentStatus = 'completed';
                saveOrderToFirebase(orderData);
                showPaymentSuccess();
            },
            prefill: {
                name: `${orderData.firstName} ${orderData.lastName}`,
                email: orderData.email,
                contact: orderData.phone
            },
            notes: {
                address: `${orderData.streetAddress}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}`,
                order_id: orderData.orderId
            },
            theme: {
                color: '#1a73e8'
            },
            modal: {
                ondismiss: function() {
                    console.log('Payment modal dismissed');
                    // Payment cancelled or failed
                    showPaymentCancelled();
                }
            }
        };

        console.log('Razorpay options:', options);

        try {
            // Create Razorpay instance
            const rzp = new Razorpay(options);
            console.log('Razorpay instance created:', rzp);
            rzp.open();
            console.log('Razorpay modal opened');
        } catch (error) {
            console.error('Error creating Razorpay instance:', error);
            showErrorNotification('Payment gateway error. Please try again.');
        }
    }

    function showPaymentSuccess() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(32, 33, 36, 0.6)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 9999;
        overlay.innerHTML = `
            <div style="background:#fff;padding:2rem;border-radius:8px;border:1px solid #dadce0;text-align:center;max-width:400px;margin:1rem;">
                <div style="font-size:2rem;color:#34a853;margin-bottom:1rem;"><i class='fas fa-check-circle'></i></div>
                <h2 style="margin:0 0 0.5rem 0;font-size:1.125rem;font-weight:500;color:#202124;font-family:'Google Sans',sans-serif;">Payment Successful!</h2>
                <p style="color:#5f6368;font-size:0.875rem;margin:0 0 1rem 0;font-family:'Google Sans',sans-serif;">Your order has been placed successfully. Thank you for shopping with us!</p>
                <button class="btn btn-secondary" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; transition: background-color 0.2s;" onclick="window.location.href='productpages/product1.html'">Continue Shopping</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add hover effect to button
        const continueBtn = overlay.querySelector('button');
        continueBtn.onmouseenter = function() {
            this.style.background = '#1557b0';
        };
        continueBtn.onmouseleave = function() {
            this.style.background = '#1a73e8';
        };
    }

    function showPaymentCancelled() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(32, 33, 36, 0.6)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 9999;
        overlay.innerHTML = `
            <div style="background:#fff;padding:2rem;border-radius:8px;border:1px solid #dadce0;text-align:center;max-width:400px;margin:1rem;">
                <div style="font-size:2rem;color:#fbbc04;margin-bottom:1rem;"><i class='fas fa-exclamation-triangle'></i></div>
                <h2 style="margin:0 0 0.5rem 0;font-size:1.125rem;font-weight:500;color:#202124;font-family:'Google Sans',sans-serif;">Payment Cancelled</h2>
                <p style="color:#5f6368;font-size:0.875rem;margin:0 0 1rem 0;font-family:'Google Sans',sans-serif;">Your payment was cancelled. You can try again or choose a different payment method.</p>
                <button style="margin-top:1rem;padding:0.75rem 1.5rem;font-size:0.875rem;border-radius:4px;background:#1a73e8;color:#fff;font-weight:500;border:none;cursor:pointer;font-family:'Google Sans',sans-serif;transition:background-color 0.2s;" onclick="this.closest('div[style]').parentNode.remove()">Try Again</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Add hover effect to button
        const tryAgainBtn = overlay.querySelector('button');
        tryAgainBtn.onmouseenter = function() {
            this.style.background = '#1557b0';
        };
        tryAgainBtn.onmouseleave = function() {
            this.style.background = '#1a73e8';
        };
    }

    function saveOrderToFirebase(orderData) {
        const submitBtn = document.getElementById('place-order-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        try {
            // Determine the folder based on payment method
            const folderName = orderData.paymentMethod === 'prepaid' ? 'prepaid_orders' : 'cod_orders';
            
            // Save to Firebase
            const orderRef = database.ref(`${folderName}`).push(orderData);
            
            console.log('Order saved successfully with ID:', orderRef.key);
            
            // Track purchase with Google Analytics
            trackPurchase(orderData.orderId, orderData.productName, orderData.productPrice, orderData.quantity, orderData.paymentMethod);
            
            // Show appropriate confirmation based on payment method
            if (orderData.paymentMethod === 'prepaid') {
                // For prepaid orders, success message is already shown by showPaymentSuccess()
                // Reset form
                checkoutForm.reset();
                updateSummary();
            } else {
                // For COD orders, show order confirmation
                showOrderConfirmation(orderData.orderId);
                // Reset form
                checkoutForm.reset();
                updateSummary();
            }
            
        } catch (error) {
            console.error('Error saving order:', error);
            showErrorNotification('Failed to save order. Please try again.');
        } finally {
            // Reset button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    }

    function showOrderConfirmation(orderId) {
        // Get form data for delivery address
        const formData = new FormData(checkoutForm);
        const deliveryAddress = {
            street: formData.get('streetAddress') || '',
            city: formData.get('city') || '',
            state: formData.get('state') || '',
            pincode: formData.get('pincode') || ''
        };

        const overlay = document.createElement('div');
        overlay.className = 'order-confirmation-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, rgba(26, 115, 232, 0.95) 0%, rgba(66, 133, 244, 0.95) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            animation: fadeIn 0.5s ease-out forwards;
        `;

        overlay.innerHTML = `
            <div class="confirmation-card" style="
                background: #ffffff;
                border-radius: 24px;
                padding: 3rem 2rem;
                text-align: center;
                max-width: 500px;
                margin: 1rem;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                transform: translateY(30px) scale(0.9);
                animation: slideUp 0.6s ease-out 0.2s forwards;
                position: relative;
                overflow: hidden;
            ">
                <!-- Success Icon with Animation -->
                <div class="success-icon" style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #34a853, #0f9d58);
                    border-radius: 50%;
                    margin: 0 auto 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    color: white;
                    animation: bounceIn 0.8s ease-out 0.4s both;
                    position: relative;
                ">
                    <i class="fas fa-check" style="animation: checkmark 0.6s ease-out 1s both;"></i>
                </div>

                <!-- Order Confirmed Title -->
                <h1 style="
                    font-size: 2rem;
                    font-weight: 600;
                    color: #202124;
                    margin: 0 0 1rem 0;
                    font-family: 'Google Sans', sans-serif;
                    animation: fadeInUp 0.6s ease-out 0.6s both;
                ">Order Confirmed!</h1>

                <!-- Order ID -->
                <p style="
                    color: #1a73e8;
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0 0 2rem 0;
                    font-family: 'Google Sans', sans-serif;
                    animation: fadeInUp 0.6s ease-out 0.8s both;
                ">Order ID: ${orderId}</p>

                <!-- Delivery Information -->
                <div class="delivery-info" style="
                    background: #f8f9fa;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin: 0 0 2rem 0;
                    border-left: 4px solid #34a853;
                    animation: fadeInUp 0.6s ease-out 1s both;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        margin-bottom: 1rem;
                        color: #34a853;
                        font-weight: 600;
                        font-size: 1.1rem;
                    ">
                        <i class="fas fa-truck" style="font-size: 1.2rem;"></i>
                        <span>Delivery Information</span>
                    </div>
                    
                    <p style="
                        color: #5f6368;
                        font-size: 0.95rem;
                        margin: 0 0 0.5rem 0;
                        font-weight: 500;
                    ">Your order will be delivered in <strong style="color: #1a73e8;">3-5 business days</strong></p>
                    
                    <div style="
                        background: #e8f0fe;
                        border-radius: 8px;
                        padding: 1rem;
                        margin-top: 1rem;
                        text-align: left;
                    ">
                        <p style="
                            color: #1a73e8;
                            font-weight: 600;
                            margin: 0 0 0.5rem 0;
                            font-size: 0.9rem;
                        ">Delivery Address:</p>
                        <p style="
                            color: #5f6368;
                            margin: 0;
                            font-size: 0.85rem;
                            line-height: 1.4;
                        ">
                            ${deliveryAddress.street}<br>
                            ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.pincode}
                        </p>
                    </div>
                </div>

                <!-- Continue Shopping Button -->
                <button class="continue-shopping-btn" style="
                    background: linear-gradient(135deg, #1a73e8, #4285f4);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'Google Sans', sans-serif;
                    transition: all 0.3s ease;
                    animation: fadeInUp 0.6s ease-out 1.2s both;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin: 0 auto;
                    min-width: 200px;
                " onclick="window.location.href='index.html'">
                    <i class="fas fa-shopping-bag"></i>
                    Continue Shopping
                </button>

                <!-- Decorative Elements -->
                <div style="
                    position: absolute;
                    top: -20px;
                    right: -20px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, rgba(52, 168, 83, 0.1), rgba(15, 157, 88, 0.1));
                    border-radius: 50%;
                    animation: float 3s ease-in-out infinite;
                "></div>
                <div style="
                    position: absolute;
                    bottom: -15px;
                    left: -15px;
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, rgba(26, 115, 232, 0.1), rgba(66, 133, 244, 0.1));
                    border-radius: 50%;
                    animation: float 3s ease-in-out infinite reverse;
                "></div>
            </div>
        `;

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { 
                    transform: translateY(30px) scale(0.9);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes bounceIn {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2);
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes checkmark {
                0% {
                    transform: scale(0) rotate(-45deg);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2) rotate(-45deg);
                }
                100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
            }
            
            .continue-shopping-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(26, 115, 232, 0.3);
            }
            
            .continue-shopping-btn:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(overlay);

        // Add hover effects
        const continueBtn = overlay.querySelector('.continue-shopping-btn');
        continueBtn.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #1557b0, #1a73e8)';
        });
        continueBtn.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #1a73e8, #4285f4)';
        });

        // Close on overlay click (optional)
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
        });
    }

    function showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '8px';
        notification.style.color = '#fff';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '10000';
        notification.style.fontFamily = "'Google Sans', sans-serif";
        notification.style.maxWidth = '400px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        
        notification.style.background = '#dc3545';
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', function() {
            const couponCode = couponInput.value.trim().toUpperCase();
            
            if (!couponCode) {
                showNotification('Please enter a coupon code.', 'error');
                return;
            }
            
            // Simple coupon validation (you can expand this)
            if (couponCode === 'WELCOME10') {
                discountAmount = Math.round(subtotal * 0.10); // 10% discount
                appliedCoupon = couponCode;
                showNotification('Coupon applied! 10% discount added.', 'success');
                updateSummary();
                applyCouponBtn.textContent = 'Applied';
                applyCouponBtn.disabled = true;
                couponInput.disabled = true;
            } else if (couponCode === 'SAVE500') {
                discountAmount = 500; // Fixed ₹500 discount
                appliedCoupon = couponCode;
                showNotification('Coupon applied! ₹500 discount added.', 'success');
                updateSummary();
                applyCouponBtn.textContent = 'Applied';
                applyCouponBtn.disabled = true;
                couponInput.disabled = true;
            } else {
                showNotification('Invalid coupon code. Please try again.', 'error');
            }
        });
    }

    // Global test function for Razorpay
    window.testRazorpay = function() {
        console.log('Testing Razorpay integration...');
        const testOptions = {
            key: RAZORPAY_KEY_ID, // Use the test key constant
            amount: 10000, // ₹100
            currency: 'INR',
            name: 'Aquavalor Test',
            description: 'Test Payment',
            handler: function(response) {
                console.log('Test payment successful:', response);
                alert('Test payment successful!');
            },
            prefill: {
                name: 'Test User',
                email: 'test@example.com',
                contact: '9999999999'
            },
            theme: {
                color: '#1a73e8'
            }
        };
        
        try {
            const rzp = new Razorpay(testOptions);
            rzp.open();
        } catch (error) {
            console.error('Test Razorpay error:', error);
            alert('Razorpay test failed: ' + error.message);
        }
    };
}); 