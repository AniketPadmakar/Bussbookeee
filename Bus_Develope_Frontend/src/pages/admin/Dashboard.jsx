import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { deleteToken } from "../../data/Token";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #007bff, #0056b3);
  font-family: 'Arial', sans-serif;
`;

const OptionsWrapper = styled.div`
  background-color: #fff;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 30px 50px;
  text-align: center;
  width: 320px;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: #333;
  font-weight: bold;
  letter-spacing: 1px;
`;

const OptionButton = styled.button`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  margin: 12px 0;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #0056b3, #003f7f);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.5);
  }
`;

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteToken('token'); // Execute the deleteToken function
    navigate('/'); // Navigate to the logout route
  };

  return (
    <Container>
      <OptionsWrapper>
        <Title>Menu</Title>
        <OptionButton onClick={() => navigate('/add-bus')}>Add Bus</OptionButton>
        <OptionButton onClick={() => navigate('/admin-view-buses')}>View Buses</OptionButton>
        <OptionButton onClick={handleLogout}>Logout</OptionButton>
      </OptionsWrapper>
    </Container>
  );
};

export default Menu;
