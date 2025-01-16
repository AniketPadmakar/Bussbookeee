import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";
import styled, { keyframes } from "styled-components";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f1f5f9;
  padding: 40px 0;
  min-height: 100vh;
`;

const TicketCard = styled.div`
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin: 15px 0;
  width: 90%;
  max-width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  animation: ${fadeIn} 0.5s ease forwards;
`;

const TicketInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 60%;
`;

const TicketName = styled.h2`
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0 0 10px;
`;

const TicketDetails = styled.p`
  font-size: 1rem;
  color: #475569;
  margin: 5px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
`;

const Button = styled.button`
  background-color: ${(props) => props.bgColor || "#007bff"};
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#0056b3"};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  const [hasToken, setHasToken] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkTokenCookie = () => {
      const retrievedToken = getToken("token");
      setHasToken(!!retrievedToken);
      setToken(retrievedToken);
    };

    checkTokenCookie();
  }, [token]);

  // Fetch tickets when the component mounts
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${hostURL.link}/api/user/view-tickets`, {
          headers: {
            Authorization: `Bearer ${getToken("token")}`,
          },
        });

        if (response.status === 200) {
          setTickets(response.data.tickets);
        } else {
          console.error("Error fetching tickets:", response.data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTickets();
  }, []);

  // Redirect to ticket detail page with ticketId
  const handleViewTicket = (ticketId) => {
    navigate(`/user-view-ticket-details/${ticketId}`);
  };

  // Handle ticket cancellation
  // Handle ticket cancellation
  const handleCancelTicket = async (ticketId, busId) => {
    const userId = token ? token.id : ""; // Assuming the token contains the user ID

    try {
      const response = await axios.delete(
        `${hostURL.link}/api/user/cancel-ticket`,
        {
          headers: {
            Authorization: `Bearer ${getToken("token")}`,
          },
          data: { ticketId, busId, userId }
        }
      );

      if (response.status === 200) {
        alert("Ticket canceled successfully.");
        setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
      } else {
        alert("Error canceling ticket: " + response.data.error);
      }
    } catch (error) {
      console.error("Error canceling ticket:", error);
      alert("An error occurred while canceling the ticket.");
    }
  };

  return (
    <Container>
      {tickets.length === 0 ? (
        <p>No tickets available at the moment.</p>
      ) : (
        tickets.map((ticket) => (
          <TicketCard key={ticket._id}>
            <TicketInfo>
              <TicketName>{ticket.busId.busName}</TicketName>
              <TicketDetails>Timing: {ticket.busId.timing}</TicketDetails>
              <TicketDetails>From: {ticket.busId.arrivalFrom}</TicketDetails>
              <TicketDetails>Destination: {ticket.busId.destination}</TicketDetails>
            </TicketInfo>
            <ButtonGroup>
              <Button onClick={() => handleViewTicket(ticket._id)}>View More Information</Button>
              <Button
                bgColor="#dc3545"
                hoverColor="#a71d2a"
                onClick={() => handleCancelTicket(ticket._id, ticket.busId._id)} // Passing busId as well
              >
                Cancel Ticket
              </Button>

            </ButtonGroup>
          </TicketCard>
        ))
      )}
    </Container>
  );
};

export default ViewTickets;
