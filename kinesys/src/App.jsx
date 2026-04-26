import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRouter from "./router/AppRouter";
import "./styles/GlobalStyles.css";

function AppLayout() {
  const location = useLocation();
  const hideNavbarFooter = location.pathname === '/login';

  return (
    <div className="app-layout">
      {!hideNavbarFooter && <Navbar />}
      <main className={hideNavbarFooter ? "main-content-full" : "main-content"}>
        <AppRouter />
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
