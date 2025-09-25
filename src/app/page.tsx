"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DashboardMainContent from "@/components/Dashboard/Welcome";

export default function Home() {
  const { data: session } = useSession();
  console.log("Session Data:", session);
  console.log(session?.user.role);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role) {
      router.push(`/${session.user.role.toLowerCase()}/dashboard`);
    }
  }, [session, router]);

  return (
    <div className="px-3">
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent mb-2"></div>
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    </div>
  );
}
