import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";
import { useEffect, useState } from "react";
import { MainFeed } from "../cloudstate/feed";
import { UserManager, type UserData } from "../cloudstate/auth";
import Post from "./Post";
import MainLayout from "./MainLayout";

export default function Main(props: { user: UserData }) {
  const [text, setText] = useState("");

  const feed = useCloud<typeof MainFeed>(MainFeed.id);

  const { data: items, loading } = useCloudQuery(feed.getItems);
  useEffect(() => {
    console.log("items", items);
    console.log("loading", loading);
  }, [items, loading]);
  return (
    <>
      <MainLayout user={props.user}>
        <div className="w-full">
          <div className=" border-gray-200 flex flex-row ">
            <a className="h-full p-4 w-full text-center text-gray-500 font-semibold">
              For You
            </a>
            <a className=" w-full p-4 text-center text-gray-500 font-semibold">
              Following
            </a>
          </div>
          <form
            className="relative"
            onSubmit={async (e) => {
              e.preventDefault();
              await feed.addItem(text, props.user.id);
              setText("");
            }}
          >
            <input
              id="mainInput"
              className="rounded-none border-x-0 border-gray-200 border w-full h-24  focus:!outline-none focus:border-blue-500 p-4 text-xl"
              type="text"
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {text ? (
              <button
                type="submit"
                className="absolute bottom-4 right-4 rounded-3xl bg-blue-500 w-fit text-white px-4 py-2 "
              >
                Post
              </button>
            ) : (
              <button
                type="submit"
                className="absolute bottom-4 right-4 rounded-3xl bg-blue-300 w-fit text-white px-4 py-2 "
              >
                Post
              </button>
            )}
          </form>
          <div className="h-full overflow-y-auto">
            {(items ?? []).map((item) => (
              <Post postData={item} key={item.id} />
            ))}
          </div>

          {/* Main content */}
        </div>
      </MainLayout>
    </>
  );
}
