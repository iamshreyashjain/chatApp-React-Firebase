import { useEffect, useState, useRef } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./context/firebase";
import { BiSolidSend } from "react-icons/bi";
import { MdAccessTime } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function Chat(props) {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null); // Reference for emoji picker

  const messageRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(messageRef, where("room", "==", room));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      messages.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [room]);

  useEffect(() => {
    // Function to detect clicks outside of the emoji picker
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    // Attach event listener when emoji picker is open
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    setLoading(true);

    try {
      await addDoc(messageRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        room: room,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error adding message: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative flex flex-col w-screen min-h-screen bg-teal-100">
      <div className="sticky flex items-center justify-center gap-2 py-2 text-center text-white bg-teal-600">
        <IoChatboxEllipses size={30} className="p-1 text-blue-500 bg-white rounded-full" />
        <span className="text-xl">Chat</span>
      </div>
      <div className="sticky flex-grow p-2 overflow-y-auto bg-teal-100">
        {messages.map((message) => {
          const isSender = message.user === auth.currentUser.displayName;
          const formattedTime = message.createdAt
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true, 
            }).format(message.createdAt.toDate()).replace(",", "") // Remove extra comma
          : "Loading...";
        

          return (
            <div
              key={message.id}
              className={`flex items-start ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-1 rounded-lg ${
                  isSender
                    ? "bg-teal-300 rounded-md text-left m-1 p-2"
                    : "bg-green-200 rounded-md text-right m-1 p-2"
                }`}
              >
                <p className="text-sm font-semibold">{message.user}</p>
                <p className="text-lg ">{message.text}</p>
                <p className="text-xs text-gray-600">{formattedTime}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 px-1 mb-8">
        <input
          className="border-2 border-gray-500 px-2 py-1 w-[97%] rounded-full outline-none"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="relative" ref={emojiPickerRef}>
          <button
            type="button"
            className="px-3 py-2 text-2xl bg-gray-300 rounded-full hover:bg-gray-200"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute right-0 z-10 bottom-10">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="px-3 py-3 text-white bg-teal-600 rounded-full"
          disabled={loading}
        >
          {loading ? (
            <MdAccessTime size={25} />
          ) : (
            <BiSolidSend size={25} />
          )}
        </button>
      </form>
    </div>
  );
}
