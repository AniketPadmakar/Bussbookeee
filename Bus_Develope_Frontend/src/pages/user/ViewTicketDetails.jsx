import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 40px 0;
`;

const TicketDetailsCard = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  width: 90%;
  max-width: 600px;
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TicketName = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

const TicketDetail = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const ViewTicketDetails = () => {
  const { ticketId } = useParams();  // Extract ticketId from URL
  const [ticket, setTicket] = useState(null);

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
  // Fetch ticket details when the component mounts
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`${hostURL.link}/api/user/view-tickets?ticketId=${ticketId}`, {
          headers: {
            Authorization: `Bearer ${ getToken('token') }`,
          }
        });

        if (response.status === 200) {
          setTicket(response.data.ticket);
        } else {
          console.error('Error fetching ticket:', response.data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  return (
    <Container>
      {ticket ? (
        <TicketDetailsCard>
          <TicketInfo>
            <TicketName>{ticket.busId.busName}</TicketName>
            <TicketDetail>Bus Number: {ticket.busId.busNumber}</TicketDetail>
            <TicketDetail>Timing: {ticket.busId.timing}</TicketDetail>
            <TicketDetail>From: {ticket.busId.arrivalFrom}</TicketDetail>
            <TicketDetail>Destination: {ticket.busId.destination}</TicketDetail>
            <TicketDetail>Seat Number: {ticket.seatNumber}</TicketDetail>
            <TicketDetail>Created At: {new Date(ticket.createdAt).toLocaleDateString()}</TicketDetail>
            <TicketDetail>Operator: {ticket.busId.operatorName}</TicketDetail>
          </TicketInfo>
        </TicketDetailsCard>
      ) : (
        <p>Loading ticket details...</p>
      )}
    </Container>
  );
};

export default ViewTicketDetails;
