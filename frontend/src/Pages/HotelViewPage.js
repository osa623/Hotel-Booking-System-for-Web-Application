
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useHotel } from '../Components/HotelContext'; 



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader, faHotel, faLocationPin, faRestroom} from '@fortawesome/free-solid-svg-icons';
import Loading from '../Components/Loading';



const HotelViewPage = () => {

  const { id } = useParams();
  const { setSelectedHotel } = useHotel(); // Use context to set selected hotel
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // this is for adding the transition 
  const [fade, setFade] = useState(true); // this is for adding the fade effect for above section 
  const [roomCategories, setRoomsCategories] = useState([]);// this is for fetch room categories of each hotel
  const [selectedRoom, setSelectedRoom] = useState(null); // this one is for the selections 


  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/get/${id}`);
        setPropertyData(response.data);
        setRoomsCategories(response.data.roomCategories || []);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching property data", error);
      }
    };

    fetchPropertyData();
  }, [id]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(false); // Start fade-out

      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === propertyData.photos.length - 1 ? 0 : prevIndex + 1
        );
        setFade(true); // Start fade-in after changing image
      }, 250); // Fade-out duration (500ms)
      
    }, 5000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [propertyData.photos]);




 // room selection constant
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };


   // Room Booking constant
   const handleBookNow = () => {
    if (selectedRoom) {
      setSelectedHotel(propertyData); // Set the selected hotel in context
      navigate('/booking_Preview', { state: { initialData: propertyData, selectedRoom } }); // Pass data to booking form
    } else {
      alert("Please select a room before proceeding to the booking section.");
    }
  };
  

  

  if (!propertyData.photos) {
    return <div>
      <Loading/>
      </div>; // Loading state
  };




  return (
          <div className='d-flex justify-content-center align-items-center'>

            <div className="position-fixed top-0 start-50 translate-middle-x d-flex flex-column justify-content-between align-items-center" 
                style={{ 
                  borderRadius: '20px', 
                  padding: '20px', 
                  overflow: 'hidden', 
                  zIndex: 40, 
                  width: '100vw', 
                  marginTop: '10vh',
                  backgroundColor : '#ffffff',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' 
                }}>
                              
                              {isLoading ? (

                                <Loading/>
                                
                              ) : (

                                <div className="d-flex flex-lg-col justify-content-center align-items-center" 
                                style={{ 
                                  backgroundColor: '#ffffff', 
                                  height: '80vh', 
                                  border: 20,
                                  width: '80vw', 
                                  marginTop:'5vh',
                                  borderRadius: '15px', 
                                  opacity:'100%',
                                  boxShadow: '10px 5px 30px 50px rgba(89,203,232, 0.1)',
                                  boxSizing: 'border-box' 
                                }}>
                                        {/* Main hotel image section */}
                                          <div className="d-flex-col  justify-content-center align-items-center" 
                                            style={{ 
                                              backgroundColor: '#ffffff', 
                                              height: '80vh', 
                                              width: '40vw', 
                                              borderRadius: '15px', 
                                              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                                              opacity:'100%',
                                            }}> 

                                            {/* Hotel image view section */}
                                            <div className="d-flex flex-lg-col justify-content-center align-items-center overflow-hidden" 
                                                style={{ backgroundColor: '#ffffff',height: '50vh', width: '40vw', borderRadius: '15px', opacity:'100%',boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)', }}> 
                                            
                                                  <img src={propertyData.photos[currentImageIndex]} alt='' style={{
                                                    width: '1000px',
                                                    opacity: fade ? 1 : 0, // Change opacity based on fade state
                                                    transition: 'opacity 0.5s ease-in-out', // Smooth fade transition
                                                  }}/>
                                            
                                            </div>
                                            
                                            {/* Hotel Detail Adding Section */}
                                            <div className="d-flex-col justify-content-start align-items-start overflow-hidden" 
                                                style={{ backgroundColor: '#ffffff',height: '30vh', width: '40vw', borderRadius: '15px', opacity:'100%'}}> 

                                                            <div className='d-flex justify-content-between align-items-end overflow-hidden'>
                                                                <div className='d-flex justify-content-start align-items-center overflow-hidden' style={{marginLeft:'10px'}}>
                                                                      <FontAwesomeIcon icon={faLocationPin} className='mx-2' style={{height:'20px'}} /><h2 className='' style={{fontWeight: '500',fontFamily: 'IBM Plex Sans , sans-serif',color: '#696969 ',marginTop: 10, marginLeft: 0,fontSize: '1.5rem',display: 'flex', alignItems: 'center'}}>
                                                                      {propertyData.location} </h2>
                                                                </div>         

                                                                    <div className='d-flex justify-content-center align-items-center overflow-hidden'>
                                                                      <FontAwesomeIcon icon={faHotel} className='mx-2' style={{ height:'20px'}} /><h2 className='' style={{fontWeight: '900',fontFamily: 'IBM Plex Sans , sans-serif',color: '#696969 ',marginTop: 10, marginRight: 20,fontSize: '1.5rem',display: 'flex', alignItems: 'center'}}>
                                                                      {propertyData.type} </h2>
                                                                    </div>       


                                                            </div>

                                                            <div className='d-flex justify-content-start align-items-center overflow-hidden'>
                                                                    <h2 className='' style={{fontWeight: '500',fontFamily: 'Russo One , sans-serif',color: '#696969  ', marginLeft: 20,fontSize: '3.0rem',display: 'flex', alignItems: 'start'}}>
                                                                    {propertyData.name} </h2>
                                                            </div>

                                                            <div className='d-flex justify-content-start align-items-center overflow-hidden'>
                                                                    <p className='' style={{fontWeight: '300',fontFamily: 'IBM Plex Sans , sans-serif' ,color: '#000000', width:'600px',  marginLeft: 20,fontSize: '0.9rem',display: 'flex', alignItems: 'start'}}>
                                                                    {propertyData.description} </p>
                                                            </div>
                                            
                                            </div>
                                            
                                            
                                            
                                            
                                            </div>


                                        {/* Details section */}
                                          <div className="d-flex flex-lg-col justify-content-center align-items-center" 
                                            style={{ 
                                              backgroundColor: '#ffffff', 
                                              height: '80vh', 
                                              width: '40vw', 
                                              borderRadius: '15px', 
                                              padding: '20px', 
                                              opacity:'100%',
                                            }}> 

                                                          <div className='d-flex-col justify-content-between align-items-end overflow-hidden' style={{backgroundColor: '#ffffff',height: '75vh', width: '40vw', borderRadius: '15px', opacity:'100%',boxShadow: '10px 30px 40px 20px rgba(0, 0, 0, 0.1)',}}>

                                                            
                                                                <div className='d-flex-col justify-content-between align-items-end overflow-hidden' style={{backgroundColor: '#ffffff',height: '45vh', width: '40vw', borderRadius: '15px', opacity:'100%'}}>
                                                                <h2 className='' style={{ fontWeight: '100', fontFamily: 'Russo One , sans-serif',color: '#000036 ', marginTop: 20, marginLeft: 20,fontSize: '1.5rem',display: 'flex',alignItems: 'center'}}>
                                                                            Available Rooms :{''}<FontAwesomeIcon icon={faRestroom} style={{
                                                                              height:'30px',
                                                                              marginLeft:'10px'
                                                                            }}/>
                                                                        </h2>    
                                                                  
                                                                        <div className='d-flex-col justify-content-center align-items-center' 
                                                                                style={{
                                                                                  backgroundColor: '#ffffff',
                                                                                  height: '45vh',
                                                                                  width: '40vw',
                                                                                  borderRadius: '15px',
                                                                                  opacity: '100%',
                                                                                  padding: '100px', // Padding inside the grid container
                                                                                  boxSizing: 'border-box',
                                                                                  overflowY: 'auto' // Ensures padding is included in the height/width
                                                                                }}>
                                                                              {roomCategories.map((category, index) => (
                                                                                <div key={index} onClick={()=> handleRoomSelect(category)} style={{
                                                                                  borderRadius: '10px',
                                                                                  border: `2px solid ${selectedRoom === category ? '#007bff' : '#ddd'}`,
                                                                                  padding: '10px',
                                                                                  cursor: 'pointer', 
                                                                                  backgroundColor: selectedRoom === category ? '#f0f8ff' : '#ffffff',
                                                                                  transition: 'border-color 0.3s ease',
                                                                                  width:'20vw',
                                                                                  marginTop:'10px',
                                                                                  boxShadow: '2px 5px 10px 3px rgba(0, 0, 0, 0.1)',
                                                                                  textAlign: 'center'
                                                                                }}>
                                                                                  <h3 style={{ fontSize: '1.2rem', fontWeight: '500', fontFamily: 'IBM Plex Sans , sans-serif' }}>{category.roomType}</h3>
                                                                                  <p style={{ fontSize: '1rem', fontWeight: '400', fontFamily: 'IBM Plex Sans , sans-serif' }}>Price: ${category.roomPrice}</p>
                                                                                </div>
                                                                              ))}
                                                                            </div>

                                                            
                                                                  
                                                                  
                                                                  
                                                                  
                                                                  
                                                                  </div>

                                                                  <div className='d-flex-col justify-content-between align-items-end overflow-hidden' style={{backgroundColor: '#ffffff',height: '30vh', width: '40vw', marginTop:'20spx', borderRadius: '15px', opacity:'100%'}}>

                                                                        <h2 className='' style={{ fontWeight: '300', fontFamily: 'Russo One , sans-serif',color: '#000036 ', marginTop: '30px', marginLeft: 20,fontSize: '1.5rem',display: 'flex',alignItems: 'center'}}>
                                                                            Want to Book This one :{''}<FontAwesomeIcon icon={faBookReader} style={{
                                                                              height:'30px',
                                                                              marginLeft:'10px'
                                                                            }}/>
                                                                        </h2>       
                                                                        <p className='' style={{ fontWeight: '300', fontFamily: 'IBM Plex Sans , sans-serif', width: '30vw', color: '#000036 ', marginTop: 1, marginLeft: 20,fontSize: '0.9rem',display: 'flex',alignItems: 'center'}}>
                                                                        Book your stay effortlessly. Enter your details, select amenities, and let our system handle the rest—adjusting for seasonal rates and meal options. Enjoy a smooth and tailored booking experience.
                                                                        </p> 

                                                                        
                                                                  <div className='d-flex justify-content-between align-items-start overflow-hidden' style={{backgroundColor: '#ffffff',height: '30vh', width: '35vw', borderRadius: '15px', opacity:'100%'}}>

                                                                              {/* Book Now Button */}
                                                                              <button onClick={handleBookNow}
                                                                                  style={{
                                                                                    fontWeight: '600',
                                                                                    fontFamily: 'IBM Plex Sans, sans-serif',
                                                                                    backgroundColor: isHovered ? '#0088cc' : '#00aaff',
                                                                                    color: '#ffffff',
                                                                                    marginTop: 10,
                                                                                    marginLeft: 20,
                                                                                    marginRight: '10px',
                                                                                    width: '15vw',
                                                                                    height: '5vh',
                                                                                    border: 'none',
                                                                                    borderRadius: '10px',
                                                                                    fontSize: '1.0rem',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    transition: 'background-color 0.3s ease',
                                                                                  }}
                                                                                  onMouseEnter={() => setIsHovered(true)}
                                                                                  onMouseLeave={() => setIsHovered(false)}
                                                                                >
                                                                                  Book Now
                                                                                </button>

                                                                          {/* Back Button */}
                                                                          
                                                                                  <Link
                                                                                  to='/'
                                                                                    style={{
                                                                                      fontWeight: '600',
                                                                                      fontFamily: 'IBM Plex Sans, sans-serif',
                                                                                      backgroundColor: '#f0f8ff',
                                                                                      color: '#000000',
                                                                                      marginTop: 10,
                                                                                      width: '15vw',
                                                                                      height: '5vh',
                                                                                      border: '1px solid #000000', // Added a solid border with 2px width
                                                                                      borderRadius: '10px',
                                                                                      fontSize: '1.0rem',
                                                                                      display: 'flex',
                                                                                      alignItems: 'center',
                                                                                      justifyContent: 'center',
                                                                                      transition: 'background-color 0.3s ease',
                                                                                    }}
                                                                                  >
                                                                                    Back
                                                                                  </Link>
                                                                                  




                                                                  </div>
                                                                  
                                                                  
                                                                  </div>




                                                                        


                                                            
                                                            
                                                            
                                                            
                                                            
                                                          </div>




                                            
                                            
                                            </div>





                            </div>

                              )};  

            </div>
            
          </div>
  )
}

export default HotelViewPage;
