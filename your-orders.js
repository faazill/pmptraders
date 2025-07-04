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

document.addEventListener('DOMContentLoaded', function() {
    const trackOrderForm = document.getElementById('trackOrderForm');
    const searchOrdersBtn = document.getElementById('searchOrdersBtn');
    const ordersSection = document.getElementById('ordersSection');
    const ordersList = document.getElementById('ordersList');

    // Hamburger Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Handle form submission (Search Orders)
    trackOrderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const mobile = document.getElementById('mobile').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!mobile) {
            showNotification('Please enter your mobile number.', 'error');
            return;
        }
        
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            showNotification('Please enter a valid 10-digit mobile number.', 'error');
            return;
        }
        
        if (!email) {
            showNotification('Please enter your email address.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        searchOrders(mobile, email);
    });

    function searchOrders(mobile, email) {
        // Show loading state
        searchOrdersBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        searchOrdersBtn.disabled = true;
        
        const allOrders = [];
        
        // Search in prepaid orders
        database.ref('prepaid_orders').once('value')
            .then((snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const order = childSnapshot.val();
                    if (order.phone === mobile && order.email === email) {
                        order.key = childSnapshot.key;
                        order.paymentType = 'prepaid';
                        allOrders.push(order);
                    }
                });
                
                // Search in COD orders
                return database.ref('cod_orders').once('value');
            })
            .then((snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const order = childSnapshot.val();
                    if (order.phone === mobile && order.email === email) {
                        order.key = childSnapshot.key;
                        order.paymentType = 'cod';
                        allOrders.push(order);
                    }
                });
                
                // Display results
                displayOrders(allOrders);
            })
            .catch((error) => {
                console.error('Error searching orders:', error);
                showNotification('Error searching orders. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button
                searchOrdersBtn.innerHTML = '<i class="fas fa-search"></i> Search Orders';
                searchOrdersBtn.disabled = false;
            });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function displayOrders(orders) {
        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-search"></i>
                    <h3>No Orders Found</h3>
                    <p>No orders found with the provided mobile number and email address.</p>
                    <p style="font-size: 0.875rem; color: #5f6368; margin-top: 0.5rem;">
                        Please ensure you're using the same mobile number and email address that was used during order placement.
                    </p>
                </div>
            `;
        } else {
            // Sort orders by date (newest first)
            orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            
            ordersList.innerHTML = orders.map(order => createOrderCard(order)).join('');
        }
        
        ordersSection.style.display = 'block';
    }

    function createOrderCard(order) {
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const status = order.status || 'pending';
        const trackingId = order.trackingId || 'Not available';
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">${order.orderId}</div>
                        <div class="order-date">${orderDate}</div>
                    </div>
                    <div class="order-status status-${status}">${status}</div>
                </div>
                
                <div class="order-details">
                    <div class="detail-group">
                        <div class="detail-label">Customer Name</div>
                        <div class="detail-value">${order.firstName} ${order.lastName}</div>
                    </div>
                    
                    <div class="detail-group">
                        <div class="detail-label">Payment Method</div>
                        <div class="detail-value">${order.paymentType === 'prepaid' ? 'Prepaid' : 'Cash on Delivery'}</div>
                    </div>
                    
                    <div class="detail-group">
                        <div class="detail-label">Product</div>
                        <div class="detail-value">${order.productName}</div>
                    </div>
                    
                    <div class="detail-group">
                        <div class="detail-label">Quantity</div>
                        <div class="detail-value">${order.quantity}</div>
                    </div>
                    
                    <div class="detail-group">
                        <div class="detail-label">Subtotal</div>
                        <div class="detail-value">₹${order.subtotal !== undefined && order.subtotal !== null ? order.subtotal.toLocaleString('en-IN') : '-'}</div>
                    </div>
                    
                    <div class="detail-group">
                        <div class="detail-label">GST (18%)</div>
                        <div class="detail-value">₹${order.gst !== undefined && order.gst !== null ? order.gst.toLocaleString('en-IN') : '-'}</div>
                    </div>
                    
                    <div class="detail-group">
                        <div class="detail-label">Total Amount</div>
                        <div class="detail-value">₹${order.total !== undefined && order.total !== null ? order.total.toLocaleString('en-IN') : '-'}</div>
                    </div>
                    
                    <div class="detail-group">
                        <div class="detail-label">Delivery Address</div>
                        <div class="detail-value">${order.streetAddress}, ${order.city}, ${order.state} - ${order.pincode}</div>
                    </div>
                </div>
                
                ${status === 'dispatched' || status === 'delivered' ? `
                    <div class="tracking-info">
                        <div class="detail-label">Tracking ID</div>
                        <div class="tracking-id">${trackingId}</div>
                    </div>
                ` : ''}
                
                ${order.orderNotes ? `
                    <div class="detail-group" style="margin-top: 1rem;">
                        <div class="detail-label">Order Notes</div>
                        <div class="detail-value">${order.orderNotes}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    function showNotification(message, type = 'info') {
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
        
        if (type === 'error') {
            notification.style.background = '#dc3545';
        } else if (type === 'success') {
            notification.style.background = '#28a745';
        } else {
            notification.style.background = '#17a2b8';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}); 