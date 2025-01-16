import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SubmitQueryForm = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [query, setQuery] = useState('');
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserDataAndTickets = async () => {
      try {
        setLoading(true);

        // Fetch user info
        const userResponse = await axios.get('/api/user-info'); // Adjust API endpoint as needed
        setUser({ name: userResponse.data.name, email: userResponse.data.email });

        // Fetch tickets
        const ticketsResponse = await axios.get('/api/user/view-tickets');
        console.log('Tickets Response:', ticketsResponse.data); // Log the response for debugging
        setTickets(ticketsResponse.data.tickets);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load user data or tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query) {
      setError('Please write something in the query box.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/user/submit-query', {
        name: user.name,
        email: user.email,
        query,
        ticketId: selectedTicket,
      });

      setSuccess(response.data.message);
      setQuery('');
      setSelectedTicket('');
    } catch (err) {
      console.error('Error submitting query:', err);
      setError('Failed to submit the query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Submit a Query</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading && <Spinner animation="border" className="d-block mx-auto my-3" />}

      {!loading && (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="ticketSelect">
            <Form.Label>Select Ticket</Form.Label>
            <Form.Select
              value={selectedTicket}
              onChange={(e) => setSelectedTicket(e.target.value)}
              required
            >
              <option value="">Select your ticket</option>
              {Array.isArray(tickets) && tickets.length > 0 ? (
                tickets.map((ticket) => {
                  const busName = ticket?.busId?.busName || 'Unknown Bus';
                  const seatNumber = ticket?.seatNumber || 'Unknown Seat';
                  const ticketId = ticket?._id || 'Invalid ID';

                  if (ticketId && busName && seatNumber) {
                    return (
                      <option key={ticketId} value={ticketId}>
                        {`Ticket ID: ${ticketId}, Bus Name: ${busName}, Seat Number: ${seatNumber}`}
                      </option>
                    );
                  } else {
                    return (
                      <option key={ticketId} disabled>
                        Incomplete ticket details
                      </option>
                    );
                  }
                })
              ) : (
                <option value="" disabled>
                  No tickets available
                </option>
              )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="queryTextarea">
            <Form.Label>Your Query</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Write your query here..."
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            Submit
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default SubmitQueryForm;
