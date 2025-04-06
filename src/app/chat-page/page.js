// 'use client'
// import { useState, useEffect } from "react";
// import { auth, db } from "../firebaseConfig";
// import { collection, addDoc, serverTimestamp, onSnapshot, orderBy, query } from "firebase/firestore";
// import { signOut } from "firebase/auth";

// export default function Chat() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     if (!auth.currentUser || !selectedUserUid) return;
  
//     const q = query(
//       collection(db, "messages"),
//       orderBy("createdAt")
//     );
  
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const allMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
//       // 🧠 Filter messages: currentUser <--> selectedUser
//       const filteredMessages = allMessages.filter(
//         (msg) =>
//           (msg.from === auth.currentUser.uid && msg.to === selectedUserUid) ||
//           (msg.from === selectedUserUid && msg.to === auth.currentUser.uid)
//       );
  
//       setMessages(filteredMessages);
//     });
  
//     return () => unsubscribe();
//   }, [selectedUserUid]);
  

//   const sendMessage = async (e) => {
//     e.preventDefault(); // stop form from reloading the page
  
//     if (!auth.currentUser) {
//       console.log("User not logged in.");
//       return;
//     }
  
//     const messageData = {
//         text: message,
//         from: auth.currentUser.uid,
//         to: selectedUserUid, // 👈 select kis user ko bhejna hai
//         createdAt: serverTimestamp(),
//       };
      
  
//     await addDoc(collection(db, "messages"), messageData);
//     setMessage(""); // ✅ clear input
//   };

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold">Chat Room</h1>
//         <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-3 py-1 rounded">
//           Logout
//         </button>
//       </div>
//       <div className="h-[400px] overflow-y-auto border p-2 mb-4">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`p-2 my-1 ${msg.uid === auth.currentUser?.uid ? "text-right" : "text-left"}`}>
//             <p className="text-sm text-gray-600">{msg.name}</p>
//             <p className="bg-gray-200 inline-block px-3 py-1 rounded">{msg.text}</p>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={sendMessage} className="flex gap-2">
//         <input
//           className="flex-1 border p-2 rounded"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message"
//         />
//         <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }


// 'use client'
// import { useState, useEffect } from "react";
// import { auth, db } from "../firebaseConfig";
// import { collection, addDoc, serverTimestamp, onSnapshot, orderBy, query } from "firebase/firestore";
// import { signOut } from "firebase/auth";

// export default function Chat({ otherUserId }) { // 👈 Pass other user's UID as prop
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   const currentUser = auth.currentUser;
//   const currentUserId = currentUser?.uid;

//   // 🔐 Create a unique chat ID based on both users
//   const getChatId = (uid1, uid2) => {
//     return [uid1, uid2].sort().join("_"); // ensures consistent ordering
//   };

//   const chatId = currentUserId && otherUserId ? getChatId(currentUserId, otherUserId) : null;

//   useEffect(() => {
//     if (!chatId) return;

//     const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       setMessages(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//     });

//     return unsubscribe;
//   }, [chatId]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!currentUser || !chatId) return;

//     const messageData = {
//       text: message,
//       name: currentUser.displayName || "Anonymous",
//       uid: currentUser.uid,
//       createdAt: serverTimestamp(),
//     };

//     await addDoc(collection(db, "chats", chatId, "messages"), messageData);
//     setMessage("");
//   };

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold">Private Chat</h1>
//         <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-3 py-1 rounded">
//           Logout
//         </button>
//       </div>
//       <div className="h-[400px] overflow-y-auto border p-2 mb-4">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`p-2 my-1 ${msg.uid === currentUserId ? "text-right" : "text-left"}`}>
//             <p className="text-sm text-gray-600">{msg.name}</p>
//             <p className="bg-gray-200 inline-block px-3 py-1 rounded">{msg.text}</p>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={sendMessage} className="flex gap-2">
//         <input
//           className="flex-1 border p-2 rounded"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message"
//         />
//         <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }



