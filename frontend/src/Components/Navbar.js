import React, { useState } from 'react';
import '../Styles/fonts.css';

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel, faBookBookmark } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = () => {



  const [hover, setHover] = useState(false);



  return (
    <div 
      className="fixed-top d-flex align-items-center justify-content-center px-4" 
      style={{ 
        height: '5rem', 
        width: '100vw', 
        zIndex: 50, 
        backgroundColor: '#00bfff', 
        fontFamily: 'Russo One, sans-serif',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'  
      }}
    >
      <div 
        className="d-flex align-items-center justify-content-center" 
        style={{ 
          height: '4rem', 
          width: '25%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}
      >
        <h2
          className='d-flex'
          style={{
            fontWeight: '400',
            color: '#ffffff', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Booking.Com
          <FontAwesomeIcon 
            icon={faHotel} 
            className='mx-2' 
            style={{
              height: '1.5rem',
              marginBottom: '0.3rem',
              color: '#ffffff',
            }}
          />
        </h2>
      </div>
      <div 
        className="d-flex align-items-center justify-content-center" 
        style={{ 
          height: '4rem', 
          width: '65%', 
          fontFamily: 'IBM Plex Sans, sans-serif',
          color: '#ffffff',
        }}
      >
      </div>


              <div 
                className="d-flex align-items-center justify-content-center" 
                style={{ 
                  height: '4rem', 
                  width: '10%', 
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  color: '#ffffff',
                }}
              >
                <a href='/myBookings'>
                <FontAwesomeIcon
                    icon={faBookBookmark}
                    className={`transition ${hover ? 'text-[#ffffff]' : ''}`}
                    style={{
                      color:'[#ffffff]',
                      height: '30px',
                      cursor:'pointer',
                      transform: hover ? 'scale(1.2)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMou
                    seLeave={() => setHover(false)}
                  />
                </a>

    
              </div>
            
    </div>
  );
};

export default Navbar;
