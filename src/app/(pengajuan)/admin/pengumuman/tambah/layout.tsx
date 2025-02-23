import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Pengumuman",
  description: "Halaman Tambah Pengumuman",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
