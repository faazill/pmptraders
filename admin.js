// Firebase Configuration (same as main site)
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
let allInquiries = [];
let currentInquiry = null;

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadInquiries();
    setupRealTimeUpdates();
});

// Load inquiries from Firebase
async function loadInquiries() {
    try {
        showLoading();
        
        const snapshot = await database.ref('inquiries').once('value');
        const data = snapshot.val();
        
        if (data) {
            allInquiries = Object.keys(data).map(key => ({
                id: key,
                ...data[key],
                timestamp: data[key].timestamp ? new Date(data[key].timestamp) : new Date()
            }));
        } else {
            allInquiries = [];
        }
        
        // Sort by timestamp (newest first)
        allInquiries.sort((a, b) => b.timestamp - a.timestamp);
        
        renderInquiriesTable();
        hideLoading();
        
    } catch (error) {
        console.error('Error loading inquiries:', error);
        showNotification('Error loading inquiries. Please refresh the page.', 'error');
        hideLoading();
    }
}

// Setup real-time updates
function setupRealTimeUpdates() {
    database.ref('inquiries').on('value', (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
            allInquiries = Object.keys(data).map(key => ({
                id: key,
                ...data[key],
                timestamp: data[key].timestamp ? new Date(data[key].timestamp) : new Date()
            }));
        } else {
            allInquiries = [];
        }
        
        // Sort by timestamp (newest first)
        allInquiries.sort((a, b) => b.timestamp - a.timestamp);
        
        renderInquiriesTable();
    }, (error) => {
        console.error('Error setting up real-time updates:', error);
    });
}

