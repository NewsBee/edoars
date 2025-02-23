import { useEffect, useState } from 'react';

const BimbinganChat = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(""); // Untuk menyimpan siapa yang sedang di-chat
  const [discussionPoints, setDiscussionPoints] = useState<any[]>([]); // Daftar topik diskusi
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null); // Topik yang dipilih
  const [message, setMessage] = useState(""); // Pesan yang diketik
  const [messages, setMessages] = useState<string[]>([]); // Menyimpan daftar pesan
  const [newTopic, setNewTopic] = useState(""); // Input untuk menambah topik baru
  const [lecturers, setLecturers] = useState<any[]>([]); // Menyimpan data dosen

  useEffect(() => {
    // Mengambil data pembimbing dan penguji
    const fetchLecturers = async () => {
      const response = await fetch('/api/submission/verificator');
      const data = await response.json();
      setLecturers(data);
    };

    fetchLecturers();
  }, []);

  // Fungsi untuk membuka modal dan mengambil daftar topik
  const openChatModal = (chatWith: string) => {
    setCurrentChat(chatWith);
    // Ambil data topik diskusi untuk chatWith (misalnya pembimbing atau penguji)
    setDiscussionPoints([
      { id: 1, description: "Topik 1", status: "Pending" },
      { id: 2, description: "Topik 2", status: "Selesai" },
    ]);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeChatModal = () => {
    setIsModalOpen(false);
    setMessages([]); // Reset pesan saat modal ditutup
  };

  // Fungsi untuk memilih topik
  const selectTopic = (topic: any) => {
    setSelectedTopic(topic);
  };

  // Fungsi untuk mengirim pesan
  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]); // Menambahkan pesan ke daftar
      setMessage(""); // Reset input pesan
    }
  };

  // Fungsi untuk menambah topik
  const addTopic = () => {
    if (newTopic.trim()) {
      setDiscussionPoints([
        ...discussionPoints,
        { id: discussionPoints.length + 1, description: newTopic, status: "Pending" },
      ]);
      setNewTopic(""); // Reset input topik baru
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      {/* Pembimbing Section */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-blue-700">Pembimbing</h2>
        <div className="mt-4 space-y-4">
          {lecturers.map((lecturer: any) => (
            <div
              key={lecturer.User.id}
              className="flex items-center justify-between border-b-2 border-gray-300 p-4 cursor-pointer hover:bg-blue-100 rounded-md"
              onClick={() => openChatModal(lecturer.User.name)}
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div>
                  <h3 className="text-lg font-medium">{lecturer.User.name}</h3>
                  <p className="text-sm text-gray-500">{lecturer.type}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">Senin, 09:00</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Chat */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] lg:w-[60%] h-[80%] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-blue-700">
                Chat dengan {currentChat}
              </h3>
              <button
                onClick={closeChatModal}
                className="text-lg font-bold text-red-500"
              >
                X
              </button>
            </div>

            {/* Tabel dan tombol tambah topik */}
            {!selectedTopic ? (
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 border-b text-sm font-semibold text-blue-700">Deskripsi</th>
                      <th className="px-6 py-3 border-b text-sm font-semibold text-blue-700">Status</th>
                      <th className="px-6 py-3 border-b text-sm font-semibold text-blue-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discussionPoints.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-gray-500">
                          Belum ada topik.
                        </td>
                      </tr>
                    ) : (
                      discussionPoints.map((topic) => (
                        <tr key={topic.id} className="hover:bg-gray-100">
                          <td className="px-6 py-3 border-b">{topic.description}</td>
                          <td className="px-6 py-3 border-b">{topic.status}</td>
                          <td className="px-6 py-3 border-b">
                            {topic.status === "Pending" ? (
                              <button
                                onClick={() => selectTopic(topic)}
                                className="text-blue-500 hover:underline"
                              >
                                Mulai Chatting
                              </button>
                            ) : (
                              <button
                                onClick={() => selectTopic(topic)}
                                className="text-green-500 hover:underline"
                              >
                                Lihat Chat
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Tombol tambah topik */}
                <div className="mt-4 flex space-x-4">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Tambah topik baru"
                  />
                  <button
                    onClick={addTopic}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Tambah Topik
                  </button>
                </div>
              </div>
            ) : (
              // Pop-up Chatting
              <div className="mt-4">
                <div className="space-y-4 h-60 overflow-y-auto p-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-xs ${index % 2 === 0 ? "bg-blue-100 ml-auto" : "bg-gray-200 mr-auto"} shadow-md`}
                    >
                      <p>{msg}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-l-md w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-500 text-white rounded-r-md ml-2 hover:bg-blue-600 shadow-md"
                  >
                    Kirim
                  </button>
                </div>

                {/* Tombol Kembali ke List Topik */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setSelectedTopic(null)} // Kembali ke list topik
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Kembali ke List Topik
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BimbinganChat;
