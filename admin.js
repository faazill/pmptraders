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

// Global variables
let currentOrderType = 'prepaid';
let currentOrderKey = null;
let currentOrderData = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    loadOrderData();
    loadContactData();
    loadWholesaleData();
    
    // Set up delete confirmation handlers
    setupDeleteConfirmation();
});

// Tab switching functions
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load data based on tab
    if (tabName === 'orders') {
        loadOrderData();
    } else if (tabName === 'contact') {
        loadContactData();
    } else if (tabName === 'wholesale') {
        loadWholesaleData();
    }
}

function switchOrderTab(orderType) {
    currentOrderType = orderType;
    
    // Update order tab buttons
    document.querySelectorAll('.order-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-order-type="${orderType}"]`).classList.add('active');
    
    // Update table title
    const title = orderType === 'prepaid' ? 'Prepaid Orders' : 'COD Orders';
    document.getElementById('orderTableTitle').textContent = title;
    
    loadOrderData();
}

// Order Management Functions
function loadOrderData() {
    const tableBody = document.getElementById('ordersTableBody');
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">Loading orders...</td></tr>';
    
    const folderName = `${currentOrderType}_orders`;
    
    database.ref(folderName).once('value')
        .then((snapshot) => {
            const orders = [];
            snapshot.forEach((childSnapshot) => {
                const order = childSnapshot.val();
                order.key = childSnapshot.key;
                orders.push(order);
            });
            
            // Sort by date (newest first)
            orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            
            displayOrders(orders);
        })
        .catch((error) => {
            console.error('Error loading orders:', error);
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #dc3545; padding: 2rem;">Error loading orders</td></tr>';
        });
}

function displayOrders(orders) {
    const tableBody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No orders found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.orderId}</td>
            <td>${new Date(order.orderDate).toLocaleDateString('en-IN')}</td>
            <td>${order.firstName} ${order.lastName}</td>
            <td>${order.productName}</td>
            <td>${order.quantity}</td>
            <td>₹${order.total.toLocaleString('en-IN')}</td>
            <td><span class="status-badge status-${order.status || 'pending'}">${order.status || 'pending'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.key}')">
                    <i class="fas fa-eye"></i> View
                    </button>
                <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.key}')">
                    <i class="fas fa-trash"></i> Delete
                    </button>
            </td>
        </tr>
    `).join('');
}

function viewOrder(orderKey) {
    const folderName = `${currentOrderType}_orders`;
    
    database.ref(`${folderName}/${orderKey}`).once('value')
        .then((snapshot) => {
            const order = snapshot.val();
            currentOrderKey = orderKey;
            currentOrderData = order;
            
            displayOrderModal(order);
        })
        .catch((error) => {
            console.error('Error loading order details:', error);
            alert('Error loading order details');
        });
}

function displayOrderModal(order) {
    const modal = document.getElementById('orderModal');
    const modalTitle = document.getElementById('orderModalTitle');
    const modalBody = document.getElementById('orderModalBody');
    const statusSelect = document.getElementById('orderStatus');
    const trackingInput = document.getElementById('trackingId');
    
    modalTitle.textContent = `Order Details - ${order.orderId}`;
    
    // Set current status and tracking ID
    statusSelect.value = order.status || 'pending';
    trackingInput.value = order.trackingId || '';
    
            modalBody.innerHTML = `
        <div class="order-details-grid">
            <div class="detail-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Company:</strong> ${order.company || 'N/A'}</p>
                </div>
            
            <div class="detail-section">
                <h3>Delivery Address</h3>
                <p>${order.streetAddress}</p>
                <p>${order.city}, ${order.state} - ${order.pincode}</p>
                <p><strong>Country:</strong> ${order.country}</p>
                </div>
            
            <div class="detail-section">
                <h3>Order Information</h3>
                <p><strong>Product:</strong> ${order.productName}</p>
                <p><strong>Quantity:</strong> ${order.quantity}</p>
                <p><strong>Unit Price:</strong> ₹${order.unitPrice.toLocaleString('en-IN')}</p>
                <p><strong>Subtotal:</strong> ₹${order.subtotal.toLocaleString('en-IN')}</p>
                <p><strong>GST (18%):</strong> ₹${order.gst.toLocaleString('en-IN')}</p>
                <p><strong>Total:</strong> ₹${order.total.toLocaleString('en-IN')}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod === 'prepaid' ? 'Prepaid' : 'Cash on Delivery'}</p>
                </div>
            
            ${order.gstin ? `
                <div class="detail-section">
                    <h3>Business Information</h3>
                    <p><strong>GSTIN:</strong> ${order.gstin}</p>
                </div>
            ` : ''}
            
            ${order.orderNotes ? `
                <div class="detail-section">
                    <h3>Order Notes</h3>
                    <p>${order.orderNotes}</p>
                </div>
            ` : ''}
                </div>
            `;
    
    modal.style.display = 'flex';
}

function updateOrderStatus() {
    const status = document.getElementById('orderStatus').value;
    const trackingId = document.getElementById('trackingId').value.trim();
    
    if (!currentOrderKey || !currentOrderData) {
        alert('No order selected');
        return;
    }
    
    const folderName = `${currentOrderType}_orders`;
    const updates = {
        status: status,
        trackingId: trackingId,
        lastUpdated: new Date().toISOString()
    };
    
    database.ref(`${folderName}/${currentOrderKey}`).update(updates)
        .then(() => {
            alert('Order status updated successfully!');
            closeOrderModal();
            loadOrderData(); // Refresh the table
        })
        .catch((error) => {
            console.error('Error updating order status:', error);
            alert('Error updating order status');
        });
}

function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
    currentOrderKey = null;
    currentOrderData = null;
}

function deleteOrder(orderKey) {
    const folderName = `${currentOrderType}_orders`;
    
    document.getElementById('confirmDeleteMessage').textContent = 
        'Are you sure you want to delete this order? This action cannot be undone.';
    
    document.getElementById('confirmDeleteModal').style.display = 'flex';
    
    document.getElementById('confirmDeleteYes').onclick = function() {
        database.ref(`${folderName}/${orderKey}`).remove()
            .then(() => {
                alert('Order deleted successfully!');
                document.getElementById('confirmDeleteModal').style.display = 'none';
                loadOrderData();
            })
            .catch((error) => {
                console.error('Error deleting order:', error);
                alert('Error deleting order');
            });
    };
}

// Contact Form Functions
function loadContactData() {
    const tableBody = document.getElementById('contactTableBody');
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Loading contact forms...</td></tr>';
    
    database.ref('inquiries').once('value')
        .then((snapshot) => {
            const contacts = [];
            snapshot.forEach((childSnapshot) => {
                const contact = childSnapshot.val();
                if (contact.type === 'contact') {
                    contact.key = childSnapshot.key;
                    contacts.push(contact);
                }
            });
            
            contacts.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
            displayContacts(contacts);
        })
        .catch((error) => {
            console.error('Error loading contact forms:', error);
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #dc3545; padding: 2rem;">Error loading contact forms</td></tr>';
        });
}

function displayContacts(contacts) {
    const tableBody = document.getElementById('contactTableBody');
    
    if (contacts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No contact forms found</td></tr>';
            return;
        }
        
    tableBody.innerHTML = contacts.map(contact => `
        <tr>
            <td>${new Date(contact.date).toLocaleDateString('en-IN')}</td>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>${contact.subject}</td>
            <td>${contact.message.substring(0, 50)}${contact.message.length > 50 ? '...' : ''}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewContact('${contact.key}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteContact('${contact.key}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function viewContact(contactKey) {
    database.ref(`inquiries/${contactKey}`).once('value')
        .then((snapshot) => {
            const contact = snapshot.val();
            displayContactModal(contact);
        })
        .catch((error) => {
            console.error('Error loading contact details:', error);
        });
}

function displayContactModal(contact) {
    const modal = document.getElementById('contactModal');
    const modalBody = document.getElementById('contactModalBody');
    modalBody.innerHTML = `
        <div class="contact-details-modal">
            <h3>Contact Information</h3>
            <dl>
                <dt>Name</dt><dd>${contact.name || '-'}</dd>
                <dt>Email</dt><dd>${contact.email || '-'}</dd>
                <dt>Subject</dt><dd>${contact.subject || '-'}</dd>
                <dt>Message</dt><dd>${contact.message || '-'}</dd>
                <dt>Date</dt><dd>${contact.timestamp ? new Date(contact.timestamp).toLocaleString('en-IN') : '-'}</dd>
            </dl>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}

function deleteContact(contactKey) {
    document.getElementById('confirmDeleteMessage').textContent = 
        'Are you sure you want to delete this contact form submission?';
    
    document.getElementById('confirmDeleteModal').style.display = 'flex';
    
    document.getElementById('confirmDeleteYes').onclick = function() {
        database.ref(`inquiries/${contactKey}`).remove()
            .then(() => {
                alert('Contact form deleted successfully!');
                document.getElementById('confirmDeleteModal').style.display = 'none';
                loadContactData();
            })
            .catch((error) => {
                console.error('Error deleting contact form:', error);
                alert('Error deleting contact form');
            });
    };
}

// Wholesale Quote Functions
function loadWholesaleData() {
    const tableBody = document.getElementById('wholesaleTableBody');
    tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">Loading wholesale quotes...</td></tr>';
    
    database.ref('inquiries').once('value')
        .then((snapshot) => {
            const quotes = [];
            snapshot.forEach((childSnapshot) => {
                const quote = childSnapshot.val();
                if (quote.type === 'wholesaler_quote') {
                    quote.key = childSnapshot.key;
                    quotes.push(quote);
                }
            });
            
            quotes.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
            displayWholesaleQuotes(quotes);
        })
        .catch((error) => {
            console.error('Error loading wholesale quotes:', error);
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #dc3545; padding: 2rem;">Error loading wholesale quotes</td></tr>';
        });
}

function displayWholesaleQuotes(quotes) {
    const tableBody = document.getElementById('wholesaleTableBody');
    
    if (quotes.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No wholesale quotes found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = quotes.map(quote => `
        <tr>
            <td>${new Date(quote.date).toLocaleDateString('en-IN')}</td>
            <td>${quote.businessName}</td>
            <td>${quote.contactPerson}</td>
            <td>${quote.email}</td>
            <td>${quote.mobile}</td>
            <td>${quote.gst || 'N/A'}</td>
            <td>${quote.address.substring(0, 30)}${quote.address.length > 30 ? '...' : ''}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewWholesale('${quote.key}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteWholesale('${quote.key}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function viewWholesale(quoteKey) {
    database.ref(`inquiries/${quoteKey}`).once('value')
        .then((snapshot) => {
            const quote = snapshot.val();
            displayWholesaleModal(quote);
        })
        .catch((error) => {
            console.error('Error loading wholesale quote details:', error);
            alert('Error loading wholesale quote details');
        });
}

function displayWholesaleModal(quote) {
    const modal = document.getElementById('wholesaleModal');
    const modalBody = document.getElementById('wholesaleModalBody');
    modalBody.innerHTML = `
        <div class="wholesale-details-modal">
            <h3>Business Information</h3>
            <dl>
                <dt>Business Name</dt><dd>${quote.businessName || '-'}</dd>
                <dt>Contact Person</dt><dd>${quote.contactPerson || '-'}</dd>
                <dt>Mobile</dt><dd>${quote.mobile || '-'}</dd>
                <dt>Email</dt><dd>${quote.email || '-'}</dd>
                <dt>GST</dt><dd>${quote.gst || '-'}</dd>
                <dt>Address</dt><dd>${quote.address || '-'}</dd>
                <dt>City</dt><dd>${quote.city || '-'}</dd>
                <dt>State</dt><dd>${quote.state || '-'}</dd>
                <dt>Pincode</dt><dd>${quote.pincode || '-'}</dd>
                <dt>Nature of Business</dt><dd>${quote.nature || '-'}</dd>
                <dt>Requirement</dt><dd>${quote.requirement || '-'}</dd>
                <dt>Message/Comments</dt><dd>${quote.message || '-'}</dd>
                <dt>Date</dt><dd>${quote.timestamp ? new Date(quote.timestamp).toLocaleString('en-IN') : '-'}</dd>
            </dl>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeWholesaleModal() {
    document.getElementById('wholesaleModal').style.display = 'none';
}

function deleteWholesale(quoteKey) {
    document.getElementById('confirmDeleteMessage').textContent = 
        'Are you sure you want to delete this wholesale quote request?';
    
    document.getElementById('confirmDeleteModal').style.display = 'flex';
    
    document.getElementById('confirmDeleteYes').onclick = function() {
        database.ref(`inquiries/${quoteKey}`).remove()
            .then(() => {
                alert('Wholesale quote deleted successfully!');
                document.getElementById('confirmDeleteModal').style.display = 'none';
                loadWholesaleData();
            })
            .catch((error) => {
                console.error('Error deleting wholesale quote:', error);
                alert('Error deleting wholesale quote');
            });
    };
}

// Utility Functions
function refreshOrderData() {
    loadOrderData();
}

function refreshContactData() {
    loadContactData();
}

function refreshWholesaleData() {
    loadWholesaleData();
}

function setupDeleteConfirmation() {
    document.getElementById('confirmDeleteNo').onclick = function() {
        document.getElementById('confirmDeleteModal').style.display = 'none';
    };

// Close modal when clicking outside
    document.getElementById('confirmDeleteModal').onclick = function(event) {
        if (event.target === this) {
            this.style.display = 'none';
        }
    };
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const orderModal = document.getElementById('orderModal');
    const contactModal = document.getElementById('contactModal');
    const wholesaleModal = document.getElementById('wholesaleModal');
    
    if (event.target === orderModal) {
        closeOrderModal();
    }
    if (event.target === contactModal) {
        closeContactModal();
    }
    if (event.target === wholesaleModal) {
        closeWholesaleModal();
    }
}); 