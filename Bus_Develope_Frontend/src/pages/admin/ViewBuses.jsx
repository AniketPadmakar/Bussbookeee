import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";
import { useNavigate } from "react-router-dom";

const ViewBusesContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const BusList = styled.ul`
  list-style: none;
  padding: 0;
`;

const BusItem = styled.li`
  background: #ffffff;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BusDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const BusDetail = styled.span`
  font-size: 1rem;
  color: #555;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  font-size: 0.9rem;

  &:nth-child(1) {
    background-color: #007bff;
  }

  &:nth-child(2) {
    background-color: #28a745;
  }

  &:nth-child(3) {
    background-color: #dc3545;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const ViewBuses = () => {
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Retrieve token on component mount
    const retrivedToken = getToken("token");
    setToken(retrivedToken);
  }, []);

  useEffect(() => {
    // Fetch buses only if token is available
    if (token) {
      const fetchBuses = async () => {
        try {
          const response = await axios.get(`${hostURL.link}/api/admin/view-buses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBuses(response.data.buses);
        } catch (error) {
          console.error(error);
          alert("Failed to fetch buses.");
        }
      };
      fetchBuses();
    }
  }, [token]);

  const handleDelete = async (busId) => {
    try {
      await axios.post(
        `${hostURL.link}/api/admin/delete-a-bus`,
        { busId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBuses(buses.filter((bus) => bus._id !== busId));
      alert("Bus deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete bus.");
    }
  };

  const handleUpdate = (busId) => {
    navigate(`/admin-update-bus/${busId}`);
  };

  const handleViewTickets = (busId) => {
    navigate(`/admin-view-tickets/${busId}`);
  };

  return (
    <ViewBusesContainer>
      <Title>View Buses</Title>
      <BusList>
        {buses.map((bus) => (
          <BusItem key={bus._id}>
            <BusDetails>
              <BusDetail><strong>Bus Name:</strong> {bus.busName}</BusDetail>
              <BusDetail><strong>Bus Number:</strong> {bus.busNumber}</BusDetail>
              <BusDetail><strong>Timing:</strong> {bus.timing}</BusDetail>
              <BusDetail><strong>Arrival From:</strong> {bus.arrivalFrom}</BusDetail>
              <BusDetail><strong>Destination:</strong> {bus.destination}</BusDetail>
            </BusDetails>
            <ButtonGroup>
              <Button onClick={() => handleUpdate(bus._id)}>Update Bus</Button>
              <Button onClick={() => handleViewTickets(bus._id)}>View Tickets</Button>
              <Button onClick={() => handleDelete(bus._id)}>Delete Bus</Button>
            </ButtonGroup>
          </BusItem>
        ))}
      </BusList>
    </ViewBusesContainer>
  );
};

export default ViewBuses;
