import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengumuman",
  description: "Halaman Pengumuman",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
