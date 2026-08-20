import { Routes, Route, Navigate } from "react-router-dom";
import { Home, Vendors, Riders, PrivacyPolicy, Contact, TermsAndConditions } from "@/Screens/Home";
import { ScrollToTop } from "@/Components/UI";
import { Toaster } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

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
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/riders" element={<Riders />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
