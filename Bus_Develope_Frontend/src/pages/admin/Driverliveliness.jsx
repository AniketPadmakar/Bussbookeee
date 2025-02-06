// Import necessary dependencies
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #343a40;
`;

const VideoContainer = styled.div`
  margin: 20px 0;
  position: relative;
`;

const Video = styled.video`
  width: 320px;
  height: 240px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Canvas = styled.canvas`
  display: none;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PopupMessage = styled.p`
  font-size: 16px;
  color: #dc3545;
`;

const CloseButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #a71d2a;
  }
`;

// Component
const Driverliveliness = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {file} = location.state;
  const appId = import.meta.env.VITE_APP_APP_ID;
  const appKey = import.meta.env.VITE_APP_APP_KEY;


  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selfie, setSelfie] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start the camera when the component mounts
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (error) {
        console.error('Error accessing camera:', error);
        setPopupMessage('Unable to access the camera.');
        setPopupVisible(true);
      }
    };

    startCamera();
    return () => {
      // Stop the camera when the component unmounts
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const captureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setSelfie(blob);
    }, 'image/jpeg');
  };

  const handleSubmit = async () => {
    if (!selfie) {
      alert('Please capture a selfie');
      return;
    }

    const transactionId = uuidv4();
    const formData = new FormData();
    formData.append('image', selfie);

    setLoading(true);
    
    try {
      const response = await axios.post('https://ind.idv.hyperverge.co/v1/checkLiveness', formData, {
        headers: {
          appId,
          appKey,
          transactionId: transactionId,
        },
      });

      const result = response.data.result;

      if (result.summary.action === 'pass') {
        await handleFaceMatch();
      } else {
        setPopupMessage('Selfie is not live');
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Error validating selfie:', error);
      setPopupMessage('An error occurred during selfie validation.');
      setPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFaceMatch = async () => {
    const transactionId = uuidv4();
    const formData = new FormData();
    formData.append('selfie', selfie);
    formData.append('id', file);

    try {
      const response = await axios.post('https://ind.idv.hyperverge.co/v1/matchFace', formData, {
        headers: {
          appId,
          appKey,
          transactionId: transactionId,
        },
      });

      const matchResult = response.data.result.details.match.value;

      if (matchResult === 'yes') {
        alert('Face matched successfully');
      } else {
        setPopupMessage('Face does not match');
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Error performing face match:', error);
      setPopupMessage('An error occurred during face match.');
      setPopupVisible(true);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <Container>
      <Title>Selfie Validation</Title>
      <VideoContainer>
        <Video ref={videoRef} />
        <Canvas ref={canvasRef} />
      </VideoContainer>
      <Button onClick={captureSelfie}>Capture Selfie</Button>
      <Button onClick={handleSubmit} disabled={loading || !selfie}>
        {loading ? 'Validating...' : 'Validate Selfie'}
      </Button>

      {popupVisible && (
        <Popup>
          <PopupMessage>{popupMessage}</PopupMessage>
          <CloseButton onClick={closePopup}>Close</CloseButton>
        </Popup>
      )}
    </Container>
  );
};

export default Driverliveliness;