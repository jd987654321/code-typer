import { useState, ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import { Button } from "./components/ui/button";

import Main from "./pages/Main";
import AccountPage from "./pages/account/AccountPage";
import TypingPage from "./pages/typing/TypingPage";
import TypingSection from "./pages/typing/TypingSection";

import "./index.css";

export default function App(): ReactElement {
  /**
   * so i want a login page
   * -> stats
   *
   * account page
   * about page
   *
   * typing page
   * typing done page -> stats similar to monkeyType
   *
   *
   *
   *
   */
  return (
    <BrowserRouter>
      <div className="bg-gray-400 h-screen">
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/type" element={<TypingPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
