"use client"
import axios from "axios";
import React , { useState } from "react";
import * as Components from '@/components/LoginForm';
import Cookies from 'js-cookie'


export default function Profile() 
{

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
                alert("SignUp Successfull");
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
                Cookies.set('access',result.access)
                Cookies.set('refresh',result.refresh)
                console.log("Sign In successfull" ,  result);
                alert("SignIn successfull");
            }

        }catch(error){
            console.error("Sign In error : ",error);
            alert("SignIn error!!");
        }

    };

    return(
        <div className="w-screen pt-24 flex justify-center items-center">
         <Components.Container>
             <Components.SignUpContainer signinIn={signIn}>
                 <Components.Form onSubmit={handleSignUpSubmit}>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input 
                        type='text'
                        placeholder='username'
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
                        placeholder='username'
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
        </div>
    );
}
