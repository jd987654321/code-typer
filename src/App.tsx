import { useState, ReactElement, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import { Button } from "./components/ui/button";
import Sidebar from "./components/my_own/Sidebar";
import { Analytics } from "@vercel/analytics/react";

import TimerProvider from "@/context/TimerProvider";

import AccountPage from "./pages/account/AccountPage";
import TypingPage from "./pages/typing/TypingPage";
import TypingSection from "./pages/typing/TypingSection";
import LoginPage from "./pages/login/LoginPage";

import LoginModal from "./components/my_own/LoginModal";

import useAuthStore from "@/store/authStore";

import "./index.css";
import "./assets/fonts/fonts.css";

export default function App(): ReactElement {
  const modalOpen = useAuthStore((state) => state.modalOpen);

  return (
    <BrowserRouter>
      <TimerProvider>
        <div className="flex flex-col w-screen h-screen relative bg-vscode-background">
          {/* <div
          className={`${modalOpen ? "" : "hidden"} absolute flex justify-center items-center w-screen h-screen bg-[rgba(0,0,0,0.6)] z-20`}
        >
          <LoginModal />
        </div> */}
          <div className="text-white bg-vscode-primary border-[1px] border-vscode-outline1 h-12 w-screen flex justify-center items-center">
            <div className="h-7 w-1/2 bg-vscode-secondary border-[1px] border-vscode-outline1 rounded-lg flex justify-center items-center">
              <p className="text-sm">Typing Some Code</p>
            </div>
          </div>
          <div className="bg-vscode-background h-screen  flex flex-1 w-full">
            <Sidebar />
            <div className="w-full">
              <NavBar></NavBar>
              <Routes>
                <Route path="/" element={<TypingPage />} />
                <Route path="/stats" element={<AccountPage />} />
                <Route path="/account" element={<AccountPage />} />
                {/* <Route path="login" element={<LoginPage />} /> */}
              </Routes>
            </div>
          </div>
        </div>
      </TimerProvider>
      <Analytics />
    </BrowserRouter>
  );
}
