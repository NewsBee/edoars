import FormLogin from '@/components/Forms/LoginForm';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: "Login Page",
    description:
      "Halaman Login",
    // other metadata
  };


const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/cover/loginCover.jpg)' }}>
      <div className="flex flex-col items-center bg-[#5882C147] bg-opacity-20 p-10 rounded-lg shadow-lg backdrop-blur-md w-full max-w-md">
        <div className="flex justify-center mb-8 space-x-4">
          <Image src="/images/logo/logoUntan.png" alt="UNTAN Logo" width={80} height={80} />
          <Image src="/images/logo/logo-arsitek-new.png" alt="Arsitektur Logo" width={80} height={80} />
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#5DA8FF] mb-8">E-DOXARS</h1>
        <FormLogin />
      </div>
    </div>
  );
};

export default LoginPage;
