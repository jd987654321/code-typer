import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Typewriter } from "react-simple-typewriter";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginOrSignUp, setLoginOrSignUp] = useState<"login" | "signup">(
    "login"
  );
  const [k, setK] = useState(0);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [reSignupPassword, setReSignupPassword] = useState("");
  const [meetsCharRequirement, setMeetsCharRequirement] = useState(false);
  const [meetsSymbolRequirement, setMeetsSymbolRequirement] = useState(false);
  const [meetsNumRequirement, setMeetsNumRequirement] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const checkReqs = () => {
    setPasswordsMatch(signupPassword === reSignupPassword && !!signupPassword);
    setMeetsCharRequirement(signupPassword.length >= 8);
    setMeetsNumRequirement(/[^A-Za-z0-9]/.test(signupPassword));
    setMeetsNumRequirement(/[0-9]/.test(signupPassword));
  };

  const resetAllValues = () => {
    setEmail("");
    setPassword("");
    setSignupEmail("");
    setSignupPassword("");
    setReSignupPassword("");
    checkReqs();
  };

  useEffect(() => {
    checkReqs();
  }, [signupPassword, reSignupPassword]);

  const DisplayRequirement = ({
    requirementBool,
    message,
  }: {
    requirementBool: boolean;
    message: string;
  }) => {
    return (
      <div className="flex items-center gap-2">
        {requirementBool ? (
          <IoIosCheckmarkCircleOutline size={20} color={"green"} />
        ) : (
          <IoIosCloseCircleOutline size={20} color="red" />
        )}
        <div className="text-sm">{message}</div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "500px",
      }}
      className="font-vscodeText py-8 rounded-2xl transition-all duration-500 ease-out flex flex-col items-center bg-vscode-background w-[400px] h-[600px] text-white"
    >
      {loginOrSignUp === "login" ? (
        <>
          <div className="text-2xl h-10 mb-8">
            <Typewriter
              key={"aodijojiawd" + k}
              words={["Login"]}
              typeSpeed={100}
            />
          </div>
          <div className="border-b-2 border-vscode-outline1 flex items-center w-[300px] mb-4">
            <input
              placeholder="email"
              className="bg-vscode-background border-none focus:outline-none focus:ring-0 flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div className="flex flex-col items-end gap-2 mb-8">
            <div className="border-b-2 border-vscode-outline1 flex items-center w-[300px]">
              <input
                placeholder="password"
                className="bg-vscode-background border-none focus:outline-none focus:ring-0 flex-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
              />
              <div
                className="hover:cursor-pointer mr-4"
                onClick={() => setShowPassword((state) => !state)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <button className="text-blue-600 text-sm">Forget Password?</button>
          </div>
          <button className="border-2 border-vscode-outline1 py-3 px-6 text-lg mb-8">
            Sign in
          </button>
          <button className="border-2 border-vscode-outline1 flex justify-around items-center px-4 py-4 gap-4 text-lg mb-4">
            Login with Google
            <FcGoogle size={24} />
          </button>
          <button className="border-2 border-vscode-outline1 flex justify-around items-center p-4 gap-4 text-lg mb-8">
            Login with Github
            <FaGithub size={24} />
          </button>
          <div className="flex whitespace-pre">
            <div>{"New Here? "}</div>
            <button
              onClick={() => {
                setLoginOrSignUp("signup");
                setK((value) => value + 1);
                resetAllValues();
              }}
              className="text-blue-600"
            >
              Sign up here
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl h-10 mb-8">
            <Typewriter
              key={"daowdjoiawdawd" + k}
              words={["Sign Up"]}
              typeSpeed={100}
            />
          </div>
          <div className="border-b-2 border-vscode-outline1 flex items-center w-[300px] mb-4">
            <input
              placeholder="email"
              className="bg-vscode-background border-none focus:outline-none focus:ring-0 flex-1"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              type="email"
            />
          </div>
          <div className="border-b-2 border-vscode-outline1 flex items-center w-[300px] mb-8">
            <input
              placeholder="password"
              className="bg-vscode-background border-none focus:outline-none focus:ring-0 flex-1"
              value={signupPassword}
              onChange={(e) => {
                setSignupPassword(e.target.value);
                checkReqs();
              }}
              type="text"
            />
          </div>
          <div className="space-y-2 mb-8">
            <DisplayRequirement
              requirementBool={meetsCharRequirement}
              message="Password must be 8 or more characters"
            />
            <DisplayRequirement
              requirementBool={meetsSymbolRequirement}
              message="Password must include a symbol"
            />
            <DisplayRequirement
              requirementBool={meetsNumRequirement}
              message="Password must include a number"
            />
            <DisplayRequirement
              requirementBool={passwordsMatch}
              message="Passwords match"
            />
          </div>
          <div className="border-b-2 border-vscode-outline1 flex items-center w-[300px] mb-8">
            <input
              placeholder="re-type password"
              className="bg-vscode-background border-none focus:outline-none focus:ring-0 flex-1"
              value={reSignupPassword}
              onChange={(e) => setReSignupPassword(e.target.value)}
              type="text"
            />
          </div>
          <button className="border-2 border-vscode-outline1 py-3 px-6 text-lg mb-8">
            Sign Up
          </button>
          <div className="flex whitespace-pre">
            <button
              onClick={() => {
                setLoginOrSignUp("login");
                setK((value) => value + 1);
                resetAllValues();
              }}
              className="text-blue-600"
            >
              Back to Login
            </button>
          </div>
        </>
      )}
    </div>
  );
}
