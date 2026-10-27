'use client';
import { useState, useRef, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import DailyIframe from '@daily-co/daily-js';

// Cấu hình Firebase của Nhóm 4
const firebaseConfig = {
  apiKey: "AIzaSyC9FWdDqMNsv6iHovwwzHZ6V0APnLXkCPg",
  authDomain: "bai-tap-video-call-nhom4.firebaseapp.com",
  projectId: "bai-tap-video-call-nhom4",
  storageBucket: "bai-tap-video-call-nhom4.firebasestorage.app",
  messagingSenderId: "507177977729",
  appId: "1:507177977729:web:d9ddb49841cff7b48c8a80",
  measurementId: "G-S1JJM1LG5N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Home() {
  const [user, setUser] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const callWrapperRef = useRef(null);
  const callFrameRef = useRef(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      alert("Đăng nhập thất bại: " + error.message);
    }
  };

  const joinRoom = () => {
    setIsInCall(true);
  };

  useEffect(() => {
    if (isInCall && callWrapperRef.current && !callFrameRef.current) {
      callFrameRef.current = DailyIframe.createFrame(callWrapperRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '12px'
        },
        // Truyền tên tài khoản Google vào phòng họp
        userName: user?.displayName || 'Thành viên Nhóm 4', 
      });
      
      // Link phòng Daily của Nhóm 4
      callFrameRef.current.join({ url: 'https://nhom4.daily.co/baitapnhom4' });
    }
    
    return () => {
      if (callFrameRef.current && !isInCall) {
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
    };
  }, [isInCall, user]);

  return (
    <main className="min-h-screen p-8 bg-gray-100 flex flex-col items-center justify-center">
      {!isInCall ? (
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-8 text-blue-700">Bài Tập: Gọi Video Qua API</h1>
          
          <div className="bg-blue-50 p-6 rounded-xl mb-8 text-left border border-blue-200">
            <h2 className="font-bold text-xl mb-3 text-blue-900">Tên nhóm: Nhóm 4</h2>
            <ul className="list-decimal list-inside text-gray-700 font-medium space-y-2">
              {/* Thông tin nhóm - Bạn hãy bổ sung tên các bạn khác nhé */}
              <li>Nguyễn Đức Vũ - DH52201773 (Lớp D22_TH15)</li>
              <li>Lê Thị Diệu Huyền - DH52201773</li>
             
            </ul>
          </div>

          {!user ? (
            <div className="flex flex-col items-center">
              <p className="mb-6 text-gray-600">Vui lòng đăng nhập bằng Google để hiển thị tên khi gọi video.</p>
              <button 
                onClick={handleLogin} 
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all"
              >
                Đăng nhập bằng Google
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="mb-6 text-lg">
                Đăng nhập thành công! Xin chào, <span className="font-bold text-green-600">{user.displayName}</span>
              </p>
              <button 
                onClick={joinRoom} 
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-10 rounded-lg shadow-md transition-all"
              >
                Vào Phòng Gọi Video
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[85vh] flex flex-col items-center bg-gray-900 p-4 rounded-2xl shadow-2xl relative">
          <button 
            onClick={() => setIsInCall(false)}
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg z-10 font-medium shadow-lg"
          >
            Rời phòng
          </button>
          <div className="w-full h-full" ref={callWrapperRef}></div>
        </div>
      )}
    </main>
  );
}