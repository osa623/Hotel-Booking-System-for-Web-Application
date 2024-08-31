import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AOS from 'aos';
import 'aos/dist/aos.css';

//images
//import hotel from '../Assets/Hotel.jpg';

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding,faLocationPin , faHouseChimney, faDollarSign} from '@fortawesome/free-solid-svg-icons';
import Loading from '../Components/Loading';



const HotelListView = () => {

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate  = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 2000 });


    

    //api-fetching all properties
    const fetchProperties = async () => {

      try {

        const response  = await axios.get('http://localhost:5000/api/properties/get');
        setProperties(response.data);   
        setIsLoading(false);    
        
      } catch (error) {
        console.log("Error fetching Properties" ,error);       
      };   
    };

    

    fetchProperties();

  }, []);

    //navigate to invidual component

    const handleViewProperty = (prop_id) => {
        navigate(`/property/${prop_id}`);
    }


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
        <div className="d-flex flex-lg-row justify-content-betwen align-items-center" 
             style={{ 
               backgroundColor: '#87cefa', 
               height: '15vh', 
               width: '80vw', 
               borderRadius: '15px', 
               padding: '20px', 
               opacity:'100%',
               boxSizing: 'border-box' 
             }}>
          {/* Your search bar content goes here */}
          <input type="text" placeholder="Search hotels..." className="form-control" style={{
            width:'25vw'
          }} />
        </div>
      </div>

      {/* Hotel Category Displaying view */}
      <div className="d-flex flex-column justify-content-center align-items-center overflow-hidden" 
           style={{ 
             marginTop: '35vh',  
             padding: '20px', 
             width: '100vw', 
             height: 'auto', 
             overflowY: 'auto' 
           }}>
        <div className="d-grid gap-30 overflow-hidden" 
             style={{ 
               backgroundColor: 'transparent', 
               width: '95vw', 
               borderRadius: '15px', 
               padding: '20px', 
               boxSizing: 'border-box', 
               gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
               gridGap: '20px' 
             }}>

          {/* Grid view for hotel categories */}

          {isLoading ? (
            <Loading/>
          ) : (

            properties.map((property) => (
              <div key={property._id}  className=" d-flex-col overflow-hidden justify-content-center align-items-center cursor-pointer overflow-hidden" 
                  style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '10px', 
                    height: '300px',
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
                                                    }}>


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
                                                      {property.chargesPerHead}

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

          )}

        </div>
      </div>
    </div>
  );
};

export default HotelListView;
