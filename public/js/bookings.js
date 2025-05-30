useEffect(() => {
  axios.get('https://restaurant-backend-1-68of.onrender.com//api/bookings')
    .then(res => {
      setBookings(res.data);
    })
    .catch(err => {
      console.error('Error fetching bookings:', err);
    });
}, []);
