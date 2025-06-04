// Base API
    const API_BASE = 'https://restaurant-backend-1-68of.onrender.com/api';
    
    // Check for valid token
    document.addEventListener('DOMContentLoaded', () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = 'login.html';
      } else {
        loadBookings();
      }
    });
    
    // DOM elements
    const bookingsBody = document.getElementById('bookingsBody');
    const mobileBookings = document.getElementById('mobileBookings');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const alertMessage = document.getElementById('alertMessage');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    // Statistics elements
    const totalBookingsEl = document.getElementById('totalBookings');
    const pendingBookingsEl = document.getElementById('pendingBookings');
    const approvedBookingsEl = document.getElementById('approvedBookings');
    const rejectedBookingsEl = document.getElementById('rejectedBookings');
    
    // Function to show alerts
    function showAlert(message, type = 'success') {
      alertMessage.textContent = message;
      alertMessage.className = `alert alert-${type}`;
      alertMessage.style.display = 'block';
      
      setTimeout(() => {
        alertMessage.style.display = 'none';
      }, 5000);
    }
    
    // Function to update statistics
    function updateStats(bookings) {
      const total = bookings.length;
      const pending = bookings.filter(b => b.status === 'pending').length;
      const approved = bookings.filter(b => b.status === 'approved').length;
      const rejected = bookings.filter(b => b.status === 'rejected').length;
      
      totalBookingsEl.textContent = total;
      pendingBookingsEl.textContent = pending;
      approvedBookingsEl.textContent = approved;
      rejectedBookingsEl.textContent = rejected;
    }
    
    // Function to load bookings
    async function loadBookings() {
      try {
        loadingIndicator.style.display = 'block';
        bookingsBody.innerHTML = '';
        mobileBookings.innerHTML = '';
        
        const token = localStorage.getItem('token');
        
        // Build filter path
        const params = new URLSearchParams();
        if (statusFilter.value) params.append('status', statusFilter.value);
        if (dateFilter.value) params.append('date', dateFilter.value);
        
        const queryString = params.toString();
        const url = `${API_BASE}/bookings${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load bookings');
        }
        
        const bookings = await response.json();
        
        if (bookings.length === 0) {
          bookingsBody.innerHTML = `
            <tr>
              <td colspan="6" class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No Bookings Found</h3>
                <p>No bookings match your search criteria</p>
              </td>
            </tr>
          `;
          mobileBookings.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-calendar-times"></i>
              <h3>No Bookings Found</h3>
              <p>No bookings match your search criteria</p>
            </div>
          `;
        } else {
          renderBookings(bookings);
          renderMobileBookings(bookings);
        }
        
        updateStats(bookings);
      } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
        console.error('Error fetching bookings:', error);
      } finally {
        loadingIndicator.style.display = 'none';
      }
    }
    
    // Function to render bookings for desktop
    function renderBookings(bookings) {
      bookingsBody.innerHTML = bookings.map(booking => {
        const date = new Date(booking.date);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        });
        
        const time = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return `
          <tr>
            <td>${booking.customerName}</td>
            <td>
              <div>${formattedDate}</div>
              <div style="font-size: 0.9rem; color: #6c757d;">${time}</div>
            </td>
            <td>${booking.numberOfPeople}</td>
            <td>${booking.phone}</td>
            <td>
              <div class="status-badge status-${booking.status}">
                ${getStatusText(booking.status)}
              </div>
            </td>
            <td>
              <div class="actions">
                ${booking.status === 'pending' ? `
                  <button class="btn btn-approve" onclick="updateStatus('${booking._id}', 'approved')">
                    <i class="fas fa-check"></i> Approve
                  </button>
                  <button class="btn btn-reject" onclick="updateStatus('${booking._id}', 'rejected')">
                    <i class="fas fa-times"></i> Reject
                  </button>
                ` : ''}
                <button class="btn btn-delete" onclick="deleteBooking('${booking._id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
    
    // Function to render mobile bookings view
    function renderMobileBookings(bookings) {
      mobileBookings.innerHTML = bookings.map(booking => {
        const date = new Date(booking.date);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short'
        });
        
        const time = date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return `
          <div class="booking-card">
            <div class="booking-card-header">
              <div class="booking-card-name">${booking.customerName}</div>
              <div class="status-badge status-${booking.status}">
                ${getStatusText(booking.status)}
              </div>
            </div>
            
            <div class="booking-card-details">
              <div class="booking-card-detail">
                <span class="booking-card-label">Date</span>
                <span class="booking-card-value">${formattedDate}</span>
              </div>
              <div class="booking-card-detail">
                <span class="booking-card-label">Time</span>
                <span class="booking-card-value">${time}</span>
              </div>
              <div class="booking-card-detail">
                <span class="booking-card-label">People</span>
                <span class="booking-card-value">${booking.numberOfPeople}</span>
              </div>
              <div class="booking-card-detail">
                <span class="booking-card-label">Phone</span>
                <span class="booking-card-value">${booking.phone}</span>
              </div>
            </div>
            
            <div class="actions">
              ${booking.status === 'pending' ? `
                <button class="btn btn-approve" onclick="updateStatus('${booking._id}', 'approved')">
                  <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn btn-reject" onclick="updateStatus('${booking._id}', 'rejected')">
                  <i class="fas fa-times"></i> Reject
                </button>
              ` : ''}
              <button class="btn btn-delete" onclick="deleteBooking('${booking._id}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
    
    // Function to get status text
    function getStatusText(status) {
      switch(status) {
        case 'pending': return 'Pending';
        case 'approved': return 'Approved';
        case 'rejected': return 'Rejected';
        default: return status;
      }
    }
    
    // Function to update booking status
    async function updateStatus(id, status) {
      if (!confirm(`Are you sure you want to ${status === 'approved' ? 'approve' : 'reject'} this booking?`)) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/bookings/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update status');
        }
        
        showAlert(`Booking ${status === 'approved' ? 'approved' : 'rejected'} successfully`, 'success');
        loadBookings();
      } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
      }
    }
    
    // Function to delete booking
    async function deleteBooking(id) {
      if (!confirm('Are you sure you want to delete this booking?')) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/bookings/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete booking');
        }
        
        showAlert('Booking deleted successfully', 'success');
        loadBookings();
      } catch (error) {
        showAlert(`Error: ${error.message}`, 'error');
      }
    }
    
    // Function to log out
    function logout() {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    }
    
    // Initialize with some sample data for demonstration
    document.addEventListener('DOMContentLoaded', () => {
      // Simulate loading with sample data
      const sampleBookings = [
        {
          _id: "1",
          customerName: "John Smith",
          date: "2023-12-15T19:00:00.000Z",
          numberOfPeople: 4,
          phone: "555-1234",
          status: "pending"
        },
        {
          _id: "2",
          customerName: "Emma Johnson",
          date: "2023-12-16T20:30:00.000Z",
          numberOfPeople: 2,
          phone: "555-5678",
          status: "approved"
        },
        {
          _id: "3",
          customerName: "Michael Brown",
          date: "2023-12-14T18:00:00.000Z",
          numberOfPeople: 6,
          phone: "555-9012",
          status: "rejected"
        },
        {
          _id: "4",
          customerName: "Sarah Williams",
          date: "2023-12-17T19:45:00.000Z",
          numberOfPeople: 3,
          phone: "555-3456",
          status: "pending"
        }
      ];
      
      renderBookings(sampleBookings);
      renderMobileBookings(sampleBookings);
      updateStats(sampleBookings);
    });