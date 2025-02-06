import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const KycContainer = styled.div`
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

const Feedback = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: ${(props) => (props.$success ? "#d4edda" : "#f8d7da")};
  color: ${(props) => (props.$success ? "#155724" : "#721c24")};
  border: 1px solid ${(props) => (props.$success ? "#c3e6cb" : "#f5c6cb")};
  border-radius: 8px;
`;

const KycPage = () => {
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [transactionId] = useState(uuidv4());
  const navigate = useNavigate(); // Initialize useNavigate

  const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];
  const apiUrl = "https://ind.idv.hyperverge.co/v1/readId";

  const handleKyc = async () => {
    const fileInput = document.getElementById("uploadInput");
    const file = fileInput?.files[0];

    if (!file) {
      setFileError("Please select a file.");
      return;
    }
    if (!allowedFileTypes.includes(file.type)) {
      setFileError("Invalid file type. Only JPG, PNG, and PDF are allowed.");
      return;
    }

    setFileError("");
    setLoading(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("countryId", "ind");
    formData.append("documentId", "dl");
    formData.append("expectedDocumentSide", "front");

    const appId = import.meta.env.VITE_APP_APP_ID;
    const appKey = import.meta.env.VITE_APP_APP_KEY;

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          appId,
          appKey,
          transactionId,
        },
      });

      const { status, result } = response.data;

      if (status === "success") {
        const { fieldsExtracted, qualityChecks } = result.details[0];
        const { confidence } = fieldsExtracted.fullName || {};
        const { blur, partialId } = qualityChecks || {};

        if (confidence === "low" || blur === "yes" || partialId === "yes") {
          setFeedback({
            success: false,
            message:
              "Document quality issue detected. Please upload a clearer document.",
          });
        } else {
          setFeedback({
            success: true,
            message: `Verification successful! Redirecting to the next step...`,
          });
          setTimeout(() => navigate("/admin-driver-liveiness",{state:{file}}), 2000); // Redirect after 2 seconds
        }
      } else {
        setFeedback({
          success: false,
          message: "Verification failed. Please try again with a valid document.",
        });
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setFeedback({
        success: false,
        message: "An error occurred during verification. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KycContainer>
      <Title>KYC Verification</Title>
      <Guidelines>
        <GuidelineTitle>Steps to Verify Your Document</GuidelineTitle>
        <GuidelineList>
          <li>Upload a clear image or PDF of your Driving License.</li>
          <li>Ensure all details are visible and readable.</li>
          <li>Click "Start KYC" to verify your document.</li>
        </GuidelineList>
      </Guidelines>

      <input
        type="file"
        id="uploadInput"
        accept=".jpg,.jpeg,.png,.pdf"
      />
      {fileError && <p style={{ color: "red" }}>{fileError}</p>}

      <Button onClick={handleKyc} disabled={loading}>
        {loading ? "Verifying..." : "Start KYC"}
      </Button>

      {feedback && (
        <Feedback $success={feedback.success}>{feedback.message}</Feedback>
      )}
    </KycContainer>
  );
};

export default KycPage;
