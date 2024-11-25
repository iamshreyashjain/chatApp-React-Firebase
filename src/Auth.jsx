import {auth, provider} from './context/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useState } from 'react';


import Cookies from 'universal-cookie'
const cookie = new Cookies()

export default function Auth(props){

    const { setisAuth} = props; 

    const signInWithGoogle = async ()=>{
    try{
        const result = await signInWithPopup(auth, provider);
        cookie.set("auth-token", result.user.refreshToken);
        setisAuth(true)
        }
        catch(error){
            console.log(error)
    }
    }
    
    return(
        <>
        <center><h1>Hello, Sign in With Google to Continue</h1></center>
        <button 
            className='bg-gray-100 border-2 border-gray-800 py-1 px-3 rounded-md hover:bg-gray-200' 
            onClick = {signInWithGoogle}>Sign In With Google</button>
        </>
    )
}