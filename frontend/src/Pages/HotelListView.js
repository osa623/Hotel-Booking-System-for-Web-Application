import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAsyncError, useNavigate } from 'react-router-dom';
import axios from 'axios';

import AOS from 'aos';
import 'aos/dist/aos.css';

//images
//import hotel from '../Assets/Hotel.jpg';

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding,faLocationPin , faHouseChimney, faDollarSign, faHomeLg, faHomeAlt, faHomeUser, faSearch, faSearchLocation, faSearchMinus, faTeletype, faListSquares, faCoins} from '@fortawesome/free-solid-svg-icons';
import Loading from '../Components/Loading';



const HotelListView = () => {

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersHotels, setFiltersHotels] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [chargesFilter, setChargesFilter] = useState(null); 
  const navigate  = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 2000 });

    // Fetch all properties
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties/get');
        setProperties(response.data);
        setFiltersHotels(response.data); // Initialize filtered properties with all properties
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching Properties", error);
        setIsLoading(false);    
      }
    };

    fetchProperties();
  }, []);

  // Navigate to individual property component
  const handleViewProperty = (prop_id) => {
    navigate(`/property/${prop_id}`);
  };

  // Search functionality
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    filterProperties(value, selectedType);
  };

  // Dropdown functionality
  const handleTypeChange = (event) => {
    const value = event.target.value;
    setSelectedType(value);
    filterProperties(searchQuery, value);
  };

 // Checkbox functionality
    const handleChargesFilterChange = (event) => {
      const value = event.target.value;
      setChargesFilter(value === 'greater' ? 'greater' : 'less');
      filterProperties(searchQuery, selectedType, value === 'greater' ? 'greater' : 'less');
    };

  // Filter properties based on search query and selected type
  const filterProperties = (query, type, charges) => {
    const filtered = properties.filter(hotel =>
      (hotel.name.toLowerCase().includes(query.toLowerCase()) ||
        hotel.location.toLowerCase().includes(query.toLowerCase())) &&
      (type === '' || hotel.type === type) && 
      (charges === 'greater' ? hotel.chargesPerHead > 50000 : charges === 'less' ? hotel.chargesPerHead < 50000 : true)
    );
    setFiltersHotels(filtered);
  };





  return (
    <div className="position-relative d-flex flex-column w-100 justify-content-start align-items-start" style={{ height: 'auto' }}>
      
      {/* Navigation Bar */}
      <div className="position-fixed top-0 start-50 translate-middle-x d-flex flex-column justify-content-center align-items-center" 
           style={{ 
             borderRadius: '20px', 
             padding: '20px', 
             overflow: 'hidden', 
             zIndex: 10, 
             width: '100vw', 
             backgroundColor: '#00aaff' 
           }}>
      </div>

      {/* Hotel Category Upper View for search bar */}
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
        <div className="d-flex flex-lg-row justify-content-start align-items-center" 
             style={{ 
               backgroundColor: '#87cefa', 
               height: '15vh', 
               width: '80vw', 
               borderRadius: '15px', 
               padding: '20px', 
               opacity:'100%',
               boxSizing: 'border-box' 
             }}>
              
              <div className='d-flex justify-content-between align-items-center'>
                <FontAwesomeIcon icon={faSearchLocation} className='mx-2' style={{height:'25px'}}/><input
                type="text"
                placeholder="Search hotels..."
                className="form-control mx-2"
                style={{ width: '25vw' }}
                value={searchQuery} // Bind input value to state
                onChange={handleInputChange} 
              />
              </div>
                   
             <div className='d-flex justify-content-between align-items-center' style={{marginLeft:'20px'}}> 
          <FontAwesomeIcon icon={faListSquares} className='mx-2' style={{height:'25px'}}/>
                    <select
                      className="form-control"
                      style={{
                        width: '20vw',
                        padding: '8px 30px 8px 10px', // Adjust padding for icon space
                        appearance: 'none',
                        background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10"><path fill="none" stroke="%23000" stroke-width="2" d="M1 1l6 6 6-6"/></svg>') no-repeat`,
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '14px 10px', // Adjust size to fit the dropdown
                        backgroundColor: '#ffffff', // Background color of the select box
                        border: '1px solid #ccc', // Border of the select box
                        borderRadius: '4px', // Rounded corners for the select box
                        fontSize: '1rem', // Font size for the dropdown text
                        cursor: 'pointer' // Change cursor to pointer
                      }}
                      value={selectedType} // Bind dropdown value to state
                      onChange={handleTypeChange} // Handle dropdown change
                    >
                      <option value="">All Types</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Home Stay">Home Stay</option>
                    </select>
              </div>  

              <div className='d-flex justify-content-between align-items-center' style={{marginLeft:'10px'}}>
                <div style={{ marginLeft:'30px' }}>
                      <label>
                        <input
                          type="checkbox"
                          value="less"
                          checked={chargesFilter === 'less'}
                          onChange={handleChargesFilterChange}
                         /><FontAwesomeIcon icon={faCoins} className='mx-3'/>
                        <span className='d-flex' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Less than 50,000</span>
                      </label>
                      <label style={{ marginLeft: '20px' }}>
                        <input
                          type="checkbox"
                          value="greater"
                          checked={chargesFilter === 'greater'}
                          onChange={handleChargesFilterChange}
                        /><FontAwesomeIcon icon={faCoins} className='mx-3'/>
                        <span className='d-flex' style={{ fontSize: '1.0rem', fontWeight: '400', fontFamily: 'IBM Plex Sans, sans-serif'}}>Greater than 50,000</span>
                      </label>
                  </div>                    
               </div>
        </div>


      </div>

      {/* Hotel Category Displaying view */}
      <div className="d-flex flex-column justify-content-center align-items-center overflow-hidden" 
           style={{ 
             marginTop: '35vh',  
             padding: '20px', 
             width: '100vw', 
             height: 'auto', 
             overflowY: 'auto',
             overflowX:'hidden' 
           }}>
        <div className="d-grid gap-30 overflow-hidden" 
             style={{ 
               backgroundColor: 'transparent', 
               width: '95vw', 
               borderRadius: '15px', 
               padding: '20px', 
               boxSizing: 'border-box', 
               gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
               gridGap: '20px' ,
             }}>

          {/* Grid view for hotel categories */}

          {isLoading ? (
            <Loading/>
          ) : (
            filtersHotels.length === 0 ? (
                  <div className='d-flex-col  justify-content-center align-items-center' style={{width:'auto', height:'40vh'}}>
                          <h2 className="mb-4 text-center text-primary" style={{marginTop:'10px'}}>No Property Available <FontAwesomeIcon icon={faSearchMinus} /></h2>
                          <h2 className="mb-4 text-center text-primary" style={{marginTop:'10px'}}>Try Something New..</h2>
                  </div>
            ) : (
              
              filtersHotels.map((property) => (
                <div key={property._id}  className=" d-flex-col overflow-hidden justify-content-center align-items-center cursor-pointer overflow-hidden" 
                    style={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '10px', 
                      height: '300px',
                      width:'320px',
                      border:'100px',
                      boxShadow: '10px 10px 10px 10px rgba(0, 0, 0, 0.1)' 
                    }} data-aos='fade-right' data-aos-delay='200'>
  
                    <div className='d-flex  justify-content-center align-items-center overflow-hidden' style={{
                      height: '150px',
                      width : 'auto'
                    }}>
                      <img src={property.photos[0]} alt = '' style={{
                          objectFit : 'contain',
                          width: '400px'
                      }}/>
                  
                  </div>
  
                  <div className='d-flex-col justify-content-center align-items-center overflow-hidden' style={{
                      height: '150px',
                      width : 'auto'
                    }}>
  
                                <div className='d-flex-col justify-content-center align-items-center overflow-hidden' style={{
                                    height: 'auto',
                                    width : 'auto'
                                  }}>
  
                                          {/* location section and ratings */}
                                          <div className='d-flex justify-content-between align-items-center overflow-hidden'>
  
                                            
  
                                                    {/* Booking Property location */}
                                                      <div className='d-flex justify-content-start align-items-center overflow-hidden' style={{
                                                        marginTop: 1,
                                                      }}>
                                                          <FontAwesomeIcon 
                                                                icon={faLocationPin} 
                                                                className='d-flex' 
                                                                style={{
                                                                  height: '1.2rem',
                                                                  marginTop: '0.2rem',
                                                                  marginLeft: 10,
                                                                  color: '#696969',
                                                                }}
                                                              /><h2
                                                              className=''
                                                              style={{
                                                                fontWeight: '500',
                                                                fontFamily: 'IBM Plex Sans , sans-serif',
                                                                color: '#696969 ',
                                                                marginTop: 10, 
                                                                marginLeft: 10,
                                                                fontSize: '0.8rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                              }}
                                                            >
                                                              {property.location}
  
                                                            </h2>
                                                      </div>
  
  
                                                      <div className='d-flex justify-content-start align-items-center overflow-hidden' style={{
                                                        marginTop: 1,
                                                        fontSize:'0.9rem',
                                                        fontWeight:'500',
                                                        marginRight:'10px'
                                                      }}>
                                                        <FontAwesomeIcon icon={faHomeUser} className='mx-1' style={{marginBottom:'3px'}}/>
                                                        Rooms:{' '}{property.roomCategories.length} 
  
                                                      </div>
  
  
  
  
                                          </div>
  
                                          {/* Booking Name */}
                                            <div className='d-flex justify-content-start align-items-center overflow-hidden' style={{
                                              marginBottom: 0,
                                            }}>
                                                <FontAwesomeIcon 
                                                      icon={faBuilding} 
                                                      className='d-flex' 
                                                      style={{
                                                        height: '1.2rem',
                                                        marginBottom: '0.4rem',
                                                        marginLeft: 10,
                                                        color: '#696969',
                                                      }}
                                                    /><h2
                                                    className=''
                                                    style={{
                                                      fontWeight: '700',
                                                      fontFamily: 'IBM Plex Sans , sans-serif',
                                                      color: '#000036 ',
                                                      marginTop: 1, 
                                                      marginLeft: 10,
                                                      fontSize: '1.5rem',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                    }}
                                                  >
                                                    {property.name}
  
                                                  </h2>
                                            </div>
  
                                            {/* Booking Type */}
                                            <div className='d-flex justify-content-start align-items-center overflow-hidden' style={{
                                                  marginBottom: 0,
                                                }}>
                                                    <FontAwesomeIcon 
                                                          icon={faHouseChimney} 
                                                          className='d-flex' 
                                                          style={{
                                                            height: '1.2rem',
                                                            marginBottom: '0.4rem',
                                                            marginLeft: 8,
                                                            color: '#696969',
                                                          }}
                                                        /><h2
                                                        className=''
                                                        style={{
                                                          fontWeight: '600',
                                                          fontFamily: 'IBM Plex Sans , sans-serif',
                                                          color: '#696969 ',
                                                          marginTop: 1, 
                                                          marginLeft: 10,
                                                          fontSize: '1.0rem',
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                        }}
                                                      >
                                                        {property.type}
  
                                                      </h2>
                                            </div>
  
                                            {/* Booking last row */}
                                              <div className='d-flex justify-content-between align-items-center overflow-hidden' style={{
                                                    marginBottom: 0,
                                                  }}>
          
                                              <div className='d-flex justify-content-start align-items-center overflow-hidden' style={{
                                                    marginTop: 1,
                                                  }}>
                                                      <FontAwesomeIcon 
                                                            icon={faDollarSign} 
                                                            className='d-flex' 
                                                            style={{
                                                              height: '1.2rem',
                                                              marginTop: '0.2rem',
                                                              marginLeft: 10,
                                                              color: '#696969',
                                                            }}
                                                          /><h2
                                                          className=''
                                                          style={{
                                                            fontWeight: '500',
                                                            fontFamily: 'IBM Plex Sans , sans-serif',
                                                            color: '#696969 ',
                                                            marginTop: 10, 
                                                            marginLeft: 10,
                                                            fontSize: '1.2rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                          }}
                                                        >
                                                        {property.chargesPerHead}.00
  
                                                        </h2>
                                                  </div>
  
  
                                                      <button onClick={()=> handleViewProperty(property._id)} 
                                                          className='justify-content-center align-items-center overflow-hidden'
                                                          style={{
                                                            fontWeight: '600',
                                                            fontFamily: 'IBM Plex Sans , sans-serif',
                                                            backgroundColor: '#00aaff',
                                                            color: '#ffffff',
                                                            marginTop: 1, 
                                                            marginLeft: 10,
                                                            marginRight:'10px',
                                                            width:'120px',
                                                            height:'5vh',
                                                            border:'none',
                                                            borderRadius:'10px',
                                                            fontSize: '1.0rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                          }}
                                                        >
                                                          View 
  
                                                        </button>
                                                        
                                              </div>
  
                                  </div>
  
  
  
                  </div>
                </div>
              ))

            )    


          )}

        </div>
      </div>
    </div>
  );
};

export default HotelListView;
