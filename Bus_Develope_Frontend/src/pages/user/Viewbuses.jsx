// ViewBuses.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import { getToken } from '../../data/Token';
import hostURL from '../../data/URL';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 40px 20px;
  min-height: 100vh;
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const BusCard = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  width: 90%;
  max-width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const BusInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 60%;
`;

const BusName = styled.h2`
  font-size: 1.2rem;
  color: #333;
`;

const BusDetails = styled.p`
  font-size: 1rem;
  color: #666;
`;

const BookButton = styled.button`
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 150px;
  margin-left: 20px;

  &:hover {
    background-color: #218838;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.5);
  }
`;

const ViewBuses = () => {
  const [buses, setBuses] = useState([]);
  const [arrivalFrom, setArrivalFrom] = useState('');
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  // Fetch all buses on initial render
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch(`${hostURL.link}/api/user/view-buses`);
        const data = await response.json();
        if (response.ok) {
          setBuses(data.buses);
        } else {
          console.error('Error fetching buses:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchBuses();
  }, []);

  // Search buses based on `arrivalFrom` and `destination`
  const handleSearch = async () => {
    if (!arrivalFrom || !destination) {
      alert('Both fields are mandatory to search for buses.');
      return;
    }

    try {
      const response = await axios.get(
        `${hostURL.link}/api/user/search-buses`,
        {
          params: { arrivalFrom, destination },
        }
      );

      if (response.status === 200) {
        setBuses(response.data.buses);
      } else {
        alert('No buses found for the given criteria.');
      }
    } catch (error) {
      console.error('Error searching for buses:', error);
      alert('An error occurred while searching for buses.');
    }
  };

  // Redirect to the booking page with the selected bus ID
  const handleBookTicket = async (busId, busName, timing, from, to) => {
    try {
      const response = await axios.post(`${hostURL.link}/api/user/get-booked-seats`, { busId });

      if (response.status === 200) {
        const bookedSeats = response.data.bookedSeats; // Comma-separated booked seats

        navigate(
          `/book-ticket/${busName}/${timing}/${from}/${to}/${busId}/${bookedSeats}`
        );
      } else {
        console.error('Failed to fetch booked seats:', response.data);
        alert('Could not fetch booked seats. Please try again later.');
      }
    } catch (error) {
      console.error('Error while fetching booked seats:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Container>
      <SearchBarContainer>
        <Input
          type="text"
          placeholder="Enter Arrival From"
          value={arrivalFrom}
          onChange={(e) => setArrivalFrom(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Enter Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </SearchBarContainer>

      {buses.length === 0 ? (
        <p>No buses available at the moment.</p>
      ) : (
        buses.map((bus) => (
          <BusCard key={bus._id}>
            <BusInfo>
              <BusName>{bus.busName} - {bus.busNumber}</BusName>
              <BusDetails>Timing: {bus.timing}</BusDetails>
              <BusDetails>From: {bus.arrivalFrom}</BusDetails>
              <BusDetails>Destination: {bus.destination}</BusDetails>
            </BusInfo>
            <BookButton onClick={() => handleBookTicket(bus._id, bus.busName, bus.timing, bus.arrivalFrom, bus.destination)}>
              Book Ticket
            </BookButton>
          </BusCard>
        ))
      )}
    </Container>
  );
};

export default ViewBuses;
