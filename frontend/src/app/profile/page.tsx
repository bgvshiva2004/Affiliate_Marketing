"use client";
import React, { useState, useEffect } from "react";
import * as Components from "@/components/LoginForm";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  HomeIcon,
  Eye,
  EyeOff
} from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],
  weight:"400",
})

export default function Profile() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [signIn, setSignIn] = useState<boolean>(true);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

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
      const response = await fetch("https://affiliatemarketing-production.up.railway.app/backend/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      const data = await response.json();

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   console.error("Error : ", errorData);
      //   alert("SignUp Failed");
      // } else {
      //   const result = await response.json();
      //   console.log("sign up successful : ", result);
      //   alert("SignUp Successful. Please SignIn");
      //   window.location.reload();
      // }

      if (!response.ok) {
        if (data.username) {
          toast.error(Array.isArray(data.username) ? data.username[0] : data.username);
        } else if (data.password) {
          toast.error(Array.isArray(data.password) ? data.password[0] : data.password);
        } else {
          toast.error("Sign up failed. Please check your information.");
        }
      } else {
        toast.success("Sign up successful! Please sign in to continue.");
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      // console.error("Sign Up Error : ", error);
      // alert("SignUp Error!!");
      toast.error("Unable to connect to the server. Please try again later.");
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("https://affiliatemarketing-production.up.railway.app/backend/api/v1/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
      });

      const data = await response.json();

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   console.error("Sign In failed ", errorData);
      //   alert("Sign In error");
      // } else {
      //   const result = await response.json();
      //   Cookies.set("access", result.access);
      //   Cookies.set("refresh", result.refresh);
      //   const userDetails = jwtDecode(result.access);
      //   Cookies.set("user", JSON.stringify(userDetails));
      //   window.location.href = "/";
      // }

      if (!response.ok) {
        if (data.detail) {
          toast.error("Invalid username or password.");
        } else {
          toast.error("Sign in failed. Please check your credentials.");
        }
      } else {
        Cookies.set("access", data.access);
        Cookies.set("refresh", data.refresh);
        const userDetails = jwtDecode(data.access);
        Cookies.set("user", JSON.stringify(userDetails));
        
        toast.success("Successfully signed in!");
        
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
      
    } catch (error) {
      // console.error("Sign In error : ", error);
      // alert("SignIn error!!");
      toast.error("Unable to connect to the server. Please try again later.");
    }
  };

  const handleSignOut = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("user");
    setIsLoggedIn(false);
    setUser(null);
    toast.success("Successfully signed out!");
    
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);

  };

  return (
    <div className={`min-h-screen w-full py-20 px-4 flex flex-col items-center justify-center bg-gradient-radial from-[#027cc4] to-white ${poppins.className}`}>
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        style={{ 
          top: '20px',
          zIndex: 1000000
        }}
        toastStyle={{
          backgroundColor: '#0355bb',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(3, 85, 187, 0.15)',
          fontSize: '14px',
          padding: '12px 24px',
          fontWeight: '500'
        }}
      />
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
                  type={showSignUpPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
                  type={showSignInPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={signInData.password}
                  onChange={handleSignInChange}
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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