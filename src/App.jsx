import {  useState, useRef } from "react";

import Auth from "./Auth";
import Cookies from 'universal-cookie'
import Chat from "./Chat";
const cookie = new Cookies()

export default function App() {
  const [isAuth, setisAuth] = useState(cookie.get('auth-token'))
  const [room, setRoom] = useState(null)

  const roomInputRef = useRef(null)

    if(!isAuth){
      return(
        <div> <Auth setisAuth= {setisAuth} /></div>
      );
    }
    return(
        <>
          { room ? (
            <> <Chat room = {room} /> </>
          ) : (
            <div className="m-2">
              <label>Enter Room Name: </label>
              <input 
                className="border border-gray-900 rounded p-1"
                ref = {roomInputRef} />
                <br/>
              <button 
                onClick={()=> setRoom(roomInputRef.current.value)}
                className="text-center p-1 bg-blue-700 text-white rounded-md "
                >Enter Chat</button>
            </div>
          )}
        </>
      );
    }
