import { format } from "timeago.js";
import type { UserData } from "../cloudstate/auth";
import type { FeedItem, PostData } from "../cloudstate/feed";
import MainLayout from "./MainLayout";
import Post from "./Post";
import { useEffect, useMemo, useState } from "react";
import { useCloud } from "freestyle-sh";
import { useCloudQuery } from "freestyle-sh/react";

export default function PostPage(props: { post: PostData; user: UserData }) {
  const [text, setText] = useState("");
  const post = useCloud<typeof FeedItem>(props.post.id);

  const { data: comments } = useCloudQuery(post.getComments);

  useEffect(() => {
    console.log("comments", comments);
  }, [comments]);
  return (
    <MainLayout user={props.user}>
      <div className="overflow-scroll">
        <div className="flex flex-row p-4 backdrop-blur-lg items-center">
          <a
            className="rounded-full hover:bg-gray-200 p-2 transition-all"
            href={"/"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </a>
          <p className="font-bold ml-4">Post</p>
        </div>
        <div className="border-b px-4">
          <a className=" flex flex-row" href={"/users/" + props.user.username}>
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="flex flex-col ml-4">
              <a
                className="font-bold hover:underline"
                href={"/users/" + props.user.username}
              >
                {props.post.postedBy.name}
              </a>
              <span className="text-gray-500">
                @{props.post.postedBy.username} ·{" "}
                {useMemo(
                  () => format(new Date(props.post.epochs)),
                  [props.post.epochs]
                )}
              </span>
            </div>
          </a>
          <div className="py-4 text-lg">{props.post.text}</div>
        </div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("submit");
            await post.postComment(text);
            setText("");
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Comment"
            className="
                border-b h-24 w-full p-4 text-xl focus:outline-none
                "
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 w-full mt-4 hover:bg-blue-600 transition-all"
          >
            Comment
          </button>
        </form>

        {comments &&
          comments.map((comment) => {
            return <Post postData={comment} />;
          })}
      </div>
    </MainLayout>
  );
}