// 'use client'
// import { useState, useEffect } from 'react';
// import { auth, db } from '../firebaseConfig';
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
//   doc,
//   getDocs,
//   setDoc
// } from 'firebase/firestore';
// import { signOut } from 'firebase/auth';

// export default function Chat() {
//   const [search, setSearch] = useState('');
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   const currentUser = auth.currentUser;

//   // 🟨 Fetch all users (except current user)
//   useEffect(() => {
//     const q = query(collection(db, 'users'));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const usersList = snapshot.docs
//         .map((doc) => ({ ...doc.data(), id: doc.id }))
//         .filter((user) => user.email !== currentUser?.email);
//       setUsers(usersList);
//     });

//     return unsubscribe;
//   }, []);

//   // 🟨 Get chat ID between current user and selected user
//   const getChatId = (uid1, uid2) => {
//     return [uid1, uid2].sort().join('_');
//   };

//   // 🟩 Load messages for selected chat
//   useEffect(() => {
//     if (!selectedUser) return;
//     const chatId = getChatId(currentUser.uid, selectedUser.uid);
//     const q = query(collection(db, `chats/${chatId}/messages`));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     });

//     return unsubscribe;
//   }, [selectedUser]);

//   // 🟩 Send message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!message || !selectedUser) return;

//     const chatId = getChatId(currentUser.uid, selectedUser.uid);
//     const messageData = {
//       text: message,
//       sender: currentUser.uid,
//       receiver: selectedUser.uid,
//       createdAt: serverTimestamp(),
//     };

//     await addDoc(collection(db, `chats/${chatId}/messages`), messageData);
//     setMessage('');
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/3 border-r p-4">
//         <h2 className="text-lg font-bold mb-4">Users</h2>
//         <input
//           type="text"
//           placeholder="Search user..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full border p-2 mb-4 rounded"
//         />
//         <ul>
//           {users
//             .filter((user) =>
//               user.name.toLowerCase().includes(search.toLowerCase())
//             )
//             .map((user) => (
//               <li
//                 key={user.id}
//                 onClick={() => setSelectedUser(user)}
//                 className="cursor-pointer p-2 hover:bg-gray-100 rounded"
//               >
//                 {user.name}
//               </li>
//             ))}
//         </ul>
//         <button onClick={() => signOut(auth)} className="mt-4 bg-red-500 text-white px-3 py-1 rounded">
//           Logout
//         </button>
//       </div>

//       {/* Chat Area */}
//       <div className="w-2/3 p-4 flex flex-col">
//         {selectedUser ? (
//           <>
//             <div className="mb-4">
//               <h2 className="text-lg font-bold">Chat with {selectedUser.name}</h2>
//             </div>
//             <div className="flex-1 overflow-y-auto border p-2 mb-4">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`my-2 ${msg.sender === currentUser.uid ? 'text-right' : 'text-left'}`}
//                 >
//                   <p className="bg-gray-200 inline-block px-3 py-1 rounded">{msg.text}</p>
//                 </div>
//               ))}
//             </div>
//             <form onSubmit={sendMessage} className="flex gap-2">
//               <input
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 className="flex-1 border p-2 rounded"
//                 placeholder="Type a message..."
//               />
//               <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//                 Send
//               </button>
//             </form>
//           </>
//         ) : (
//           <p>Select a user to start chatting</p>
//         )}
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { auth, db } from '../firebaseConfig'; // make sure path is correct
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   addDoc,
//   serverTimestamp,
// } from 'firebase/firestore';
// import { signOut } from 'firebase/auth';

// export default function ChatPage() {
//   const [search, setSearch] = useState('');
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const currentUser = auth.currentUser;

//   // Prevent hydration error by waiting for user
//   useEffect(() => {
//     if (!currentUser) return;
//     const q = query(collection(db, 'users'));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const usersList = snapshot.docs
//         .map((doc) => ({ ...doc.data(), id: doc.id }))
//         .filter((user) => user.email !== currentUser.email);
//       setUsers(usersList);
//     });
//     return unsubscribe;
//   }, [currentUser]);

//   const getChatId = (uid1, uid2) => {
//     return [uid1, uid2].sort().join('_');
//   };

