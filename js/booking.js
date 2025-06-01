document.addEventListener('DOMContentLoaded', function() {
    // تعيين تاريخ اليوم كحد أدنى
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    
    // تعيين تاريخ غد كقيمة افتراضية
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('bookingDate').value = tomorrow.toISOString().split('T')[0];
});

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const messageDiv = document.getElementById('message');
    
    // تعطيل الزر أثناء المعالجة
    submitBtn.disabled = true;
    btnText.innerHTML = '<span class="loading"></span> جاري إتمام الحجز...';
    messageDiv.style.display = 'none';
    
    const bookingData = {
        customerName: document.getElementById('customerName').value,
        date: document.getElementById('bookingDate').value,
        numberOfPeople: parseInt(document.getElementById('peopleCount').value),
        phone: document.getElementById('phone').value
    };

    try {
        // المسار الصحيح للإرسال
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
                    <h3><i class="fas fa-check-circle"></i> تم الحجز بنجاح!</h3>
                    <p>شكرًا ${bookingData.customerName} على حجزك في مطعمنا.</p>
                    <p>رقم الحجز: <strong>${data._id}</strong></p>
                    <p>تاريخ الحجز: <strong>${new Date(bookingData.date).toLocaleDateString('ar-EG')}</strong></p>
                    <p>عدد الأشخاص: <strong>${bookingData.numberOfPeople}</strong></p>
                    <p>سنقوم بالاتصال بك على الرقم <strong>${bookingData.phone}</strong> لتأكيد الحجز.</p>
                </div>
            `;
            
            // إعادة تعيين النموذج
            document.getElementById('bookingForm').reset();
            
            // تعيين تاريخ غد كقيمة افتراضية
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('bookingDate').value = tomorrow.toISOString().split('T')[0];
        } else {
            // محاولة قراءة رسالة الخطأ من الخادم
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || 'فشل في الحجز');
            } catch {
                throw new Error(`فشل في الحجز (${response.status})`);
            }
        }
    } catch (error) {
        messageDiv.innerHTML = `
            <div class="error">
                <h3><i class="fas fa-exclamation-circle"></i> خطأ في الحجز</h3>
                <p>${error.message}</p>
                <p>يرجى المحاولة مرة أخرى أو الاتصال بنا للحصول على المساعدة.</p>
            </div>
        `;
    } finally {
        messageDiv.style.display = 'block';
        submitBtn.disabled = false;
        btnText.textContent = 'تأكيد الحجز';
        
        // التمرير إلى الرسالة
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }
});