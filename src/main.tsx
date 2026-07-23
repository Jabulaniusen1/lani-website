import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./Styles/index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import {
  AuthProvider,
  PackageOrderProvider,
  MapsProvider,
} from "@/Provider";
import { LoadScript } from "@react-google-maps/api";
import NotificationProvider from "./Provider/NotificationProvider.tsx";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries: "places"[] = ["places"];

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <BrowserRouter>
        <AuthProvider>
          <MapsProvider>
            <NotificationProvider>
              <PackageOrderProvider>
                <App />
              </PackageOrderProvider>
            </NotificationProvider>
          </MapsProvider>
        </AuthProvider>
      </BrowserRouter>
    </LoadScript>
  </StrictMode>
);
