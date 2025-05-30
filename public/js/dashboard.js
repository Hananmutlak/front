document.addEventListener("DOMContentLoaded", () => {
fetch("https://restaurant-backend-aelo.onrender.com//api/bookings")
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      const tableBody = document.getElementById("bookings-table-body");
      data.forEach(booking => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${booking.customerName}</td>
          <td>${new Date(booking.date).toLocaleDateString()}</td>
          <td>${booking.numberOfPeople}</td>
          <td>${booking.status}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Failed to load bookings", error);
      // ممكن تظهر رسالة خطأ في الصفحة
    });
});
