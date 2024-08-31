import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBaby, faCoffee, faDrumstickBite, faHotTub, faIceCream, faPeopleArrows, faPizzaSlice } from '@fortawesome/free-solid-svg-icons';

const BookingPreview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [propertyData, setPropertyData] = useState({});
  const [formData, setFormData] = useState({

    name: '',
    age: '',
    checkinDate: '',
    checkoutDate: '',
    email: '',
    contact: '',
    adultsOnBoard: 0,
    childrenOnBoard: 0,
    feechildrencount: 0,
    noneFeeChildrenCount: 0,
    hotelName:'',
    roomType: '',
    numberOfRooms: 1,
    mealOptions: [],
    extraNotes: '',
    totalAmount: 0,
  });

  const location = useLocation();
  const { initialData, selectedRoom } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData && selectedRoom) {
      setFormData(prevData => ({
        ...prevData,
        propertyId: initialData._id || '',
        roomType: selectedRoom.roomType || '',
        roomPrice: selectedRoom.roomPrice || '',
      }));
      calculateTotalAmount({
        ...formData,
        roomPrice: selectedRoom.roomPrice,
        chargesPerHead: selectedRoom.chargesPerHead
      });
    }
  }, [initialData, selectedRoom]);
  

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/get/${initialData?._id}`);
        setPropertyData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching property data", error);
      }
    };

    if (initialData?._id) {
      fetchPropertyData();
    }
  }, [initialData]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? 
      (checked ? [...(formData[name] || []), value] : (formData[name] || []).filter(v => v !== value)) :
      type === 'number' ? Number(value) : value;

    setFormData(prevData => {
      const updatedData = { ...prevData, [name]: newValue };
      if (['noneFeeChildrenCount', 'feechildrencount', 'adultsOnBoard', 'childrenOnBoard', 'mealOptions', 'checkinDate', 'checkoutDate'].includes(name)) {
        calculateTotalAmount(updatedData);
      }
      return updatedData;
    });
  };
  
// This Part is for all the calculations...

  const calculateTotalAmount = (data) => {
    if (!selectedRoom || !data) return;
  
    // Parse room price
    const roomPrice = parseFloat(data.roomPrice) || 0;
    console.log("Room Price:", roomPrice);
  
    // Add adult and child supplements
    const adultSupplement = propertyData.chargesPerHead || 0;
    const childSupplement = propertyData.childSupplement || 0;
  
    // Calculate total adult supplements
    const totalAdultSupplement = (parseInt(data.adultsOnBoard) || 0) * adultSupplement;
    console.log("Total Adult Supplement:", totalAdultSupplement);
  
    // Calculate total child supplements based on age categories
    const childAgeComplimentaryToChildPricing = (parseInt(data.feechildrencount)) || 0;
    const totalChildSupplement = childAgeComplimentaryToChildPricing * childSupplement;
    console.log("Total Child Supplement:", totalChildSupplement);
  
    // Calculate total number of people
    const totalAdults = parseInt(data.adultsOnBoard) || 0;
    const totalChildren = parseInt(data.noneFeeChildrenCount) + parseInt(data.feechildrencount);
    const totalPeople = totalAdults + totalChildren;
    console.log("Total People:", totalPeople);
  
    // Calculate the required number of rooms based on total number of people
    const maxPeoplePerRoom = 3; // Example value, replace with your actual room capacity
    const numberOfRooms = Math.ceil(totalPeople / maxPeoplePerRoom);
    console.log("Number of Rooms:", numberOfRooms);
  
    // Calculate the total amount for supplements
    let total = totalAdultSupplement + totalChildSupplement;
  
    // Add the cost of the rooms to the total amount
    total += numberOfRooms * roomPrice;
    console.log("Total Amount (Before Meals):", total);
  
    // Update the formData with the calculated number of rooms
    setFormData(prevData => ({
      ...prevData,
      numberOfRooms: numberOfRooms
    }));
  
    // Add meal supplements
    let mealTotal = 0;
    if (data.mealOptions && data.mealOptions.length > 0) {
      data.mealOptions.forEach(option => {
        if (option === 'breakfast') mealTotal += propertyData.breakfastSupplement || 0;
        if (option === 'lunch') mealTotal += propertyData.lunchSupplement || 0;
        if (option === 'dinner') mealTotal += propertyData.dinnerSupplement || 0;
      });
    }
    console.log("Meal Total:", mealTotal);
  
    // Add meal supplements to the total
    total += mealTotal;
  
    // Determine if the check-in and check-out dates fall in winter or summer season
    const checkinDate = new Date(data.checkinDate);
    const checkoutDate = new Date(data.checkoutDate);
  
    // Function to check if a date is within a specific range
    const isWithinRange = (date, startMonth, endMonth) => {
      const month = date.getMonth();
      return (month >= startMonth && month <= endMonth);
    };
  
    const isWinter = 
      (isWithinRange(checkinDate, 11, 11) || isWithinRange(checkinDate, 0, 2)) || 
      (isWithinRange(checkoutDate, 11, 11) || isWithinRange(checkoutDate, 0, 2));
      
    const isSummer = 
      (isWithinRange(checkinDate, 5, 7)) || 
      (isWithinRange(checkoutDate, 5, 7));
  
    // Add winter or summer supplement if applicable
    if (isWinter) {
      total += propertyData.winterSupplement || 0;
    } else if (isSummer) {
      total += propertyData.summerSupplement || 0;
    }
    console.log("Final Total Amount:", total);
  
    // Update the total amount in formData
    setFormData(prevData => ({
      ...prevData,
      totalAmount: total // Total already includes room price, supplements, and other charges
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      ...formData,
      age: Number(formData.age),
      adultsOnBoard: Number(formData.adultsOnBoard),
      childrenOnBoard: Number(formData.childrenOnBoard),
      feechildrencount: Number(formData.feechildrencount),
      noneFeeChildrenCount: Number(formData.noneFeeChildrenCount),
      numberOfRooms: Number(formData.numberOfRooms),
      totalAmount: Number(formData.totalAmount),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/customers/add', postData, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert(`Booking Successful! Total Amount: $${postData.totalAmount.toFixed(2)}`);
      navigate('/myBookings', { state: { bookingDetails: response.data } });
    } catch (error) {
      console.error('There was an error!', error.response ? error.response.data : error.message);
      alert('An error occurred. Please try again later.');
    }
  };

  if (isLoading) {
    return <div className='text-center'>Loading...</div>;
  }


  return (
    <div className='container' style={{marginTop:'100px'}}>

      <h2 className="mb-4 text-center text-primary">Booking Preview</h2>

      <div className="d-flex" style={{padding:'20px', height:'100vh'}}>

        <div className="col-lg-6 mb-4 justify-content-center align-items-center" style={{
                                  borderRadius: '15px', 
                                  marginRight:'10px',
                                  opacity:'100%',
                                  boxShadow: '2px 2px 6px 2px rgba(0,0,0, 0.1)',
                                  boxSizing: 'border-box' }}>
          <div className='d-flex justify-content-center align-items-center' style={{width:'40vw', marginTop:'40px'}}>
               <img src={propertyData.photos?.[0] || ''} alt="Hotel" className="img-fluid rounded" style={{width:'15vw', marginLeft:'20px'}}/>
               <div className='d-flex-col justify-content-center align-items-center' style={{width:'25vw'}}>
               <h3 className="mt-3 mx-3" style={{fontSize: '1.5rem', fontWeight: '500', fontFamily: 'IBM Plex Sans, sans-serif' }}>{' '}{propertyData?.name}</h3>
               <h3 className="mx-3" style={{fontSize: '0.8rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>{' '}{propertyData?.type}</h3>
               <h3 className="mx-3" style={{fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>Selected Room :{' '}{formData?.roomType}</h3>
               <h3 className="mx-3" style={{fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>Room Price :{' '}{formData?.roomPrice}</h3>

               </div>
          </div>   

          <div className='d-flex justify-content-center align-items-center' style={{width:'40vw', padding:'20px' }}>
              <div className='d-flex justify-content-center align-items-center' style={{width:'30vw', borderRadius:'20px', padding:'10px', boxShadow: '2px 2px 6px 2px rgba(0,0,0, 0.1)', boxSizing: 'border-box'}}>            
                    <h3 className="d-flex mx-3" style={{fontSize: '1.5rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif' }}>Total Amount  : {'  '}<h2 style={{fontSize: '1.5rem', fontWeight: '800', fontFamily: 'IBM Plex Sans, sans-serif' }}>{' '}{formData.totalAmount.toFixed(2)}</h2></h3>
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
                              <span className='badge bg-info'>{propertyData?.childSupplement ?? 'N/A'}</span>
                            </h6>
                          </div>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                              <FontAwesomeIcon icon={faPeopleArrows} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Adult Supplement:</span>
                              <span className='badge bg-info'>{propertyData?.chargesPerHead ?? 'N/A'}</span>
                            </h6>
                          </div>
                        </div>

                        
                         {/* 2rd Col */}
                         <div className='d-flex justify-content-between' style={{marginTop:'10px'}}>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faHotTub} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Winter Supplement:</span>
                              <span className='badge bg-info'>{propertyData?.winterSupplement ?? 'N/A'}</span>
                            </h6>
                          </div>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faIceCream} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Summer Supplement:</span>
                              <span className='badge bg-info'>{propertyData?.summerSupplement ?? 'N/A'}</span>
                            </h6>
                          </div>
                        </div>


                       <h5 className='card-title' style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif', marginBottom:'40px' }}>Meal Service:</h5>

                        {/* 3rd Col */}
                        <div className='d-flex justify-content-between' style={{marginTop:'10px'}}>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faCoffee} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Breakfast:</span>
                              <span className='badge bg-info'>{propertyData?.breakfastSupplement ?? 'N/A'}</span>
                            </h6>
                          </div>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faPizzaSlice} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Lunch:</span>
                              <span className='badge bg-info'>{propertyData?.lunchSupplement ?? 'N/A'}</span>
                            </h6>
                          </div>
                          <div className='mb-3'>
                            <h6 className='d-flex align-items-center' style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                            <FontAwesomeIcon icon={faDrumstickBite} className='mx-2'/><span className='me-2' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Dinner:</span>
                              <span className='badge bg-info'>{propertyData?.dinnerSupplement ?? 'N/A'}</span>
                            </h6>
                          </div>
                        </div>

                        </div>
                      </div>
                    </div>
                  </div>
                    </div>

        </div>
        
        <div className="d-flex-col" style={{padding:'40px', width:'50vw', height:'100vh', overflowY:'auto',
                                  borderRadius: '15px', 
                                  marginRight:'10px',
                                  opacity:'100%',
                                  boxShadow: '2px 2px 6px 2px rgba(0,0,0, 0.1)',
                                  boxSizing: 'border-box' }}>
                <form onSubmit={handleSubmit}>

                <h5 className='card-title' style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'IBM Plex Sans, sans-serif', marginBottom:'40px' }}>Hotel Supplements:</h5>


                    <div className='d-flex align-items-center justify-content-start' style={{width:'40vw'}}>
                        <div className="form-group mb-3">
                          <label htmlFor="name" className="form-label font-weight-bold"  style={{ fontFamily: 'IBM Plex Sans , sans-serif'}}>Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
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
                            value={formData.age}
                            onChange={handleChange}
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
                              value={formData.checkinDate}
                              onChange={handleChange}
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
                              value={formData.checkoutDate}
                              onChange={handleChange}
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
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        value={formData.contact}
                                        onChange={handleChange}
                                        required
                                        style={{width:'15vw'}} />
                                    </div>

                          </div>                

                          <h5 className='card-title' style={{ fontSize: '1.5rem', fontWeight: '500', fontFamily: 'IBM Plex Sans, sans-serif', marginBottom:'40px', marginTop:'20px' }}>Onboarding Details:</h5>
                          

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
                                        value={formData.adultsOnBoard}
                                        onChange={handleChange}
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
                                        value={formData.feechildrencount + formData.noneFeeChildrenCount}
                                        onChange={handleChange}
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
                                          Age limit within 0 to {propertyData?.ageLimitComplimentaryStay}
                                        </label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="nonefeechildrencount"
                                          name="noneFeeChildrenCount"
                                          value={formData.noneFeeChildrenCount}
                                          onChange={handleChange}
                                          style={{ width: '8vw' }}
                                        />
                                      </div>

                                      <div className="form-group mb-3" style={{ marginLeft: '30px' }}>
                                        <label htmlFor="feechildrencount" className="form-label font-weight-bold" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                          Age limit within {propertyData?.ageLimitComplimentaryStay} to {propertyData?.ageLimitChildPricing}
                                        </label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          id="feechildrencount"
                                          name="feechildrencount"
                                          value={formData.feechildrencount}
                                          onChange={handleChange}
                                          style={{ width: '8vw' }}
                                        />
                                      </div>
                                    </div>

                           
            <div className='d-flex align-items-center justify-content-start' style={{width:'40vw'}}>   

                          <div className="form-group mb-3">
                            <label htmlFor="roomName" className="form-label font-weight-bold" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                              Room Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="roomName"
                              name="roomName"
                              value={formData.roomType}
                              onChange={handleChange}
                              readOnly
                            />
                          </div>



                          <div className="form-group mb-3"  style={{marginLeft:'30px'}}>
                            <label htmlFor="numberOfRooms" className="form-label font-weight-bold">Number of Rooms</label>
                            <input
                              type="number"
                              className="form-control"
                              id="numberOfRooms"
                              name="numberOfRooms"
                              value={formData.numberOfRooms}
                              onChange={handleChange}
                              min="1"
                              readOnly
                            />
                          </div>
             </div>                           

                  <fieldset className="d-flex form-group mb-3 align-items-center justify-content-start " style={{marginTop:'20px', marginBottom:'20px'}}>
                    <legend className="form-label font-weight-bold"  style={{ fontSize: '1.5rem', fontWeight: '500', fontFamily: 'IBM Plex Sans, sans-serif', marginBottom:'10px', marginTop:'10px' }}>Meal Options</legend>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="breakfast"
                        name="mealOptions"
                        value="breakfast"
                        checked={formData.mealOptions.includes('breakfast')}
                        onChange={handleChange}
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
                        checked={formData.mealOptions.includes('lunch')}
                        onChange={handleChange}
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
                        checked={formData.mealOptions.includes('dinner')}
                        onChange={handleChange}
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
                      value={formData.extraNotes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="totalAmount" className="form-label font-weight-bold"  style={{ fontfamily:''}}>Total Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      id="totalAmount"
                      name="totalAmount"
                      value={`$${formData.totalAmount.toFixed(2)}`}
                      readOnly
                    />
                  </div>

                  <div className='d-flex form-group mb-3 align-items-center justify-content-center' style={{marginTop:'20px', width:'40vw', marginBottom:'20px'}}>

                          <button type="submit" className="btn btn-primary" style={{width:'15vw',  borderRadius:'20px'}}>Confirm Booking</button>

                          <button type="back" className="btn btn-primary" style={{width:'15vw', backgroundColor:'#ffffff', marginLeft:'50px', borderRadius:'20px', color:'#000000'}}>Back</button>
                  </div>                          
                </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPreview;
