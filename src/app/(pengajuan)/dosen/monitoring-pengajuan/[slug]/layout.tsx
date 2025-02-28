import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoring Pengajuan",
  description: "Halaman Kelompok Keahlian",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
