import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../Components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCoins, faDollar, faEdit, faHotel, faLocationPinLock, faPeopleGroup, faRestroom, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const MyBooking = () => {
  const [customers, setCustomers] = useState([]);
  const [hotels, setHotels] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers/get');
        const bookings = response.data;
        setCustomers(bookings);
        await fetchHotelDetails(bookings);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching customer data', error);
        setIsLoading(false);
      }
    };

    /*In here what i did was fetch the selected hotel details by using Hotel name,
     because i already added the name of the hotel to our booking So,
    by using this hotel name i can easily fetch selected hotel's details to this form*/

    const fetchHotelDetails = async (bookings) => {
      const hotelPromises = bookings.map(booking =>
        axios.get(`http://localhost:5000/api/properties/getHotel/${booking.hotelName}`)
      );

      try {
        const hotelResponses = await Promise.all(hotelPromises);
        const hotelData = hotelResponses.reduce((acc, res) => {
          acc[res.data.name] = res.data; // Use hotel name as key
          return acc;
        }, {});
        setHotels(hotelData);
      } catch (error) {
        console.error('Error fetching hotel data', error);
      }
    };

    fetchBookings();
  }, []);

  const handleUpdate = (booking_id) => {
    navigate(`/updateBooking/${booking_id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/delete/${id}`);
      setCustomers(customers.filter(booking => booking._id !== id));
      alert("Booking Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting Booking:", error);
      alert("Failed to delete Booking. Please try again.");
    }
  };

  if (isLoading) {
    return <Loading />; // Display loading component while fetching data
  }

  return (
    <div className='d-flex justify-content-center align-items-center'>
      <div
        className="d-flex-col justify-content-center align-items-center"
        style={{
          borderRadius: '20px',
          padding: '20px',
          overflowY: 'auto',
          zIndex: 40,
          minHeight: '200vh',
          width: '90vw',
          maxWidth: '1200px',
          marginTop: '10vh',
          backgroundColor: '#ffffff',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h6 className='d-flex align-items-center' style={{ fontSize: '2.5rem', fontWeight: '200', fontFamily: 'Russo One, sans-serif' }}>
          My Bookings
        </h6>

        <div className='d-flex-col justify-content-center align-items-center' style={{ width: '75vw', minHeight: '50vh', overflowY: 'auto', overflowX:'hidden', padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '20px' }}>
          {customers.map((booking) => {
            const hotel = hotels[booking.hotelName]; // Get hotel details using hotelName

            return (
              <div key={booking._id} className='d-flex justify-content-center align-items-center' style={{ width: '75vw', height: '50vh' }}>
                {hotel && (
                  <div className='d-flex-cok justify-content-center align-items-center' style={{ width: '25vw', height: '40vh', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)', }}>
                    <div className='d-flex justify-content-center align-items-center overflow-hidden' style={{ width: '25vw', height: '20vh', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                      <img src={hotel.photos[1]} alt={hotel.name} style={{ 
                        width:'400px'
                      }} />
                    </div>
                    <div className='d-flex-col justify-content-start align-items-center' style={{ width: '20vw', height: '20vh', paddingTop:'10px', paddingLeft:'10px'}}>
                      <h2 className='d-flex justify-content-between align-items-center'style={{  fontSize:'1.2rem', fontWeight: '600', fontFamily: 'IBM Plex Sans, sans-serif'}}><span style={{fontSize:'0.8rem', fontWeight: '300', fontFamily: 'IBM Plex Sans, sans-serif'}}><FontAwesomeIcon icon={faHotel} className='mx-2'/>Name : </span>{''}{hotel.name}</h2>
                      <h2 className='d-flex justify-content-between align-items-center'style={{  fontSize:'1.2rem', fontWeight: '600', fontFamily: 'IBM Plex Sans, sans-serif'}}><span style={{fontSize:'0.8rem', fontWeight: '300', fontFamily: 'IBM Plex Sans, sans-serif'}}><FontAwesomeIcon icon={faRestroom} className='mx-2'/>Type : </span>{hotel.type}</h2>
                      <h2 className='d-flex justify-content-between align-items-center'style={{  fontSize:'1.2rem', fontWeight: '600', fontFamily: 'IBM Plex Sans, sans-serif'}}><span style={{fontSize:'0.8rem', fontWeight: '300', fontFamily: 'IBM Plex Sans, sans-serif'}}><FontAwesomeIcon icon={faLocationPinLock} className='mx-2'/>Location : </span>{hotel.location}</h2>
                      <h2 className='d-flex justify-content-between align-items-center'style={{  fontSize:'1.2rem', fontWeight: '600', fontFamily: 'IBM Plex Sans, sans-serif'}}><span style={{fontSize:'0.8rem', fontWeight: '300', fontFamily: 'IBM Plex Sans, sans-serif'}}><FontAwesomeIcon icon={faDollar} className='mx-2'/>PPD : </span>{hotel.chargesPerHead}</h2>

                    </div>
                  </div>
                )}

                  <div className='d-flex-col justify-content-start align-items-center' style={{ padding: '10px', width: '50vw', height: '40vh', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }}>
                    
                          <h6 className='d-flex align-items-center' style={{ paddingLeft: '10px', width: '50vw', marginTop: '10px', fontSize: '1.5rem', fontWeight: '800', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                              Your Booking Details:
                            </h6>
                          <div className='d-flex-col justify-content-start align-items-center' style={{ padding: '10px', width: '50vw', height: '40vh', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }}>
                            

                                    <h6 className='d-flex align-items-center' style={{ paddingLeft: '10px', width: '25vw', marginTop: '10px', fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                    <span className='d-flex' style={{fontSize:'0.8rem', fontWeight: '300', fontFamily: 'IBM Plex Sans, sans-serif'}}><FontAwesomeIcon icon={faBook} style={{ height: '10px' }} />Name: </span>{booking.name}
                                    </h6>
                                    <h6 className='d-flex align-items-center' style={{ paddingLeft: '10px', width: '25vw', marginTop: '10px', fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                    <span className='d-flex' style={{fontSize:'0.8rem', fontWeight: '300', fontFamily: 'IBM Plex Sans, sans-serif'}}><FontAwesomeIcon icon={faBook} style={{ height: '10px' }} />Name: </span>{booking.name}
                                    </h6>
                                    <h6 className='d-flex align-items-center' style={{ paddingLeft: '10px', width: '25vw', marginTop: '10px', fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                    <span className='d-flex' style={{fontSize:'0.8rem', fontWeight: '300', fontFamily: 'IBM Plex Sans, sans-serif'}}><FontAwesomeIcon icon={faBook} style={{ height: '10px' }} />Name: </span>{booking.name}
                                    </h6>
                                    <h6 className='d-flex align-items-center' style={{ paddingLeft: '10px', width: '25vw', marginTop: '10px', fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                    <span className='d-flex' style={{fontSize:'0.8rem', fontWeight: '300', fontFamily: 'IBM Plex Sans, sans-serif'}}><FontAwesomeIcon icon={faBook} style={{ height: '10px' }} />Name: </span>{booking.name}
                                    </h6>
                                    <h6 className='d-flex align-items-center' style={{ paddingLeft: '10px', width: '25vw', marginTop: '10px', fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                    <span className='d-flex' style={{fontSize:'0.8rem', fontWeight: '300', fontFamily: 'IBM Plex Sans, sans-serif'}}><FontAwesomeIcon icon={faBook} style={{ height: '10px' }} />Name: </span>{booking.name}
                                    </h6>
                            
                    
                    </div> 


                    <div onClick={() => handleUpdate(booking._id)} style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', backgroundColor: 'blue', padding: '10px', margin: '5px', cursor: 'pointer' }}>
                      <FontAwesomeIcon icon={faEdit} style={{ color: 'white', height: '20px' }} />
                    </div>
                    <div onClick={() => handleDelete(booking._id)} style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', backgroundColor: 'red', padding: '10px', margin: '5px', cursor: 'pointer' }}>
                      <FontAwesomeIcon icon={faTrash} style={{ color: 'white', height: '20px' }} />
                    </div>
                  </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBooking;
