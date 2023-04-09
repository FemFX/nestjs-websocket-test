import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  query: {
    user: "test",
  },
  auth: {
    token: typeof window !== "undefined" ? localStorage.getItem("token") : "",
  },
});

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");
  useEffect(() => {
    socket.emit(
      "getMessages",
      {
        toUser: "test1",
      },
      (messages: any) => {
        setMessages(messages);
      }
    );
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("onMessage", (data) => {
      // setMessages(messages.concat(data.newMessage));
      setMessages([data.newMessage, ...messages]);
    });

    return () => {
      socket.off("connect");
      socket.off("onMessage");
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center ">
      {/* <input type="text" placeholder="from user" value="" /> */}
      <input
        type="text"
        placeholder="to user"
        value={toUser}
        onChange={(e) => setToUser(e.target.value)}
      />
      <input
        type="text"
        placeholder="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={() =>
          socket.emit("newMessage", {
            toUser,
            message,
          })
        }
      >
        submit
      </button>
      <hr />

      <div>
        {messages.map((msg: any) => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
    </div>
  );
}
