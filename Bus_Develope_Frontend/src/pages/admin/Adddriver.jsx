import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import hostURL from "../../data/URL";
import { v4 as uuidv4 } from "uuid"; // For generating unique transaction IDs

const AddDriverContainer = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Guidelines = styled.div`
  background: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const GuidelineTitle = styled.h3`
  font-size: 1.2rem;
  color: #007bff;
  margin-bottom: 10px;
`;

const GuidelineList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  color: #555;
  font-size: 1rem;
`;

const Button = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const AddDriver = () => {
  const [kycStarted, setKycStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartKYC = async () => {
    setLoading(true);

    try {
      const response = await axios.post(hostURL.link + "/api/admin/generate-access-token", {
        expiry: 300, // 5 minutes
      });

      if (!response.data.token) {
        throw new Error("Access token not received from the backend.");
      }

      const accessToken = response.data.token;
      const workflowId = "Digilocker_Workflow_Ani"; // Replace with your workflow ID
      const transactionId = uuidv4(); // Generate a unique transaction ID

      if (!window.HyperKycConfig || !window.HyperKYCModule) {
        throw new Error("HyperVerge SDK not properly loaded. Please check the SDK integration.");
      }

      const hyperKycConfig = new window.HyperKycConfig(accessToken, workflowId, transactionId);

      const handler = async (HyperKycResult) => {
        console.log("HyperKycResult received:", HyperKycResult);

        if (!HyperKycResult) {
          console.error("No result received from the SDK.");
          alert("No result received from the KYC SDK.");
          setKycStarted(false);
          return;
        }

        const { status, details, latestModule, errorCode, errorMessage } = HyperKycResult;

        if (status !== "auto_approved") {
          console.error("KYC not auto approved. Status:", status);
          alert("Failed to add driver. Please try again.");
          setKycStarted(false);
          return;
        }

        // Step 5: Send the KYC data to the backend if approved
        try {
          const resultData = {
            transactionId,  // Always send transactionId
            status,
            details,        // Data from SDK
            latestModule,   // Only included for 'user_cancelled' and 'error' statuses
            errorCode,      // Only included for 'error' scenario
            errorMessage,   // Only included for 'error' scenario
          };

          const backendResponse = await axios.post(hostURL.link + "/api/admin/submit-kyc", resultData);

          if (backendResponse.status === 200) {
            alert("Driver added successfully!");
            
            //await handleOutputsAPI(transactionId);
          } else {
            alert("Failed to save driver data. Please try again.");
          }
        } catch (backendError) {
          console.error("Error sending data to backend:", backendError.message);
          alert("Error while saving driver data.");
        }

        setKycStarted(false);
      };

      window.HyperKYCModule.launch(hyperKycConfig, handler);
      setKycStarted(true);
    } catch (error) {
      console.error("Error starting KYC process:", error.message);
      alert(`Failed to start the KYC process. Please try again. Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOutputsAPI = async (transactionId) => {
    try {
      console.log("Calling APIs with Transaction ID:", transactionId);

      console.log("Trial 1: Calling Results API first");
      try {
        const resultsResponse = await axios.post("https://62a8-115-111-75-30.ngrok-free.app/results", { transactionId });
        console.log("Results API Response:", resultsResponse.data);
      } catch (error) {
        console.error("Error calling Results API:", error.message);
      }

      try {
        const outputsResponse = await axios.post("https://62a8-115-111-75-30.ngrok-free.app/outputs", { transactionId });
        console.log("Outputs API Response:", outputsResponse.data);
      } catch (error) {
        console.error("Error calling Outputs API:", error.message);
      }

      console.log("Trial 2: Calling Outputs API first");
      try {
        const outputsResponse = await axios.post("https://62a8-115-111-75-30.ngrok-free.app/outputs", { transactionId });
        console.log("Outputs API Response:", outputsResponse.data);
      } catch (error) {
        console.error("Error calling Outputs API:", error.message);
      }

      try {
        const resultsResponse = await axios.post("https://62a8-115-111-75-30.ngrok-free.app/results", { transactionId });
        console.log("Results API Response:", resultsResponse.data);
      } catch (error) {
        console.error("Error calling Results API:", error.message);
      }

      alert("Outputs and Results API calls completed!");
    } catch (error) {
      console.error("Error in handleOutputsAPI:", error.message);
      alert("Error while calling Outputs API.");
    }
  };

  return (
    <AddDriverContainer>
      <Title>Add Driver</Title>
      <Guidelines>
        <GuidelineTitle>KYC Guidelines</GuidelineTitle>
        <GuidelineList>
          <li>
            If the driver has a DigiLocker account, documents like PAN, driving
            license, and Aadhaar will be fetched directly from DigiLocker.
          </li>
          <li>
            If the driver does not have a DigiLocker account, they must provide
            the following documents manually:
            <ul>
              <li>PAN Card</li>
              <li>Driving License</li>
              <li>Aadhaar Card</li>
            </ul>
          </li>
          <li>Ensure all uploaded documents are clear and valid.</li>
          <li>
            Cross-check the entered details with the documents before
            submission.
          </li>
        </GuidelineList>
      </Guidelines>
      <Button onClick={handleStartKYC} disabled={loading || kycStarted}>
        {loading ? "Loading..." : kycStarted ? "KYC In Progress" : "Start KYC"}
      </Button>
    </AddDriverContainer>
  );
};

export default AddDriver;
