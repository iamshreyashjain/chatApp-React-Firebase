import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, query, where, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./context/firebase";
import { BiSolidSend } from "react-icons/bi";
import { MdAccessTime } from "react-icons/md";

export default function Chat(props) {
    const { room } = props;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
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

    return (
        <div className="border-2 border-gray-900 rounded-md lg:w-3/12 w-screen">
        <div className="text-center bg-blue-600 text-white text-b py-2">Chat</div>
            <div className="h-64 overflow-scroll bg-white p-2">
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
                            className={`flex items-start ${
                                isSender ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-xs p-2 rounded-lg m-1 ${
                                    isSender
                                        ? "bg-blue-200 text-right"
                                        : "bg-gray-200 text-left"
                                }`}
                            >
                                <p>{message.user}</p>
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs text-gray-600">{formattedTime}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <form onSubmit={handleSubmit} className="flex">
                <input
                    className="border-2 border-gray-400 rounded-md px-2 py-1 w-[75%]"
                    placeholder=""
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 px-3 py-1 rounded-md text-white w-[25%]"
                    disabled={loading}
                >
                    {loading ? (
                        <MdAccessTime size={25} />
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
