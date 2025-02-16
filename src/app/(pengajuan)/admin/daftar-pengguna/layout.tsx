import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Pengguna",
  description: "Halaman Daftar Pengguna",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
