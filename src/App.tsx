import { useState, ReactElement, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import { Button } from "./components/ui/button";
import Sidebar from "./components/my_own/Sidebar";

import { TimerContext } from "./context/TimerContext";

import Main from "./pages/Main";
import AccountPage from "./pages/account/AccountPage";
import TypingPage from "./pages/typing/TypingPage";
import TypingSection from "./pages/typing/TypingSection";
import LoginPage from "./pages/login/LoginPage";

import "./index.css";
import "./assets/fonts/fonts.css";

export default function App(): ReactElement {
  const [persistentTimerVal, setPersistentTimerVal] = useState(30);
  return (
    <TimerContext.Provider
      value={{ persistentTimerVal, setPersistentTimerVal }}
    >
      <BrowserRouter>
        <div className="flex flex-col h-screen">
          <div className="text-white bg-vscode-primary border-2 border-vscode-outline1 h-12 w-screen flex justify-center items-center">
            <div className="h-9 w-1/2 bg-vscode-secondary border-2 border-vscode-outline1 rounded-lg flex justify-center items-center">
              <p>Typing Some Code</p>
            </div>
          </div>
          <div className="bg-vscode-primary h-screen border-green-700 border-2 flex flex-1 w-full">
            <Sidebar />
            <div className="w-full">
              <NavBar></NavBar>
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/type" element={<TypingPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="login" element={<LoginPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </TimerContext.Provider>
  );
}
