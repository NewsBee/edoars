import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

interface AccessDeniedToastProps {
  countdownStart?: number;
  redirectTo?: string;
}

export default function AccessDeniedToast({
  countdownStart = 3,
  redirectTo = '/',
}: AccessDeniedToastProps) {
  const router = useRouter();
  const [counter, setCounter] = useState(countdownStart);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (counter <= 0) {
      setVisible(false);
      router.push('/');
      return;
    }
    const timer = setTimeout(() => {
      setCounter((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [counter, router, redirectTo]);

  if (!visible) return null;

return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className="bg-white text-sky-800 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-4 transform transition-transform duration-300 animate-scale-in border-l-4 border-sky-500">
            <FaExclamationTriangle className="w-6 h-6 flex-shrink-0 text-sky-500" />
            <div>
                <p className="font-semibold text-lg">Akses Ditolak</p>
                <p className="text-sm">
                    Dialihkan dalam <span className="font-mono">{counter}</span> detik
                </p>
            </div>
        </div>
    </div>
);
}

// Tailwind CSS animations (add to globals.css or tailwind.config.js under extend.animation):
// @keyframes scale-in { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
// .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
