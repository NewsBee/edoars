import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengajuan",
  description: "Halaman Pengajuan",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
