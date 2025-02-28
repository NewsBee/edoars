import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tidak Diizinkan",
  description: "Anda tidak diizinkan mengakses halaman ini",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
