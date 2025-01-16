import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const BusDetails = styled.div`
  margin-bottom: 2rem;
  font-size: 1.2rem;
`;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  margin-bottom: 2rem;
`;

const Seat = styled.button`
  width: 50px;
  height: 50px;
  background-color: ${(props) =>
    props.booked ? '#d3d3d3' : props.selected ? '#4caf50' : '#f1f1f1'};
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: ${(props) => (props.booked ? 'not-allowed' : 'pointer')};
  color: #333;
  font-size: 14px;
  &:hover {
    background-color: ${(props) =>
      props.booked ? '#d3d3d3' : '#45a049'};
  }
`;

const BookButton = styled.button`
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const BookTicketPage = () => {
  // Extract parameters from the URL
  const { busName, timing, from, to, busId, bookedSeats } = useParams();
  const [hasToken, setHasToken] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Function to check if the "token" cookie is present
        const checkTokenCookie = () => {
            const retrivedToken = getToken('token');
            setHasToken(!!retrivedToken); // Set hasToken to true if token exists, false otherwise
            setToken(retrivedToken);
            console.log(token);
        };

        checkTokenCookie();
    }, [token]);

  // Parse bookedSeats (as params are strings)
  const parsedBookedSeats = bookedSeats ? bookedSeats.split(',').map(Number) : [];

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeatsList, setBookedSeatsList] = useState(parsedBookedSeats);

  const handleSeatClick = (seatNumber) => {
    if (!bookedSeatsList.includes(seatNumber)) {
      setSelectedSeat(seatNumber);
    }
  };

  const handleBookTicket = async () => { 

    if (!token) {
      alert('You need to be logged in to book a ticket.');
      return;
    }

    console.log('Booking ticket for seat:', selectedSeat);

    try {
      const response = await axios.post(
        `${hostURL.link}/api/user/book-ticket`,
        {
          busId,
          busName,
          timing,
          from,
          to,
          seatNumber: selectedSeat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token as a Bearer token
          },
        }
      );

      alert('Ticket booked successfully!');
      setBookedSeatsList((prev) => [...prev, selectedSeat]);
      setSelectedSeat(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to book the ticket!');
    }
  };

  return (
    <Container>
      <BusDetails>
        <h2>{busName}</h2>
        <p>{timing}</p>
        <p>{from} - {to}</p>
      </BusDetails>
      <SeatGrid>
        {Array.from({ length: 40 }, (_, index) => {
          const seatNumber = index + 1;
          const isBooked = bookedSeatsList.includes(seatNumber);
          return (
            <Seat
              key={seatNumber}
              booked={isBooked}
              selected={selectedSeat === seatNumber}
              onClick={() => !isBooked && handleSeatClick(seatNumber)}
            >
              {seatNumber}
            </Seat>
          );
        })}
      </SeatGrid>
      <BookButton
        onClick={handleBookTicket}
        disabled={selectedSeat === null}
      >
        Book Now
      </BookButton>
    </Container>
  );
};

export default BookTicketPage;
