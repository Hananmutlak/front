document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as minimum
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    
    // Set tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('bookingDate').value = tomorrow.toISOString().split('T')[0];
});

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const messageDiv = document.getElementById('message');
    
    // Disable button during processing
    submitBtn.disabled = true;
    btnText.innerHTML = '<span class="loading"></span> Processing booking...';
    messageDiv.style.display = 'none';
    
    const bookingData = {
        customerName: document.getElementById('customerName').value,
        date: document.getElementById('bookingDate').value,
        numberOfPeople: parseInt(document.getElementById('peopleCount').value),
        phone: document.getElementById('phone').value
    };

    try {
        // Correct API endpoint
        const response = await fetch('https://restaurant-backend-1-68of.onrender.com/api/bookings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            const data = await response.json();
            
            messageDiv.innerHTML = `
                <div class="success">
                    <h3><i class="fas fa-check-circle"></i> Booking Successful!</h3>
                    <p>Thank you ${bookingData.customerName} for your reservation.</p>
                    <p>Booking ID: <strong>${data._id}</strong></p>
                    <p>Date: <strong>${new Date(bookingData.date).toLocaleDateString('en-US')}</strong></p>
                    <p>Number of Guests: <strong>${bookingData.numberOfPeople}</strong></p>
                    <p>We'll contact you at <strong>${bookingData.phone}</strong> to confirm.</p>
                </div>
            `;
            
            // Reset form
            document.getElementById('bookingForm').reset();
            
            // Set tomorrow as default date again
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('bookingDate').value = tomorrow.toISOString().split('T')[0];
        } else {
            // Attempt to read error message from server
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Booking failed');
            } catch {
                throw new Error(`Booking failed (${response.status})`);
            }
        }
    } catch (error) {
        messageDiv.innerHTML = `
            <div class="error">
                <h3><i class="fas fa-exclamation-circle"></i> Booking Error</h3>
                <p>${error.message}</p>
                <p>Please try again or contact us for assistance.</p>
            </div>
        `;
    } finally {
        messageDiv.style.display = 'block';
        submitBtn.disabled = false;
        btnText.textContent = 'Confirm Booking';
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }
});