import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AdminSignin from './pages/admin/SigninSignup/Signin';
import AdminSignup from './pages/admin/SigninSignup/Signup';
import AdminDashboard from './pages/admin/Dashboard';
import AddBus from './pages/admin/AddBus';
import AdminViewBuses from './pages/admin/ViewBuses';
import AdminViewTickets from './pages/admin/ViewTickets';
import AdminUpdateBus from './pages/admin/UpdateBus';
import UserSignin from './pages/user/SigninSignup/Signin';
import UserSignup from './pages/user/SigninSignup/Signup';
import UserDashboard from './pages/user/Dashboard';
import UserViewBuses from './pages/user/Viewbuses';
import UserViewTickets from './pages/user/Viewtickets';
import UserViewTicketDetails from './pages/user/ViewTicketDetails.jsx';
import BookTicket from './pages/user/BookTicket';
import SubmitQuery from './pages/user/SubmitQueryForm';
// import About from "./routes/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-signin" element={<AdminSignin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-dash" element={<AdminDashboard />} />
        <Route path="/add-bus" element={<AddBus />} />
        <Route path="/admin-view-buses" element={<AdminViewBuses />} />
        <Route path="/admin-view-tickets/:busId" element={<AdminViewTickets />} />
        <Route path="/admin-update-bus/:busId" element={<AdminUpdateBus />} />
        <Route path="/user-signin" element={<UserSignin />} />
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/user-dash" element={<UserDashboard />} />
        <Route path="/user-view-buses" element={<UserViewBuses />} />
        <Route path="/user-view-tickets" element={<UserViewTickets />} />
        <Route path="/user-view-ticket-details/:ticketId" element={<UserViewTicketDetails />} />
        <Route path="/book-ticket/:busName/:timing/:from/:to/:busId/:bookedSeats?" element={<BookTicket />} />
        <Route path="/submit-query" element={<SubmitQuery />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
