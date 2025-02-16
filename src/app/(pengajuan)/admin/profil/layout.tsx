import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil",
  description: "Halaman Profil",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
