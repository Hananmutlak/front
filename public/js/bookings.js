useEffect(() => {
  axios.get('https://restaurant-backend-aelo.onrender.com//api/bookings')
    .then(res => {
      setBookings(res.data);
    })
    .catch(err => {
      console.error('Error fetching bookings:', err);
    });
}, []);
