"use client"
import axios from "axios";
import React , { useState , useEffect } from "react";
import * as Components from '@/components/LoginForm';
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation'

export default function Profile() 
{
    const router = useRouter()

    const [ isLoggedIn , setIsLoggedIn ] = useState(false) 
    const [ user , setUser ]= useState<any>(null)

    useEffect(() => {
        async function checkUserStatus(){
          try{
            const token = Cookies.get('access')
            if(!token){
                setIsLoggedIn(false)
            }else{
                setIsLoggedIn(true)
                const userCookie = Cookies.get('user')
                if(userCookie){
                    const userDetails = JSON.parse(userCookie)
                    setUser(userDetails)
                }
            }
          }catch(error){
            console.error("Error checking user status:", error);
            setIsLoggedIn(false); 
          }
        }
        checkUserStatus();
    } , []);

    const [signIn , setSignIn ] = useState<boolean>(true); 

    const [ signUpData , setSignUpData ] = useState({
        // name : "",
        username : "",
        password : "",
    })

    const [ signInData , setSignInData ] = useState({
        username : "",
        password : "",
    })

    const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name , value } = e.target;
        setSignUpData((prevData) => ({
            ...prevData ,
            [name] : value,
        }));
    };

    const handleSignInChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name , value } =  e.target;
        setSignInData((prevData) => ({
            ...prevData,
            [name] : value,
        }));
    };

    const handleSignUpSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{

            const response = await fetch("http://127.0.0.1:8000/api/v1/signup" , {
                method : "POST",    
                headers: {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify(signUpData),
            });

            if(!response.ok){
                const errorData = await response.json();
                console.error("Error : ",errorData);
                alert("SignUp Failed");
            }else{
                const result = await response.json();
                
                console.log("sign up successful : ",result);
                alert("SignUp Successfull . Please SignIn");
                window.location.reload();
            }

        }catch(error){
            console.error("Sign Up Error : " , error);
            alert("SignUp Error!!");
        }
    };

    const handleSignInSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try{

            const response = await fetch("http://127.0.0.1:8000/api/v1/token/" , {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify(signInData),
            });

            if(!response.ok){
                const errorData = await response.json();
                console.error("Sign In failed " , errorData);
                alert("Sign In error");
            }else{
                const result = await response.json();
                // console.log("result : " , result)
                Cookies.set('access',result.access)
                Cookies.set('refresh',result.refresh)
                const userDetails = jwtDecode(result.access);
                Cookies.set('user',JSON.stringify(userDetails))
                // console.log("Sign In successfull" ,  result);
                // router.refresh()
                // router.push('/')
                window.location.href = '/'
            }

        }catch(error){
            console.error("Sign In error : ",error);
            alert("SignIn error!!");
        }

    };

    const handleSignOut = () => {
        Cookies.remove('access');
        Cookies.remove('refresh');
        Cookies.remove('user');

        // router.refresh()

        setIsLoggedIn(false);
        setUser(null);

        // router.push('/');
        window.location.href = '/'
    }

    return(
        <div className="w-screen h-screen pt-10 flex justify-center items-center">
            {isLoggedIn ? (
                <div>
                    <h2>Welcome, {user?.username || 'User'}!</h2>
                    <button onClick={handleSignOut} className="px-4 py-2 mt-4 bg-red-500 text-white rounded">
                        Sign Out
                    </button>
                </div>
            ) : (
                <Components.Container>
                    <Components.SignUpContainer signinIn={signIn}>
                        <Components.Form onSubmit={handleSignUpSubmit}>
                            <Components.Title>Create Account</Components.Title>
                            <Components.Input 
                                type='text'
                                placeholder='Username'
                                name = "username"
                                value = {signUpData.username}
                                onChange={handleSignUpChange}
                            />
                            <Components.Input 
                                type='password'
                                placeholder='Password'     
                                name = "password"
                                value = {signUpData.password}
                                onChange={handleSignUpChange}
                            />
                            <Components.Button type="submit">Sign Up</Components.Button>
                        </Components.Form>
                    </Components.SignUpContainer>

                    <Components.SignInContainer signinIn={signIn}>
                        <Components.Form onSubmit={handleSignInSubmit}>
                            <Components.Title>Sign in</Components.Title>
                            <Components.Input 
                                type='text'
                                placeholder='Username'
                                name = "username"
                                value = {signInData.username}
                                onChange={handleSignInChange} 
                            />
                            <Components.Input 
                                type='password'
                                placeholder='Password'
                                name = "password"
                                value = {signInData.password}
                                onChange={handleSignInChange}     
                            />
                            <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                            <Components.Button type="submit">Sigin In</Components.Button>
                        </Components.Form>
                    </Components.SignInContainer>

                    <Components.OverlayContainer signinIn={signIn}>
                        <Components.Overlay signinIn={signIn}>

                        <Components.LeftOverlayPanel signinIn={signIn}>
                            <Components.Title>Welcome Back!</Components.Title>
                            <Components.Paragraph>
                                To keep connected with us please login with your personal info
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => setSignIn(true)}>
                                Sign In
                            </Components.GhostButton>
                            </Components.LeftOverlayPanel>

                            <Components.RightOverlayPanel signinIn={signIn}>
                            <Components.Title>Hello, Friend!</Components.Title>
                            <Components.Paragraph>
                                Enter Your personal details and start journey with us
                            </Components.Paragraph>
                                <Components.GhostButton onClick={() => setSignIn(false)}>
                                    Sigin Up
                                </Components.GhostButton> 
                            </Components.RightOverlayPanel>
        
                        </Components.Overlay>
                    </Components.OverlayContainer>

                </Components.Container>
            )}
         
        </div>
    );
}
