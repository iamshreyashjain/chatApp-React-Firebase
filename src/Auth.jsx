import {auth, provider} from './context/firebase';
import { signInWithPopup } from 'firebase/auth';
import GoogleIcon from './../asset/images/Google.png'
import chatIcon from './../asset/images/chatIcon.png'


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
        <div className='mx-auto text-center sm:mt-24 p-4 border-green-300 border-4 rounded shadow-md sm:w-4/12 bg-green-200 h-screen     min-w-screen sm:h-72 '>
            <span className='flex items-center justify-center bg-purple-400 shadow-md rounded-full w-2/12 p-1 mx-auto mt-6 sm-mt-0'>
            <img src= {chatIcon} width={100}/>

            </span>
            <div className='mt-10'>
                <span> <span className='font-semibold'> Hello</span>, Sign in With <span className='font-semibold'>Google</span> to Continue</span>
            </div>
            <div className='flex items-center justify-center gap-2 mx-auto mt-4 border-2 border-blue-300 sm:w-6/12 p-2 w-8/12 rounded-lg bg-blue-100 hover:bg-blue-300 '
            onClick = {signInWithGoogle}> 
            <img src= {GoogleIcon} width={30}/>
            <span> Sign In With Google </span>
             

            
               
            </div>
        </div>
        </>
    )
}