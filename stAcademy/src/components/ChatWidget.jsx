import React, { useState, useEffect, useRef } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, addDoc, orderBy, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { IoMdChatbubbles, IoMdClose, IoMdSend } from "react-icons/io";
import '../css/chatWidget.css'; 

const ChatWidget = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUserNames, setOtherUserNames] = useState({}); 

  
  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatsData);
      const names = {};
      for (const chat of chatsData) {
        const otherUserId = chat.participants.find(uid => uid !== currentUser.uid);
        if (otherUserId && !names[otherUserId]) {
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            names[otherUserId] = `${userData.name} ${userData.surname}`;
          } else {
            names[otherUserId] = "Bilinmeyen Kullanıcı";
          }
        }
      }
      setOtherUserNames(prev => ({ ...prev, ...names }));
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!activeChat) return;

    const messagesRef = collection(db, 'chats', activeChat.id, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [activeChat]);

const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      await addDoc(collection(db, 'chats', activeChat.id, 'messages'), {
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      setNewMessage("");
    } catch (error) {
      console.error("Mesaj hatası:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="chat-widget-container">
       {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>{activeChat ? otherUserNames[activeChat.participants.find(uid => uid !== currentUser.uid)] || 'Sohbet' : 'Mesajlarım'}</span>
            <button onClick={() => { setIsOpen(false); setActiveChat(null); }} className="close-btn"><IoMdClose /></button>
          </div>

          <div className="chat-body">
            {!activeChat && (
              <div className="chat-list">
                {chats.length === 0 ? (
                  <p className="no-chat">Henüz bir sohbetiniz yok. Bir eğitmenle iletişime geçmek için profiline gidin.</p>
                ) : (
                  chats.map(chat => {
                    const otherId = chat.participants.find(uid => uid !== currentUser.uid);
                    return (
                      <div key={chat.id} className="chat-list-item" onClick={() => setActiveChat(chat)}>
                        <div className="avatar-circle">{otherUserNames[otherId]?.charAt(0) || '?'}</div>
                        <span>{otherUserNames[otherId] || 'Kullanıcı'}</span>
                      </div>
                    )
                  })
                )}
              </div>
            )}
            {activeChat && (
              <>
                <div className="messages-area">
                  <button className="back-btn" onClick={() => setActiveChat(null)}>&lt; Geri</button>
                  {messages.map(msg => (
                    <div key={msg.id} className={`message-bubble ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>
                <form className="message-input-area" onSubmit={handleSendMessage}>
                  <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Mesaj yaz..." 
                  />
                  <button type="submit"><IoMdSend /></button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <IoMdClose size={24} /> : <IoMdChatbubbles size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;