// Render inquiries table
function renderInquiriesTable() {
    const tbody = document.getElementById('inquiriesTableBody');
    tbody.innerHTML = '';
    
    if (allInquiries.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #5f6368;">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    No responses found
                </td>
            </tr>
        `;
        return;
    }
    
    allInquiries.forEach(inquiry => {
        // Get the appropriate name/company field based on type
        let nameField = 'N/A';
        let phoneField = 'N/A';
        let subjectField = 'N/A';
        
        if (inquiry.type === 'contact') {
            nameField = inquiry.name || 'N/A';
            phoneField = 'N/A';
            subjectField = inquiry.subject || 'N/A';
        } else if (inquiry.type === 'quote') {
            nameField = inquiry.companyName || 'N/A';
            phoneField = inquiry.phone || 'N/A';
            subjectField = 'Quote Request';
        } else if (inquiry.type === 'wholesaler_quote') {
            nameField = inquiry.businessName || 'N/A';
            phoneField = inquiry.mobile || 'N/A';
            subjectField = 'Wholesaler Quote';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(inquiry.timestamp)}</td>
            <td><span class="inquiry-type ${inquiry.type}">${inquiry.type}</span></td>
            <td>${nameField}</td>
            <td>${inquiry.email}</td>
            <td>${phoneField}</td>
            <td>${subjectField}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-small" onclick="viewInquiry('${inquiry.id}')">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteInquiry('${inquiry.id}', '${nameField}')">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// View inquiry details
async function viewInquiry(inquiryId) {
    try {
        const inquiry = allInquiries.find(i => i.id === inquiryId);
        if (!inquiry) {
            showNotification('Response not found.', 'error');
            return;
        }
        
        currentInquiry = inquiry;
        
        const modal = document.getElementById('inquiryModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        // Set modal title based on type
        let titleText = '';
        if (inquiry.type === 'contact') {
            titleText = 'Contact Form Details';
        } else if (inquiry.type === 'quote') {
            titleText = 'Quote Request Details';
        } else if (inquiry.type === 'wholesaler_quote') {
            titleText = 'Wholesaler Quote Request Details';
        }
        modalTitle.textContent = titleText;
        
        // Generate modal content based on inquiry type
        if (inquiry.type === 'contact') {
            modalBody.innerHTML = `
                <div class="detail-field">
                    <label>Name</label>
                    <div class="value">${inquiry.name}</div>
                </div>
                <div class="detail-field">
                    <label>Email</label>
                    <div class="value">${inquiry.email}</div>
                </div>
                <div class="detail-field">
                    <label>Subject</label>
                    <div class="value">${inquiry.subject}</div>
                </div>
                <div class="detail-field">
                    <label>Message</label>
                    <div class="value">${inquiry.message}</div>
                </div>
                <div class="detail-field">
                    <label>Date Submitted</label>
                    <div class="value">${formatDate(inquiry.timestamp)}</div>
                </div>
            `;
        } else if (inquiry.type === 'quote') {
            modalBody.innerHTML = `
                <div class="detail-field">
                    <label>Company Name</label>
                    <div class="value">${inquiry.companyName}</div>
                </div>
                <div class="detail-field">
                    <label>Contact Person</label>
                    <div class="value">${inquiry.contactPerson}</div>
                </div>
                <div class="detail-field">
                    <label>Email</label>
                    <div class="value">${inquiry.email}</div>
                </div>
                <div class="detail-field">
                    <label>Phone</label>
                    <div class="value">${inquiry.phone}</div>
                </div>
                <div class="detail-field">
                    <label>GST Number</label>
                    <div class="value">${inquiry.gstNumber || 'N/A'}</div>
                </div>
                <div class="detail-field">
                    <label>Address</label>
                    <div class="value">${inquiry.address}</div>
                </div>
                <div class="detail-field">
                    <label>City</label>
                    <div class="value">${inquiry.city}</div>
                </div>
                <div class="detail-field">
                    <label>State</label>
                    <div class="value">${inquiry.state}</div>
                </div>
                <div class="detail-field">
                    <label>Pincode</label>
                    <div class="value">${inquiry.pincode}</div>
                </div>
                <div class="detail-field">
                    <label>Quantity</label>
                    <div class="value">${inquiry.quantity}</div>
                </div>
                <div class="detail-field">
                    <label>Additional Information</label>
                    <div class="value">${inquiry.additionalInfo || 'N/A'}</div>
                </div>
                <div class="detail-field">
                    <label>Date Submitted</label>
                    <div class="value">${formatDate(inquiry.timestamp)}</div>
                </div>
            `;
        } else if (inquiry.type === 'wholesaler_quote') {
            modalBody.innerHTML = `
                <div class="detail-field">
                    <label>Business Name</label>
                    <div class="value">${inquiry.businessName}</div>
                </div>
                <div class="detail-field">
                    <label>Contact Person</label>
                    <div class="value">${inquiry.contactPerson}</div>
                </div>
                <div class="detail-field">
                    <label>Mobile Number</label>
                    <div class="value">${inquiry.mobile}</div>
                </div>
                <div class="detail-field">
                    <label>Email</label>
                    <div class="value">${inquiry.email}</div>
                </div>
                <div class="detail-field">
                    <label>GST Number</label>
                    <div class="value">${inquiry.gst || 'N/A'}</div>
                </div>
                <div class="detail-field">
                    <label>Business Address</label>
                    <div class="value">${inquiry.address}</div>
                </div>
                <div class="detail-field">
                    <label>City</label>
                    <div class="value">${inquiry.city}</div>
                </div>
                <div class="detail-field">
                    <label>State</label>
                    <div class="value">${inquiry.state}</div>
                </div>
                <div class="detail-field">
                    <label>Pincode</label>
                    <div class="value">${inquiry.pincode}</div>
                </div>
                <div class="detail-field">
                    <label>Nature of Business</label>
                    <div class="value">${inquiry.nature}</div>
                </div>
                <div class="detail-field">
                    <label>Monthly Requirement</label>
                    <div class="value">${inquiry.requirement}</div>
                </div>
                <div class="detail-field">
                    <label>Message / Comments</label>
                    <div class="value">${inquiry.message || 'N/A'}</div>
                </div>
                <div class="detail-field">
                    <label>Date Submitted</label>
                    <div class="value">${formatDate(inquiry.timestamp)}</div>
                </div>
            `;
        }
        
        modal.style.display = 'flex';
        
    } catch (error) {
        console.error('Error viewing inquiry:', error);
        showNotification('Error loading response details.', 'error');
    }
}

// Delete inquiry with confirmation
async function deleteInquiry(inquiryId, inquiryName) {
    try {
        // Show confirmation modal
        const confirmModal = document.getElementById('confirmDeleteModal');
        const confirmMessage = document.getElementById('confirmDeleteMessage');
        const confirmYesBtn = document.getElementById('confirmDeleteYes');
        const confirmNoBtn = document.getElementById('confirmDeleteNo');
        
        confirmMessage.textContent = `Are you sure you want to delete the inquiry from "${inquiryName}"? This action cannot be undone.`;
        
        // Show the confirmation modal
        confirmModal.style.display = 'flex';
        
        // Handle confirmation
        const confirmed = await new Promise((resolve) => {
            confirmYesBtn.onclick = () => {
                confirmModal.style.display = 'none';
                resolve(true);
            };
            
            confirmNoBtn.onclick = () => {
                confirmModal.style.display = 'none';
                resolve(false);
            };
            
            // Close modal when clicking outside
            confirmModal.onclick = (e) => {
                if (e.target === confirmModal) {
                    confirmModal.style.display = 'none';
                    resolve(false);
                }
            };
        });
        
        if (!confirmed) {
            return;
        }
        
        // Show loading state
        showNotification('Deleting inquiry...', 'info');
        
        // Delete from Firebase
        await database.ref(`inquiries/${inquiryId}`).remove();
        
        // Show success message
        showNotification('Inquiry deleted successfully!', 'success');
        
        // Remove from local array
        allInquiries = allInquiries.filter(inquiry => inquiry.id !== inquiryId);
        
        // Re-render table
        renderInquiriesTable();
        
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        showNotification('Error deleting inquiry. Please try again.', 'error');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('inquiryModal');
    modal.style.display = 'none';
    currentInquiry = null;
}

// Refresh data
function refreshData() {
    loadInquiries();
    showNotification('Data refreshed.', 'info');
}

// Utility functions
function formatDate(date) {
    if (!date) return 'N/A';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading() {
    const tbody = document.getElementById('inquiriesTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 2rem; color: #5f6368;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                Loading responses...
            </td>
        </tr>
    `;
}

function hideLoading() {
    // Loading is hidden when data is rendered
}

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

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('inquiryModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
        // Also close confirmation modal
        const confirmModal = document.getElementById('confirmDeleteModal');
        if (confirmModal.style.display === 'flex') {
            confirmModal.style.display = 'none';
        }
    }
}); 