//   useEffect(() => {
//     if (!selectedUser || !currentUser) return;
//     const chatId = getChatId(currentUser.uid, selectedUser.uid);
//     const q = query(collection(db, `chats/${chatId}/messages`));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     });

//     return unsubscribe;
//   }, [selectedUser, currentUser]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!message || !selectedUser || !currentUser) return;

//     const chatId = getChatId(currentUser.uid, selectedUser.uid);
//     const messageData = {
//       text: message,
//       sender: currentUser.uid,
//       receiver: selectedUser.uid,
//       createdAt: serverTimestamp(),
//     };

//     await addDoc(collection(db, `chats/${chatId}/messages`), messageData);
//     setMessage('');
//   };
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.push('/login'); // redirect to login
//     } catch (error) {
//       console.error("Logout error", error.message);
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/3 border-r p-4">
//         <h2 className="text-lg font-bold mb-4">Users</h2>
//         <input
//           type="text"
//           placeholder="Search user..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full border p-2 mb-4 rounded"
//         />
//         <ul>
//           {users
//             .filter((user) =>
//               user.name?.toLowerCase().includes(search.toLowerCase())
//             )
//             .map((user) => (
//               <li
//                 key={user.id}
//                 onClick={() => setSelectedUser(user)}
//                 className="cursor-pointer p-2 hover:bg-gray-100 rounded"
//               >
//                 {user.name}
//               </li>
//             ))}
//         </ul>
//         <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-3 py-1 rounded">
//   Logout
// </button>
//       </div>

//       {/* Chat Area */}
//       <div className="w-2/3 p-4 flex flex-col">
//         {selectedUser ? (
//           <>
//             <h2 className="text-lg font-bold mb-4">
//               Chat with {selectedUser.name}
//             </h2>
//             <div className="flex-1 overflow-y-auto border p-2 mb-4">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`my-2 ${msg.sender === currentUser.uid ? 'text-right' : 'text-left'}`}
//                 >
//                   <p className="bg-gray-200 inline-block px-3 py-1 rounded">
//                     {msg.text}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <form onSubmit={sendMessage} className="flex gap-2">
//               <input
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 className="flex-1 border p-2 rounded"
//                 placeholder="Type a message..."
//               />
//               <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//                 Send
//               </button>
//             </form>
//           </>
//         ) : (
//           <p>Select a user to start chatting</p>
//         )}
//       </div>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ import router
import { auth, db } from '../firebaseConfig';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function ChatPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const router = useRouter(); // ✅ initialize router

  // Track auth state properly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        router.push('/login'); // 🚪 redirect to login if not logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch users
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((user) => user.email !== currentUser.email);
      setUsers(usersList);
    });
    return unsubscribe;
  }, [currentUser]);

  const getChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join('_');
  };

  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    const chatId = getChatId(currentUser.uid, selectedUser.uid);
    const q = query(collection(db, `chats/${chatId}/messages`));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, [selectedUser, currentUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message || !selectedUser || !currentUser) return;

    const chatId = getChatId(currentUser.uid, selectedUser.uid);
    const messageData = {
      text: message,
      sender: currentUser.uid,
      receiver: selectedUser.uid,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, `chats/${chatId}/messages`), messageData);
    setMessage('');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // ✅ redirect
    } catch (error) {
      console.error("Logout error", error.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 border-r p-4">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
        />
        <ul>
          {users
            .filter((user) =>
              user.name?.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded"
              >
                {user.name}
              </li>
            ))}
        </ul>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <h2 className="text-lg font-bold mb-4">
              Chat with {selectedUser.name}
            </h2>
            <div className="flex-1 overflow-y-auto border p-2 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`my-2 ${msg.sender === currentUser.uid ? 'text-right' : 'text-left'}`}
                >
                  <p
                    className={`inline-block px-3 py-2 rounded max-w-[80%] whitespace-pre-wrap ${
                      msg.sender === currentUser.uid
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border p-2 rounded resize-none"
                placeholder="Type a message..."
                rows={2}
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Send
              </button>
            </form>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}
