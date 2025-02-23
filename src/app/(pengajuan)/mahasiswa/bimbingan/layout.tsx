import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bimbingan",
  description: "Halaman Bimbingan",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
