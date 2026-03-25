import { Routes, Route, Navigate } from "react-router-dom";
import { Onboarding, SplashSceen, Home, Tracking, Vendors, Riders } from "@/Screens/Home";
import {
  Registration,
  Login,
  ResetPassword,
  NewPassword,
} from "@/Screens/Auth";
import {
  Dashboard,
  Menu,
  AddMenuItem,
  Profile,
  Notifications,
  OrderPreview,
  NotFound,
  Wallet,
} from "@/Screens/Main";
import { CustomerOrders, Dispatch, Food } from "@/Screens/Customer";
import { AvailableOrders, CompletedOrders } from "@/Screens/Rider";
import {
  Overview,
  Users,
  UserDetails,
  OrdersManagement,
  Restaurants,
  FlatRates,
  Notifications as AdminNotifications
} from "@/Screens/Admin";
import { ScrollToTop } from "@/Components/UI";
import { Toaster } from "sonner";
import { ProtectedRoutes } from "./Components/Main";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { DispatchType } from "./Components/Dispatch";

const App = () => {
  useEffect(() => {
    AOS.init({
      offset: 50,
      duration: 1000,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors className="font-sora" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<Tracking />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/riders" element={<Riders />} />
        <Route path="/app" element={<SplashSceen />} />
        <Route path="/home" element={<Onboarding />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/add" element={<AddMenuItem />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<CustomerOrders />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/dispatch/type" element={<DispatchType />} />
          <Route path="/dispatch/same-city" element={<Dispatch />} />
          <Route path="/orders/:id" element={<OrderPreview />} />
          <Route path="/orders/available" element={<AvailableOrders />} />
          <Route path="/orders/completed" element={<CompletedOrders />} />
          <Route path="/earnings" element={<Wallet />} />
          <Route path="/wallet" element={<Navigate to="/earnings" replace />} />
          <Route path="/food" element={<Food />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Overview />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/admin/orders" element={<OrdersManagement />} />
          <Route path="/admin/restaurants" element={<Restaurants />} />
          <Route path="/admin/settings/flat-rates" element={<FlatRates />} />
          <Route path="/admin/settings/notifications" element={<AdminNotifications />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
