import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams } from "react-router-dom";
import hostURL from "../../data/URL";
import { getToken } from "../../data/Token";

// Styled Components
const TicketsContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const TicketList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TicketItem = styled.li`
  background: #ffffff;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TicketDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TicketDetail = styled.span`
  font-size: 1rem;
  color: #555;
`;

const NoTicketsMessage = styled.p`
  text-align: center;
  color: #777;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #dc3545;
  font-size: 1.2rem;
`;

const ViewTickets = () => {
    const { busId } = useParams(); // Retrieve busId from route parameters
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.post(
                    `${hostURL.link}/api/admin/view-tickets`,
                    { busId }, // Send busId as JSON in the request body
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                setLoading(false); // Set loading to false after data is fetched

                if (response.data.tickets.length > 0) {
                    setTickets(response.data.tickets); // Use tickets instead of bookings
                } else {
                    setError("No tickets booked yet."); // Set error if no tickets are available
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
                setError("Failed to fetch tickets.");
            }
        };

        if (busId) {
            fetchTickets();
        }
    }, [busId, token]);

    if (loading) {
        return <TicketsContainer>Loading...</TicketsContainer>;
    }

    return (
        <TicketsContainer>
            <Title>Seat Bookings for Bus</Title>
            {error ? (
                <ErrorMessage>{error}</ErrorMessage> // Show error if any
            ) : (
                <TicketList>
                    {tickets.map((ticket, index) => (
                        <TicketItem key={index}>
                            <TicketDetails>
                                <TicketDetail>
                                    <strong>First Name:</strong> {ticket.firstName}
                                </TicketDetail>
                                <TicketDetail>
                                    <strong>Seat Number:</strong> {ticket.seatNumber}
                                </TicketDetail>
                                <TicketDetail>
                                    <strong>Bus Name:</strong> {ticket.busName}
                                </TicketDetail>
                                <TicketDetail>
                                    <strong>Timing:</strong> {ticket.timing}
                                </TicketDetail>
                                <TicketDetail>
                                    <strong>From:</strong> {ticket.from}
                                </TicketDetail>
                                <TicketDetail>
                                    <strong>To:</strong> {ticket.to}
                                </TicketDetail>
                            </TicketDetails>
                        </TicketItem>
                    ))}
                </TicketList>
            )}
        </TicketsContainer>
    );
};

export default ViewTickets;
