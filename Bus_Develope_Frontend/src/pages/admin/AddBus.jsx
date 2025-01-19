import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";
import axios from "axios";
import { FaBusAlt, FaCalendarAlt, FaClock, FaUserAlt } from "react-icons/fa";

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

const isDateInPast = (selectedDate) => {
  const currentDate = new Date().toISOString().split("T")[0];
  return selectedDate < currentDate;
};

const isTimeInPast = (selectedDate, selectedTime) => {
  const currentDate = new Date();
  const [time, modifier] = selectedTime.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(hours, minutes);

  const timeDifference = selectedDateTime - currentDate;
  const minTimeDifference = 2 * 60 * 60 * 1000;

  return timeDifference < minTimeDifference;
};

// Styled Components
const AddBusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  height: 100vh;
  background: linear-gradient(135deg, #007bff, #0056b3);
  font-family: 'Arial', sans-serif;
`;

const FormWrapper = styled.div`
  width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 12px;

  &:focus-within {
    border-color: #007bff;
  }
`;

const Icon = styled.span`
  color: #007bff;
  margin-right: 8px;
  font-size: 1.2rem;
`;

const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const AddBus = () => {
  const [formData, setFormData] = useState({
    busName: "",
    busNumber: "",
    operatorName: "",
    rate: "",
    date: "",
    timing: "",
    totalSeats: "",
    arrivalFrom: "",
    destination: "",
    frequency: "",
  });

  const [hasToken, setHasToken] = useState(false);
  const [token, setToken] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const checkTokenCookie = () => {
      const retrievedToken = getToken("token");
      setHasToken(!!retrievedToken);
      setToken(retrievedToken);
    };

    checkTokenCookie();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDateInPast(formData.date)) {
      alert("Date cannot be in the past.");
      return;
    }

    if (isTimeInPast(formData.date, formData.timing)) {
      alert("Time must be at least 2 hours ahead from current time.");
      return;
    }

    const formattedFormData = {
      ...formData,
      timing: formatTime(formData.timing),
      date: new Date(formData.date).toISOString(),
      arrivalFrom: formData.arrivalFrom.toLowerCase(), // Convert to lowercase
      destination: formData.destination.toLowerCase(), // Convert to lowercase
    };

    try {
      const response = await axios.post(
        hostURL.link + "/api/admin/add-bus",
        formattedFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Bus added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add bus. Please try again.");
    }
  };

  return (
    <AddBusContainer>
      <FormWrapper>
        <Title>Add Bus</Title>
        <center><h1>Add Bus</h1></center>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Icon><FaBusAlt /></Icon>
            <Input
              type="text"
              name="busName"
              placeholder="Bus Name"
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon><FaBusAlt /></Icon>
            <Input
              type="text"
              name="busNumber"
              placeholder="Bus Number"
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon><FaUserAlt /></Icon>
            <Input
              type="text"
              name="operatorName"
              placeholder="Operator Name"
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon>₹</Icon>
            <Input
              type="number"
              name="rate"
              placeholder="Rate"
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon><FaCalendarAlt /></Icon>
            <Input
              type="date"
              name="date"
              onChange={handleChange}
              min={today}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon><FaClock /></Icon>
            <Input
              type="text"
              name="timing"
              placeholder="Timing (e.g., 10:00 AM)"
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon>#</Icon>
            <Input
              type="number"
              name="totalSeats"
              placeholder="Total Seats"
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon>📍</Icon>
            <Input
              type="text"
              name="arrivalFrom"
              placeholder="Arrival From"
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon>📍</Icon>
            <Input
              type="text"
              name="destination"
              placeholder="Destination"
              onChange={handleChange}
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Icon>🔄</Icon>
            <Input
              type="number"
              name="frequency"
              placeholder="Frequency in Days (e.g., 7)"
              onChange={handleChange}
            />
          </InputWrapper>
          <Button type="submit">Submit</Button>
        </form>
      </FormWrapper>
    </AddBusContainer>
  );
};

export default AddBus;
