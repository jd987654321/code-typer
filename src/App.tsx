import { useState, ReactElement, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import { Button } from "./components/ui/button";

import { TimerContext } from "./context/TimerContext";

import Main from "./pages/Main";
import AccountPage from "./pages/account/AccountPage";
import TypingPage from "./pages/typing/TypingPage";
import TypingSection from "./pages/typing/TypingSection";
import LoginPage from "./pages/login/LoginPage";

import "./index.css";

export default function App(): ReactElement {
  const [persistentTimerVal, setPersistentTimerVal] = useState(30);
  return (
    <TimerContext.Provider
      value={{ persistentTimerVal, setPersistentTimerVal }}
    >
      <BrowserRouter>
        <div className="bg-gray-400 h-screen">
          <NavBar></NavBar>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/type" element={<TypingPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="login" element={<LoginPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TimerContext.Provider>
  );
}
