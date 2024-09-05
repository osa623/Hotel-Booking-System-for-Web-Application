import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

//nav bar components
import Navbar from './Components/Navbar';
import HotelListView from './Pages/HotelListView';
import Loading from './Components/Loading';
import HotelViewPage from './Pages/HotelViewPage';
import BookingPreview from './Pages/BookingPreview';
import MyBooking from './Pages/MyBooking';
//import UpdateBooking from './Pages/UpdateBooking';

//other components


const AppContent = () => {

  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location]);



  return (
    <div className="d-flex flex-column min-d-">
      <Navbar />
      <div className="flex-grow-1">

    {isLoading ? (
      <Loading/>
    ) : (     
      <Routes>
        <Route path="/" element={<HotelListView/>} />
        <Route path="/property/:id" element={<HotelViewPage/>} />
        <Route path="/booking_Preview" element={<BookingPreview/>} />
        <Route path="/myBookings" element={<MyBooking/>} />
        {/*<Route path="/updateBooking/:id" element={<UpdateBooking/>} />*/}
      </Routes>

    )}


      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
