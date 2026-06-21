import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/HomePage";
import SearchHotelsPage from "../pages/SearchHotelsPage";
import HotelDetailsPage from "../pages/HotelDetailsPage";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import ProfilePage from "../pages/ProfilePage";

import BookingPage from "../pages/BookingPage";

import BookingSummaryPage from "../pages/BookingSummaryPage";
import GuestSelectionPage from "../pages/GuestSelectionPage";
import PaymentPage from "../pages/PaymentPage";
import BookingSuccessPage from "../pages/BookingSuccessPage";

import GuestsPage from "../pages/GuestsPage";

import BookingStatusPage from "../pages/BookingStatusPage";
import MyBookingsPage from "../pages/MyBookingsPage";

import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminHotelsPage from "../pages/AdminHotelsPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      <Route path="/search" element={<SearchHotelsPage />} />

      <Route path="/hotels/:hotelId" element={<HotelDetailsPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* User */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/guests"
        element={
          <ProtectedRoute>
            <GuestsPage />
          </ProtectedRoute>
        }
      />

      {/* Legacy Booking */}
      <Route
        path="/booking/create"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      {/* New Booking Flow */}
      <Route
        path="/booking/summary"
        element={
          <ProtectedRoute>
            <BookingSummaryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking/guests"
        element={
          <ProtectedRoute>
            <GuestSelectionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking/payment"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking/success"
        element={
          <ProtectedRoute>
            <BookingSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/:bookingId/status"
        element={
          <ProtectedRoute>
            <BookingStatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/hotels"
        element={
          <ProtectedRoute>
            <AdminHotelsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
