import { useEffect, useState } from "react";
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle emoji picker
  const messageRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(messageRef, where("room", "==", room));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      // Sort messages by timestamp
      messages.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [room]); // Re-run if room changes

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
    setNewMessage((prevMessage) => prevMessage + emoji.native); // Append emoji to message
    setShowEmojiPicker(false); // Close picker after selection
  };

  return (
    <div className="w-screen min-h-screen flex flex-col relative bg-teal-100">
      <div className="flex justify-center items-center text-center bg-teal-600 text-white py-2 sticky gap-2">
        <IoChatboxEllipses size={30} className="text-blue-500 bg-white rounded-full p-1" />
        <span className="text-xl">Chat</span>
      </div>
      <div className="flex-grow overflow-y-auto bg-teal-100 p-2 sticky">
        {messages.map((message) => {
          const isSender = message.user === auth.currentUser.displayName;
          const formattedTime = message.createdAt
            ? new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }).format(message.createdAt.toDate())
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
                <p className="sm:text-xl text-lg">{message.text}</p>
                <p className="text-xs text-gray-600">{formattedTime}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4 px-1">
        <input
          className="border-2 border-gray-500 px-2 py-1 w-[97%] rounded-full outline-none"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <div className="relative">
          <button
            type="button"
            className="bg-gray-300 px-3 py-2 rounded-full text-2xl hover:bg-gray-200"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-0 right-0 z-10">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-teal-600 px-3 py-3 text-white  rounded-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <MdAccessTime size={25} />
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <BiSolidSend size={25} />
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
