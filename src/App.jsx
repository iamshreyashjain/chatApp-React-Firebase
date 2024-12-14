import { useState, useRef } from "react";
import chatIcon from './../asset/images/chatIcon.png'

import Auth from "./Auth";
import Cookies from 'universal-cookie'
import Chat from "./Chat";
const cookie = new Cookies()

import { FaUserSecret } from "react-icons/fa6";
import { IoChatboxEllipses } from "react-icons/io5";

export default function App() {
  const [isAuth, setisAuth] = useState(cookie.get('auth-token'))
  const [room, setRoom] = useState(null)

  const roomInputRef = useRef(null)

  if (!isAuth) {
    return (
      <div> <Auth setisAuth={setisAuth} /></div>
    );
  }
  return (
    <>
      {room ? (
        <> <Chat room={room} /> </>
      ) : (
        <div className="mx-auto text-center sm:mt-24 p-4   shadow-md sm:w-4/12 bg-teal-100 h-screen min-w-screen sm:h-96 ">
          <span className='flex items-center justify-center bg-purple-400 shadow-md rounded-full w-2/12 p-1 mx-auto mt-6 sm-mt-0'>
            <img src={chatIcon} width={100} />

          </span>
          <div className="flex items-center justify-center mt-4 gap-2">
            <FaUserSecret size={30} className="" />
            <label className="text-xl">Enter Room Name </label>
            <FaUserSecret size={30} className="" />
          </div>
          <input
            className="border border-gray-900 rounded p-2 mt-4 outline-none "
            ref={roomInputRef} />
          <br />

          <div 
          className='flex items-center justify-center gap-2 mx-auto mt-8 shadow-md sm:w-5/12 p-2 w-6/12 rounded-lg bg-teal-600'
          onClick={() => {
            const roomName = roomInputRef.current.value.trim(); // Trim whitespace
            if (roomName === "") {
              alert("Room name cannot be empty!"); // Show an alert or handle it differently
              return;
            }
            setRoom(roomName);
          }}
        >
          <span className="text-white"> Enter Room</span>
          <IoChatboxEllipses size={30} className="text-blue-600 bg-white rounded-full p-1" />
        </div>
        </div>
      )}
    </>
  );
}
