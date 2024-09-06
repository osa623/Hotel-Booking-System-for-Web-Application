import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBaby, faBowlFood, faCoffee, faDrumstickBite, faHotTub, faIceCream, faPeopleArrows, faPeopleArrowsLeftRight, faPeopleCarry, faPeoplePulling, faPizzaSlice, faPortrait } from '@fortawesome/free-solid-svg-icons';


const EditBooking = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [updatedBooking, setUpdatedBooking] = useState({});
    const [hotels, setHotels] = useState({});
    const navigate = useNavigate();
  
    // Fetch booking and hotel details
    useEffect(() => {
      const fetchBookingDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/customers/get/${id}`);
          const bookingData = response.data;
          setBooking(bookingData);
          setUpdatedBooking(bookingData);
  
          if (bookingData && bookingData.hotelName) {
            fetchHotelDetails(bookingData.hotelName);
          }
        } catch (error) {
          console.error('Error fetching booking details:', error);
        }
      };
  
      const fetchHotelDetails = async (hotelName) => {
        try {
          const hotelResponse = await axios.get(`http://localhost:5000/api/properties/getHotel/${hotelName}`);
          setHotels(hotelResponse.data);
        } catch (error) {
          console.error('Error fetching hotel data:', error);
        }
      };
  
      fetchBookingDetails();
    }, [id]);



  
    useEffect(() => {
        // Calculate the total number of children onboard
        const feeChildCount = parseInt(updatedBooking.feechildrencount) || 0;
        const nonFeeChildCount = parseInt(updatedBooking.noneFeeChildrenCount) || 0;
        const totalChildrenOnBoard = feeChildCount + nonFeeChildCount;
        
        setUpdatedBooking((prevBooking) => ({
          ...prevBooking,
          childrenOnBoard: totalChildrenOnBoard,
        }));
      }, [updatedBooking.feechildrencount, updatedBooking.noneFeeChildrenCount]);
      


    
  
    // Calculate total amount when updatedBooking or hotels change
    useEffect(() => {
        if (updatedBooking && hotels) {
          // Ensure that updatedBooking contains all necessary fields before calculating
          if (updatedBooking.roomType && updatedBooking.checkinDate && updatedBooking.checkoutDate) {
            calculateTotalAmount(updatedBooking);
          }
        }
      }, [updatedBooking, hotels]);
      



  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUpdatedBooking((prevBooking) => ({
        ...prevBooking,
        [name]: value
      }));
    };

    //calculate Total Amount in Update

    const calculateTotalAmount = (data) => {
        if (!data || !hotels) return;
    
        const {
            chargesPerHead = 0,
            childSupplement = 0,
            maxPeoplePerRoom = 3,
            breakfastSupplement = 0,
            lunchSupplement = 0,
            dinnerSupplement = 0,
            winterSupplement = 0,
            summerSupplement = 0,
            roomCategories = []
        } = hotels;
    
        // Find the room category for the booking
        const selectedRoomCategory = roomCategories.find(rc => rc.roomType === data.roomType);
        const roomPriceValue = selectedRoomCategory ? parseFloat(selectedRoomCategory.roomPrice) : 0;
    
        const adultSupplementValue = parseFloat(chargesPerHead);
        const childSupplementValue = parseFloat(childSupplement);
        const breakfastSupplementValue = parseFloat(breakfastSupplement);
        const lunchSupplementValue = parseFloat(lunchSupplement);
        const dinnerSupplementValue = parseFloat(dinnerSupplement);
        const winterSupplementValue = parseFloat(winterSupplement);
        const summerSupplementValue = parseFloat(summerSupplement);
    
        console.log("Parsed Values:");
        console.log("Room Price Value:", roomPriceValue);
        console.log("Adult Supplement Value:", adultSupplementValue);
        console.log("Child Supplement Value:", childSupplementValue);
        console.log("Breakfast Supplement Value:", breakfastSupplementValue);
        console.log("Lunch Supplement Value:", lunchSupplementValue);
        console.log("Dinner Supplement Value:", dinnerSupplementValue);
        console.log("Winter Supplement Value:", winterSupplementValue);
        console.log("Summer Supplement Value:", summerSupplementValue);
    
        // Calculate total number of people
        const totalPeople = (parseInt(data.adultsOnBoard) || 0) +
                            (parseInt(data.feechildrencount) || 0) +
                            (parseInt(data.noneFeeChildrenCount) || 0);
    
        // Calculate total adult supplements
        const totalAdultSupplement = (parseInt(data.adultsOnBoard) || 0) * adultSupplementValue;
        console.log("Total Adult Supplement:", totalAdultSupplement);
    
        // Calculate total child supplements based on age categories
        const childAgeComplimentaryToChildPricing = (parseInt(data.feechildrencount) || 0);
        const totalChildSupplement = childAgeComplimentaryToChildPricing * childSupplementValue;
        console.log("Total Child Supplement:", totalChildSupplement);
    
        console.log("Total People:", totalPeople);
        console.log("Max People Per Room:", maxPeoplePerRoom);
    
        // Ensure maxPeoplePerRoom is valid
        if (maxPeoplePerRoom <= 0) {
            alert("Invalid maxPeoplePerRoom value.");
            return;
        }
    
        const numberOfRooms = Math.ceil(totalPeople / maxPeoplePerRoom);
        console.log("Number of Rooms:", numberOfRooms);
    
        // Calculate total amount
        let totalAmount = numberOfRooms * roomPriceValue;
        totalAmount += totalAdultSupplement;
        totalAmount += totalChildSupplement;
    
        // Add meal supplements
        if (data.mealOptions && data.mealOptions.length > 0) {
            let mealTotal = 0;
            if (data.mealOptions.includes('breakfast')) mealTotal += breakfastSupplementValue;
            if (data.mealOptions.includes('lunch')) mealTotal += lunchSupplementValue;
            if (data.mealOptions.includes('dinner')) mealTotal += dinnerSupplementValue;
            totalAmount += mealTotal;
        }
    
        // Calculate days between check-in and check-out
        const checkinDate = new Date(data.checkinDate);
        const checkoutDate = new Date(data.checkoutDate);
        if (checkinDate >= checkoutDate) {
            alert('Check-in date must be before check-out date.');
            return;
        }
    
        const calculateDaysBetween = (startDate, endDate) => {
            const timeDifference = endDate - startDate;
            const millisecondsPerDay = 1000 * 60 * 60 * 24;
            return Math.ceil(timeDifference / millisecondsPerDay);
        };
    
        const numberOfDays = calculateDaysBetween(checkinDate, checkoutDate);
    
        // Apply seasonal supplements based on the check-in date
        const checkinMonth = checkinDate.getMonth();
        if (checkinMonth === 11 || checkinMonth <= 2) {
            totalAmount += numberOfDays * winterSupplementValue;
        } else if (checkinMonth >= 5 && checkinMonth <= 7) {
            totalAmount += numberOfDays * summerSupplementValue;
        }
    
        // Update the formData with the calculated number of rooms if it has changed
        if (data.numberOfRooms !== numberOfRooms) {
            setUpdatedBooking(prevData => ({
                ...prevData,
                numberOfRooms
            }));
        }
    
        // Only update totalAmount if it has actually changed
        if (data.totalAmount !== totalAmount) {
            setUpdatedBooking(prevData => ({
                ...prevData,
                totalAmount
            }));
        }
    };
    






  
    // Handle form submission
    const handleUpdateSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(`http://localhost:5000/api/customers/update/${id}`, updatedBooking);
        alert('Booking updated successfully!');
        navigate('/myBookings');
      } catch (error) {
        console.error('Error updating booking:', error);
        alert('Failed to update booking. Please try again.');
      }
    };
  
    // Calculate total amount based on booking and hotel details

  
    if (!booking) {
      return <div>Loading...</div>;
    }

  return (
    <div className='container' style={{marginTop:'100px'}}>
      <div className='d-flex justify-content-center align-items-center' style={{width:'auto'}}>
      <h2 className="mb-4 text-center text-primary" style={{marginTop:'10px'}}>Update Booking Preview</h2>
      </div>

      

      <div className="d-flex" style={{padding:'20px', height:'110vh'}}>

        <div className="col-lg-6 mb-4 justify-content-center align-items-center" style={{
                                  borderRadius: '15px', 
                                  marginRight:'10px',
                                  opacity:'100%',
                                  boxShadow: '2px 2px 6px 2px rgba(0,0,0, 0.1)',
                                  boxSizing: 'border-box' }}>
          <div className='d-flex justify-content-center align-items-center' style={{width:'40vw', marginTop:'40px'}}>
               <img src={hotels.photos?.[0] || ''} alt="Hotel" className="img-fluid rounded" style={{width:'15vw', marginLeft:'20px'}}/>
               <div className='d-flex-col justify-content-center align-items-center' style={{width:'25vw'}}>
               <h3 className="mt-3 mx-3" style={{fontSize: '1.5rem', fontWeight: '500', fontFamily: 'IBM Plex Sans, sans-serif' }}>{' '}{hotels?.name}</h3>
               <h3 className="mx-3" style={{fontSize: '0.8rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>{' '}{hotels?.type}</h3>
               <h3 className="mx-3" style={{fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>Selected Room :{' '}{updatedBooking?.roomType}</h3>
               <h3 className="mx-3" style={{fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>Room Price :{' '}Rs.{hotels?.roomPrice}.00</h3>

               </div>
          </div>   

          <div className='d-flex justify-content-center align-items-center' style={{width:'40vw', padding:'20px' }}>
              <div className='d-flex justify-content-center align-items-center' style={{width:'30vw', borderRadius:'20px', padding:'10px', boxShadow: '2px 2px 6px 2px rgba(0,0,0, 0.1)', boxSizing: 'border-box'}}>            
                    <h3 className="d-flex mx-3" style={{fontSize: '1.5rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>Total Amount  : {'  '}<h2 style={{fontSize: '1.5rem', fontWeight: '800', fontFamily: 'IBM Plex Sans, sans-serif' }}>{' '} Rs.{updatedBooking.totalAmount || 0}.00 </h2></h3>
                </div>                      
            </div>                    
                     <div className='container mt-4 justify-content-start' >
                  <div className='row'>
                    <div className='col-md-11'>
                      <div className='card'>
                      <div className='card-body'>
                        <h5 className='card-title' style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif', marginBottom:'40px' }}>Hotel Supplements:</h5>

                        {/*First Col */}
                        <div className='d-flex justify-content-between'>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faBaby} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Child Supplement:</span>
                              <span className='badge bg-info'>Rs.{hotels?.childSupplement ?? 'N/A'}.00</span>
                            </h6>
                          </div>
                          <div className='mb-3' style={{marginLeft:'20px'}}>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                              <FontAwesomeIcon icon={faPeopleArrows} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Adult Supplement:</span>
                              <span className='badge bg-info'>Rs.{hotels?.chargesPerHead ?? 'N/A'}.00</span>
                            </h6>
                          </div>
                        </div>

                        
                         {/* 2rd Col */}
                         <div className='d-flex justify-content-between' style={{marginTop:'10px'}}>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faHotTub} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Winter Supplement:</span>
                              <span className='badge bg-info'>Rs.{hotels?.winterSupplement ?? 'N/A'}.00</span>
                            </h6>
                          </div>
                          <div className='mb-3' style={{marginLeft:'20px'}}>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faIceCream} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Summer Supplement:</span>
                              <span className='badge bg-info'>Rs.{hotels?.summerSupplement ?? 'N/A'}.00</span>
                            </h6>
                          </div>
                        </div>


                       <h5 className='card-title' style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif', marginBottom:'40px', marginTop:'20px' }}>Meal Service:</h5>

                        {/* 3rd Col */}
                        <div className='d-flex justify-content-between' style={{marginTop:'10px'}}>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faCoffee} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Breakfast:</span>
                              <span className='badge bg-info'>Rs.{hotels?.breakfastSupplement ?? 'N/A'}.00</span>
                            </h6>
                          </div>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faPizzaSlice} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Lunch:</span>
                              <span className='badge bg-info'>Rs.{hotels?.lunchSupplement ?? 'N/A'}.00</span>
                            </h6>
                          </div>
                        </div>
                        <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faDrumstickBite} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Dinner:</span>
                              <span className='badge bg-info'>Rs.{hotels?.dinnerSupplement ?? 'N/A'}.00</span>
                            </h6>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                    </div>

        </div>
        
        <div className="d-flex-col" style={{padding:'40px', width:'50vw', height:'100vh', overflowY:'auto', overflowX:'hidden',
                                  borderRadius: '15px', 
                                  marginRight:'10px',
                                  opacity:'100%',
                                  boxShadow: '2px 2px 6px 2px rgba(0,0,0, 0.1)',
                                  boxSizing: 'border-box' }}>
                <form onSubmit={handleUpdateSubmit}>

                <h5 className='card-title' style={{ fontSize: '1.5rem', fontWeight: '500', fontFamily: 'IBM Plex Sans, sans-serif', marginBottom:'40px' }}><FontAwesomeIcon icon={faPortrait} className='mx-2'/>{''}Reservation Holder Details</h5>


                    <div className='d-flex align-items-center justify-content-start' style={{width:'40vw'}}>
                        <div className="form-group mb-3">
                          <label htmlFor="name" className="form-label font-weight-bold"  style={{ fontFamily: 'IBM Plex Sans , sans-serif'}}>Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={updatedBooking.name}
                            onChange={handleInputChange}
                            required
                            style={{width:'25vw'}}/>
                        </div>

                        <div className="form-group mb-3" style={{marginLeft:'20px'}}>
                          <label htmlFor="age" className="form-label font-weight-bold"  style={{ fontFamily: 'IBM Plex Sans , sans-serif'}}>Age</label>
                          <input
                            type="number"
                            className="form-control"
                            id="age"
                            name="age"
                            value={updatedBooking.age}
                            onChange={handleInputChange}
                            required
                            style={{width:'5vw'}}/>
                        </div>
                   </div>                        


                  <div className='d-flex align-items-center justify-content-start' style={{width:'40vw'}}>
            
                  <div className="form-group mb-3">
                            <label htmlFor="checkinDate" className="form-label font-weight-bold">Check-in Date</label>
                            <input
                              type="date"
                              className="form-control"
                              id="checkinDate"
                              name="checkinDate"
                              value={updatedBooking.checkinDate}
                              onChange={handleInputChange}
                              required
                              style={{width:'15vw'}}/>
                          </div>

                          <div className="form-group mb-3" style={{marginLeft:'30px'}}>
                            <label htmlFor="checkoutDate" className="form-label font-weight-bold">Check-out Date</label>
                            <input
                              type="date"
                              className="form-control"
                              id="checkoutDate"
                              name="checkoutDate"
                              value={updatedBooking.checkoutDate}
                              onChange={handleInputChange}
                              required
                              style={{width:'15vw'}} />
                          </div>



                  </div>

                          <div className='d-flex align-items-center justify-content-start' style={{width:'40vw'}}>

                                    <div className="form-group mb-3">
                                      <label htmlFor="email" className="form-label font-weight-bold"  style={{ fontFamily: 'IBM Plex Sans , sans-serif'}}>Email</label>
                                      <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={updatedBooking.email}
                                        onChange={handleInputChange}
                                        required
                                        style={{width:'15vw'}}/>
                                    </div>

                                    <div className="form-group mb-3" style={{marginLeft:'30px'}}>
                                      <label htmlFor="contact" className="form-label font-weight-bold">Contact</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="contact"
                                        name="contact"
                                        value={updatedBooking.contact}
                                        onChange={handleInputChange}
                                        required
                                        style={{width:'15vw'}} />
                                    </div>

                          </div>                

                          <h5 className='card-title' style={{ fontSize: '1.5rem', fontWeight: '500', fontFamily: 'IBM Plex Sans, sans-serif', marginBottom:'40px', marginTop:'20px' }}><FontAwesomeIcon icon={faPeopleArrowsLeftRight} className='mx-2'/>{''}Onboarding Details:</h5>
                          

                          <div className='d-flex align-items-center justify-content-start' style={{ width: '40vw' }}>
                          <div className="form-group mb-3">
                                      <label htmlFor="adultsOnBoard" className="form-label font-weight-bold" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                        Adults Onboard
                                      </label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        id="adultsOnBoard"
                                        name="adultsOnBoard"
                                        value={updatedBooking.adultsOnBoard}
                                        onChange={handleInputChange}
                                        style={{ width: '8vw' }}
                                      />
                                    </div>

                                    <div className="form-group mb-3" style={{ marginLeft: '10px' }}>
                                      <label htmlFor="childrenOnBoard" className="form-label font-weight-bold" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                        Children Onboard
                                      </label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        id="childrenOnBoard"
                                        name="childrenOnBoard"
                                        value={updatedBooking.childrenOnBoard}
                                        onChange={handleInputChange}
                                        style={{ width: '8vw' }}
                                        readOnly
                                      />
                                    </div>

                                      <div className="form-group mb-3" style={{ marginLeft: '30px', width: '12vw' }}>
                                        <h5 className='card-title' style={{ fontSize: '0.8rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                          *Children under the age of 6 are exempt from paying child supplements.
                                        </h5>
                                      </div>
                                    </div>

                                    <div className='d-flex align-items-center justify-content-start' style={{ width: '40vw' }}>
                                      <div className="form-group mb-3">
                                        <label htmlFor="nonefeechildrencount" className="form-label font-weight-bold" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                          Age limit within 0 to {hotels?.ageLimitComplimentaryStay}
                                        </label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="nonefeechildrencount"
                                          name="noneFeeChildrenCount"
                                          value={updatedBooking.noneFeeChildrenCount}
                                          onChange={handleInputChange}
                                          style={{ width: '8vw' }}
                                        />
                                      </div>

                                      <div className="form-group mb-3" style={{ marginLeft: '30px' }}>
                                        <label htmlFor="feechildrencount" className="form-label font-weight-bold" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                          Age limit within {hotels?.ageLimitComplimentaryStay} to {hotels?.ageLimitChildPricing}
                                        </label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="feechildrencount"
                                          name="feechildrencount"
                                          value={updatedBooking.feechildrencount}
                                          onChange={handleInputChange}
                                          style={{ width: '8vw' }}
                                        />
                                      </div>
                                    </div>

                           
            <div className='d-flex align-items-center justify-content-start' style={{width:'35vw'}}> 


                       <div className="form-group mb-3">
                            <label htmlFor="hotelName" className="form-label font-weight-bold">Property Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="hotelName"
                              name="hotelName"
                              value={updatedBooking.hotelName}
                              onChange={handleInputChange}
                              readOnly
                              style={{width:'10vw'}}  />
                          </div>  

                          <div className="form-group mb-3" style={{marginLeft:'30px'}}>
                            <label htmlFor="roomName" className="form-label font-weight-bold" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                              Room Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="roomName"
                              name="roomName"
                              value={updatedBooking.roomType}
                              onChange={handleInputChange}
                              readOnly
                              style={{width:'10vw'}} />
                          </div>



                          <div className="form-group mb-3"  style={{marginLeft:'30px'}}>
                            <label htmlFor="numberOfRooms" className="form-label font-weight-bold">Number of Rooms</label>
                            <input
                              type="number"
                              className="form-control"
                              id="numberOfRooms"
                              name="numberOfRooms"
                              value={updatedBooking.numberOfRooms}
                              onChange={handleInputChange}
                              min="1"
                              readOnly
                              style={{width:'10vw'}}  />
                          </div>
             </div>                           

                  <fieldset className="d-flex form-group mb-3 align-items-center justify-content-start " style={{marginTop:'20px', marginBottom:'20px'}}>
                    <legend className="form-label font-weight-bold"  style={{ fontSize: '1.5rem', fontWeight: '500', fontFamily: 'IBM Plex Sans, sans-serif', marginBottom:'10px', marginTop:'10px' }}><FontAwesomeIcon icon={faBowlFood} className='mx-2'/>{''}Meal Options</legend>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="breakfast"
                        name="mealOptions"
                        value="breakfast"
                        checked={updatedBooking.mealOptions.includes('breakfast')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="breakfast" className="form-check-label"  style={{ fontfamily:''}}>Breakfast</label>
                    </div>
                    <div className="form-check" style={{marginLeft:'20px'}}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="lunch"
                        name="mealOptions"
                        value="lunch"
                        checked={updatedBooking.mealOptions.includes('lunch')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="lunch" className="form-check-label">Lunch</label>
                    </div>
                    <div className="form-check" style={{marginLeft:'20px'}}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="dinner"
                        name="mealOptions"
                        value="dinner"
                        checked={updatedBooking.mealOptions.includes('dinner')}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="dinner" className="form-check-label"  style={{ fontfamily:''}}>Dinner</label>
                    </div>
                  </fieldset>

                  <div className="form-group mb-3">
                    <label htmlFor="extraNotes" className="form-label font-weight-bold" style={{ fontfamily:''}}>Extra Notes</label>
                    <textarea
                      className="form-control"
                      id="extraNotes"
                      name="extraNotes"
                      value={updatedBooking.extraNotes}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="totalAmount" className="form-label font-weight-bold"  style={{ fontfamily:''}}>Total Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      id="totalAmount"
                      name="totalAmount"
                      value={`${updatedBooking.totalAmount || 0}`}
                      readOnly
                    />
                  </div>

                  <div className='d-flex form-group mb-3 align-items-center justify-content-center' style={{marginTop:'20px', width:'35vw', marginBottom:'20px'}}>

                          <button type="submit" className="btn btn-primary" style={{width:'15vw',  borderRadius:'20px'}}>Confirm Booking</button>

                 </div>
                </form>
        </div>
      </div>
    </div>
  );
};

export default EditBooking;
