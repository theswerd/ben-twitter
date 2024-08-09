import { useMemo, useState } from "react";
import type { FeedItem, PostData } from "../cloudstate/feed";
import * as timeago from "timeago.js";
import { useCloud } from "freestyle-sh";
export default function Post(props: { postData: PostData }) {
  const timePosted = useMemo(
    () => timeago.format(new Date(props.postData.epochs)),
    [props.postData.epochs]
  );

  const [likeStatus, setLikeStatus] = useState(props.postData.hasLiked);
  const [likes, setLikes] = useState(props.postData.likes);
  console.log("PROPS POST DATA", props.postData);
  const feedItem = useCloud<typeof FeedItem>(props.postData.id);
  return (
    <a
    href={"/posts/"+props.postData.id}
      key={props.postData.id}
      className="p-2 border-b border-gray-200 flex flex-row hover:bg-gray-100 transition-all w-full text-left"
    >
      <div className="rounded-full h-12 aspect-square bg-gray-200 mr-2 mb-2"></div>
      <div>
        <p>
          <b>{props.postData.postedBy.name}</b>{" "}
          <span className="text-gray-500">
            @{props.postData.postedBy.username} · {timePosted}
          </span>
        </p>
        <p>{props.postData.text}</p>
        <div className="flex flex-row items-center">
          <button
            onClick={async (e) => {
                e.preventDefault();
              console.log("like");

              if (likeStatus) {
                setLikeStatus(false);
                setLikes(likes - 1);
                await feedItem.dislike();

              } else {
                setLikeStatus(true);
                await feedItem.like();
                setLikes(likes + 1);
              }
              //   }
            }}
          >
            {likeStatus ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 fill-red-600 transition-all hover:fill-red-400"
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 stroke-gray-400 hover:stroke-red-600 transition-all"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            )}
          </button>
          {
            likeStatus?
            <span className="text-red-600">
                {likes}
            </span>:
            <span className="text-gray-400">
                {likes}
            </span>
          }
         
        </div>
      </div>
    </a>
  );
}
