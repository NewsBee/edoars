import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengajuan Praskripsi",
  description: "Halaman pengajuan praskripsi",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
