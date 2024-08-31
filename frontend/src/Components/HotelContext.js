import React, { createContext, useState, useContext } from 'react';


// Create a context
const HotelContext = createContext();

// Create a provider component
export const HotelProvider = ({ children }) => {
  const [selectedHotel, setSelectedHotel] = useState(null);

  return (
    <HotelContext.Provider value={{ selectedHotel, setSelectedHotel }}>
      {children}
    </HotelContext.Provider>
  );
};

// Custom hook to use the HotelContext
export const useHotel = () => {
  return useContext(HotelContext);
};
