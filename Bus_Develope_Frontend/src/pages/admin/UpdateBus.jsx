import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";

const UpdateBusContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Helper functions to format date and time
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0]; // Extracts yyyy-MM-dd
};

const formatTime = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
};

const formatTo12Hour = (time24h) => {
  const [hours, minutes] = time24h.split(":");
  const modifier = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${modifier}`;
};

// Helper functions to check if date or time is in the past
const isDateInPast = (selectedDate) => {
  const currentDate = new Date().toISOString().split("T")[0]; // Today's date in yyyy-mm-dd format
  return selectedDate < currentDate; // Compare selected date with today
};

const isTimeInPast = (selectedDate, selectedTime) => {
  const currentDate = new Date();
  const [hours, minutes] = selectedTime.split(":").map(Number);
  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(hours, minutes);
  
  const timeDifference = selectedDateTime - currentDate; // Difference in milliseconds
  const minTimeDifference = 2 * 60 * 60 * 1000; // Minimum difference (2 hours) in milliseconds

  return timeDifference < minTimeDifference; // Ensure time is at least 2 hours ahead
};

const UpdateBus = () => {
  const { busId } = useParams(); // Get the bus ID from the URL
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [bus, setBus] = useState({
    busName: "",
    operatorName: "",
    rate: "",
    date: "",
    timing: "",
    totalSeats: "",
    arrivalFrom: "",
    destination: "",
    frequency: "",
  });
  const [originalBus, setOriginalBus] = useState({}); // To compare changes

  useEffect(() => {
    const retrievedToken = getToken("token");
    setToken(retrievedToken);
  }, []);

  useEffect(() => {
    if (token) {
      // Fetch the bus details
      const fetchBusDetails = async () => {
        try {
          const response = await axios.get(`${hostURL.link}/api/admin/get-bus/${busId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const fetchedBus = response.data.bus;

          // Format the date and timing for HTML input compatibility
          const formattedBus = {
            ...fetchedBus,
            date: formatDate(fetchedBus.date),
            timing: formatTime(fetchedBus.timing),
          };

          setBus(formattedBus);
          setOriginalBus(formattedBus); // Save original data for comparison
        } catch (error) {
          console.error("Failed to fetch bus details:", error);
          alert("Error fetching bus details.");
        }
      };
      fetchBusDetails();
    }
  }, [token, busId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBus((prevBus) => ({
      ...prevBus,
      [name]: value,
    }));
  };

  const hasChanges = () => {
    return Object.keys(bus).some((key) => bus[key] !== originalBus[key]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate if the date or time is in the past
    if (isDateInPast(bus.date)) {
      alert("Date cannot be in the past.");
      return; // Prevent form submission
    }

    if (isTimeInPast(bus.date, bus.timing)) {
      alert("Time must be at least 2 hours ahead from current time.");
      return; // Prevent form submission
    }

    // Reformat date and timing to original API-compatible formats
    const formattedBus = {
      ...bus,
      timing: formatTo12Hour(bus.timing), // Convert back to 12-hour format if needed
      date: new Date(bus.date).toISOString(), // Convert date to ISO format
    };

    try {
      const response = await axios.put(
        `${hostURL.link}/api/admin/update-bus`,
        { ...formattedBus, busId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Bus updated successfully!");
      navigate("/admin-view-buses"); // Redirect to the bus list page
    } catch (error) {
      console.error("Failed to update bus:", error);
      alert("Error updating bus.");
    }
  };

  return (
    <UpdateBusContainer>
      <Title>Update Bus</Title>
      <Form onSubmit={handleFormSubmit}>
        <FormGroup>
          <Label>Bus Name</Label>
          <Input
            type="text"
            name="busName"
            value={bus.busName}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Operator Name</Label>
          <Input
            type="text"
            name="operatorName"
            value={bus.operatorName}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Rate</Label>
          <Input
            type="number"
            name="rate"
            value={bus.rate}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Date</Label>
          <Input
            type="date"
            name="date"
            value={bus.date}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Timing</Label>
          <Input
            type="time"
            name="timing"
            value={bus.timing}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Total Seats</Label>
          <Input
            type="number"
            name="totalSeats"
            value={bus.totalSeats}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Arrival From</Label>
          <Input
            type="text"
            name="arrivalFrom"
            value={bus.arrivalFrom}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Destination</Label>
          <Input
            type="text"
            name="destination"
            value={bus.destination}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Frequency</Label>
          <Input
            type="text"
            name="frequency"
            value={bus.frequency}
            onChange={handleInputChange}
          />
        </FormGroup>
        {/* The button only appears when there are changes */}
        {hasChanges() && <Button type="submit">Update Bus</Button>}
      </Form>
    </UpdateBusContainer>
  );
};

export default UpdateBus;
