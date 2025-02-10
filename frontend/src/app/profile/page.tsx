"use client";
import React, { useState, useEffect } from "react";
import * as Components from "@/components/LoginForm";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { 
  User, 
  KeyRound, 
  Mail, 
  Heart, 
  Calendar,
  LogIn, 
  UserPlus,
  LogOut,
  ArrowRight,
  ArrowLeft,
  Lock,
  UserCircle,
  HomeIcon
} from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [signIn, setSignIn] = useState<boolean>(true);

  useEffect(() => {
    async function checkUserStatus() {
      try {
        const token = Cookies.get("access");
        if (!token) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
          const userCookie = Cookies.get("user");
          if (userCookie) {
            const userDetails = JSON.parse(userCookie);
            setUser(userDetails);
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        setIsLoggedIn(false);
      }
    }
    checkUserStatus();
  }, []);

  const [signUpData, setSignUpData] = useState({
    username: "",
    password: "",
    hobbies: "",
    age: "",
  });

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error : ", errorData);
        alert("SignUp Failed");
      } else {
        const result = await response.json();
        console.log("sign up successful : ", result);
        alert("SignUp Successful. Please SignIn");
        window.location.reload();
      }
    } catch (error) {
      console.error("Sign Up Error : ", error);
      alert("SignUp Error!!");
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Sign In failed ", errorData);
        alert("Sign In error");
      } else {
        const result = await response.json();
        Cookies.set("access", result.access);
        Cookies.set("refresh", result.refresh);
        const userDetails = jwtDecode(result.access);
        Cookies.set("user", JSON.stringify(userDetails));
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Sign In error : ", error);
      alert("SignIn error!!");
    }
  };

  const handleSignOut = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full py-20 px-4 flex flex-col items-center justify-center bg-gradient-radial from-[#027cc4] to-white">
      {isLoggedIn ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <UserCircle size={64} className="text-[#027cc4]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#0355bb] mb-2">
            Welcome, {user?.username || "User"}!
          </h2>
          <p className="text-slate-600 mb-6">We are glad to have you here</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 text-[#027cc4] border border-[#027cc4] rounded-lg hover:bg-[#027cc4] hover:text-white transition-all duration-300"
            >
              <HomeIcon size={18} />
              Home
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-[#027cc4] text-white rounded-lg hover:bg-[#0355bb] transition-all duration-300"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <Components.Container>
          <Components.SignUpContainer signinIn={signIn}>
            <Components.Form onSubmit={handleSignUpSubmit}>
              <Components.Title>
                <UserPlus size={20} />
                Create Account
              </Components.Title>
              <Components.InputContainer>
                <Components.InputIcon>
                  <User size={16} />
                </Components.InputIcon>
                <Components.Input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={signUpData.username}
                  onChange={handleSignUpChange}
                />
              </Components.InputContainer>
              <Components.InputContainer>
                <Components.InputIcon>
                  <KeyRound size={16} />
                </Components.InputIcon>
                <Components.Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                />
              </Components.InputContainer>
              <Components.InputContainer>
                <Components.InputIcon>
                  <Heart size={16} />
                </Components.InputIcon>
                <Components.Input
                  type="text"
                  placeholder="Hobbies"
                  name="hobbies"
                  value={signUpData.hobbies}
                  onChange={handleSignUpChange}
                />
              </Components.InputContainer>
              <Components.InputContainer>
                <Components.InputIcon>
                  <Calendar size={16} />
                </Components.InputIcon>
                <Components.Input
                  type="number"
                  placeholder="Age"
                  name="age"
                  value={signUpData.age}
                  onChange={handleSignUpChange}
                />
              </Components.InputContainer>
              <Components.Button type="submit">
                <UserPlus size={16} />
                Sign Up
              </Components.Button>
            </Components.Form>
          </Components.SignUpContainer>

          <Components.SignInContainer signinIn={signIn}>
            <Components.Form onSubmit={handleSignInSubmit}>
              <Components.Title>
                <LogIn size={20} />
                Sign in
              </Components.Title>
              <Components.InputContainer>
                <Components.InputIcon>
                  <User size={16} />
                </Components.InputIcon>
                <Components.Input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={signInData.username}
                  onChange={handleSignInChange}
                />
              </Components.InputContainer>
              <Components.InputContainer>
                <Components.InputIcon>
                  <Lock size={16} />
                </Components.InputIcon>
                <Components.Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={signInData.password}
                  onChange={handleSignInChange}
                />
              </Components.InputContainer>
              <Components.Anchor href="#">
                <KeyRound size={14} />
                Forgot your password?
              </Components.Anchor>
              <Components.Button type="submit">
                <LogIn size={16} />
                Sign In
              </Components.Button>
            </Components.Form>
          </Components.SignInContainer>

          <Components.OverlayContainer signinIn={signIn}>
            <Components.Overlay signinIn={signIn}>
              <Components.LeftOverlayPanel signinIn={signIn}>
                <Components.Title className="!text-white">Welcome Back!</Components.Title>
                <Components.Paragraph>
                  To keep connected with us please login with your personal info
                </Components.Paragraph>
                <Components.GhostButton onClick={() => setSignIn(true)}>
                  <ArrowLeft size={16} />
                  Sign In
                </Components.GhostButton>
              </Components.LeftOverlayPanel>

              <Components.RightOverlayPanel signinIn={signIn}>
                <Components.Title className="!text-white">Hello, Friend!</Components.Title>
                <Components.Paragraph>
                  Enter your personal details and start journey with us
                </Components.Paragraph>
                <Components.GhostButton onClick={() => setSignIn(false)}>
                  Sign Up
                  <ArrowRight size={16} />
                </Components.GhostButton>
              </Components.RightOverlayPanel>
            </Components.Overlay>
          </Components.OverlayContainer>
        </Components.Container>
      )}
    </div>
  );
}