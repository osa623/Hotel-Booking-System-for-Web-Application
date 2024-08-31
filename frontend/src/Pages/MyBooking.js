import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../Components/Loading';

const MyBooking = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers/get');
        console.log('Fetched data:', response.data); // Log the fetched data
        setCustomers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching customer data', error);
        setIsLoading(false); // Ensure loading state is disabled on error
      }
    };

    fetchBookings();
  }, []);

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
  };

  const thStyle = {
    backgroundColor: '#007bff', // Bootstrap primary color
    color: '#fff',
    textAlign: 'center',
  };

  const tdStyle = {
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  const trEvenStyle = {
    backgroundColor: '#f8f9fa', // Light gray for even rows
  };

  const trHoverStyle = {
    backgroundColor: '#e9ecef', // Slightly darker on hover
  };

  if (isLoading) {
    return <Loading />; // Display loading component while fetching data
  }

  return (
    <div className='d-flex justify-content-center align-items-center' style={{ zIndex: 40 }}>
      <div
        className="position-fixed top-0 start-50 translate-middle-x d-flex flex-column justify-content-between align-items-center"
        style={{
          borderRadius: '20px',
          padding: '20px',
          overflowY: 'auto',
          zIndex: 40,
          height:'200vh',
          width: '90vw',
          maxWidth: '1200px', // Max width for large screens
          marginTop: '10vh',
          backgroundColor: '#ffffff',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="container mt-5">
          <h2 className="mb-4 text-center text-primary">Customer Details</h2>
          <div className="table-responsive">
            <table className="table table-hover table-bordered" style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Age</th>
                  <th style={thStyle}>Check-in Date</th>
                  <th style={thStyle}>Check-out Date</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Contact</th>
                  <th style={thStyle}>Adults Onboard</th>
                  <th style={thStyle}>Children Onboard</th>
                  <th style={thStyle}>Fee Children Count</th>
                  <th style={thStyle}>Non-fee Children Count</th>
                  <th style={thStyle}>Room Type</th>
                  <th style={thStyle}>Number of Rooms</th>
                  <th style={thStyle}>Meal Options</th>
                  <th style={thStyle}>Extra Notes</th>
                  <th style={thStyle}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer, index) => (
                    <tr
                      key={customer._id}
                      style={index % 2 === 0 ? trEvenStyle : {}}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = trHoverStyle.backgroundColor}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      <td style={tdStyle}>{customer.name}</td>
                      <td style={tdStyle}>{customer.age}</td>
                      <td style={tdStyle}>{new Date(customer.checkinDate).toLocaleDateString()}</td>
                      <td style={tdStyle}>{new Date(customer.checkoutDate).toLocaleDateString()}</td>
                      <td style={tdStyle}>{customer.email}</td>
                      <td style={tdStyle}>{customer.contact}</td>
                      <td style={tdStyle}>{customer.adultsOnBoard}</td>
                      <td style={tdStyle}>{customer.childrenOnBoard}</td>
                      <td style={tdStyle}>{customer.feechildrencount}</td>
                      <td style={tdStyle}>{customer.noneFeeChildrenCount}</td>
                      <td style={tdStyle}>{customer.roomType}</td>
                      <td style={tdStyle}>{customer.numberOfRooms}</td>
                      <td style={tdStyle}>{customer.mealOptions.join(', ')}</td>
                      <td style={tdStyle}>{customer.extraNotes}</td>
                      <td style={tdStyle}>${customer.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="15" style={tdStyle} className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooking;
