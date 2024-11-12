"use client"

import React, { useState } from 'react';

function DiskusiBox() {
    const users = [
        { id: 1, name: 'Valentinus Pebriano, ST, MT', role: 'Pembimbing I', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: 2, name: 'Valentinus Pebriano, ST, MT', role: 'Penguji II', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: 3, name: 'Valentinus Pebriano, ST, MT', role: 'Penguji I', avatar: 'https://i.pravatar.cc/150?img=3' },
        { id: 4, name: 'Valentinus Pebriano, ST, MT', role: 'Pembimbing II', avatar: 'https://i.pravatar.cc/150?img=4' },
    ];

    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [messages, setMessages] = useState([
        { text: "Duis aute irure dolor in reprehenderit in voluptate velit e", type: 'incoming' },
        { text: "Duis aute irure dolor in reprehenderit in voluptate velit e", type: 'outgoing' },
        { text: "Duis aute irure dolor in reprehenderit in voluptate velit e", type: 'incoming' },
    ]);

    const [newMessage, setNewMessage] = useState('');

    const sendMessage = (e:any) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, { text: newMessage, type: 'outgoing' }]);
            setNewMessage('');
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Left side: User List */}
            <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Diskusi</h2>
                <ul>
                    {users.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center p-2 mb-2 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
                                selectedUser.id === user.id ? 'bg-blue-200 dark:bg-blue-800' : ''
                            }`}
                        >
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="rounded-full mr-3"
                                width={40}
                                height={40}
                            />
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{user.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right side: Chat Window */}
            <div className="w-3/4 bg-white dark:bg-gray-900 p-6 flex flex-col shadow-lg">
                {/* User Info */}
                <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-700">
                    <div className="flex items-center">
                        <img
                            src={selectedUser.avatar}
                            alt={selectedUser.name}
                            className="rounded-full mr-3"
                            width={40}
                            height={40}
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{selectedUser.name}</h2>
                            <p className="text-sm text-green-600">Online</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">29 Agustus 2024, 18:00</div>
                </div>

                {/* Message Box */}
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-64 overflow-y-auto flex-1 mb-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-3 flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`${message.type === 'outgoing' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 dark:text-gray-200'} p-3 rounded-md max-w-xs`}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <form className="flex" onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        placeholder="Type a message"
                    />
                    <button
                        type="submit"
                        className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition duration-300"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DiskusiBox;
