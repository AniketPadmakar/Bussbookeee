// UserDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { deleteToken } from "../../data/Token";

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const OptionsWrapper = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px 40px;
  text-align: center;
  width: 300px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const OptionButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 10px 0;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
`;

const UserDashboard = () => {
  const navigate = useNavigate();

    const handleLogout = () => {
      deleteToken('token'); // Execute the deleteToken function
      navigate('/'); // Navigate to the logout route
    };
  

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container>
      <OptionsWrapper>
        <Title>User Dashboard</Title>
        <OptionButton onClick={() => handleNavigation('/user-view-buses')}>
          View Buses
        </OptionButton>
        <OptionButton onClick={() => handleNavigation('/user-view-tickets')}>
          View Tickets
        </OptionButton>
        {/* <OptionButton onClick={() => handleNavigation('/submit-query')}>
          Submit Query
        </OptionButton> */}
        <OptionButton onClick={handleLogout}>Logout</OptionButton>
      </OptionsWrapper>
    </Container>
  );
};

export default UserDashboard;
