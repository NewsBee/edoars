import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipe Pengajuan",
  description: "Halaman tipe pengajuan",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
