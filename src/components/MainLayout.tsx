import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import { useEffect, useState } from "react";
import { MainFeed } from "../cloudstate/feed";
import { UserManager, type UserData } from "../cloudstate/auth";
import Post from "./Post";

export default function MainLayout(props: {
  user: UserData;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-row h-screen absolute overflow-hidden w-full">
        <div className="  border-r border-gray-200 h-full p-2 overflow-hidden flex flex-col justify-between w-24 items-center">
          <img className="w-14 h-14 rounded-full" src="/bird.webp" />
          <button
          className="border rounded-lg p-1 w-full text-sm  whitespace-nowrap text-center min-w-16 hover:bg-gray-100 transition-colors"
            onClick={async () => {
              await useCloud<typeof UserManager>(UserManager.id).signOut();
              window.location.href = "/";
            }}
          >
            Sign Out
          </button>

          {/* Sidebar */}
        </div>
        <div className="w-full overflow-scroll">{props.children}</div>
      </div>
    </>
  );
}
