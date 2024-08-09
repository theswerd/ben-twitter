import {
  cloudstate,
  invalidate,
  useCloud,
  useLocal,
  useRequest,
} from "freestyle-sh";
import { UserManager, type User, type UserData } from "./auth";

@cloudstate
export class MainFeed {
  static id = "main-feed" as const;

  items = new Map<string, FeedItem>();

  addItem(text: string, userId: string) {
    const item = new FeedItem(text, userId);
    this.items.set(item.id, item);
    invalidate(useCloud<typeof MainFeed>("main-feed").getItems);

    return item.info();
  }

  getItems() {
    return Array.from(this.items.values())
      .map((item) => item.info())
      .toSorted((a, b) => b.epochs - a.epochs);
  }
}

export interface PostData {
  id: string;
  text: string;
  postedBy: UserData;
  epochs: number;
  likes: number;
  hasLiked?: boolean;
}

@cloudstate
export class FeedItem {
  id = crypto.randomUUID();
  epochs = Date.now();
  userId: string;
  likes: string[] = [];
  comments: string[] = [];

  constructor(public text: string, userId: string) {
    this.text = text;
    this.userId = userId;
    this.likes = [];
  }

  like() {
    console.log("LIKE TRIGGERED");

    // console.log("LIKED")
    const userManager = useLocal<typeof UserManager>(UserManager.id);
    const user = userManager.getUserFromSession(
      useRequest().headers.get("cookie") ?? ""
    );
    console.log("THE USER IS", user);
    const userId = user!.id;

    if (!this.likes.includes(userId)) {
      this.likes.push(userId);
    }
  
    return this.info();
  }

  dislike() {

    console.log("DISLIKE TRIGGERED");
    const userManager = useLocal<typeof UserManager>(UserManager.id);
    const user = userManager.getUserFromSession(
      useRequest().headers.get("cookie") ?? ""
    );
    console.log("THE USER IS", user);
    const userId = user!.id;

    if (this.likes.includes(userId)) {
      this.likes = this.likes.filter((id) => id !== userId);
    }
  
    return this.info();

    // const userManager = useLocal<typeof UserManager>(UserManager.id);
    // const user = await userManager.getUserFromSession(useRequest().headers.get("cookie") ?? "");
    // if (user) {
    //     this.likes.delete(user.id);
    // }
    // return this.info();
  }

  getComments() {
    return this.comments.map((commentId) => useLocal<typeof FeedItem>(commentId).info());
  }

  postComment(text: string) {
    const userManager = useLocal<typeof UserManager>(UserManager.id);
    const user = userManager.getUserFromSession(useRequest().headers.get("cookie") ?? "");
    const userId = user!.id;
    if (!userId) {
      throw new Error("User not found");
    }
    const feedManager = useLocal<typeof MainFeed>(MainFeed.id);
    const commentInfo = feedManager.addItem(text, userId);

    this.comments.push(commentInfo.id);

    
    
    invalidate(useCloud<typeof FeedItem>(this.id).getComments);
    return commentInfo;
  }

  infoWithComments() {
    const userManager = useLocal<typeof UserManager>(UserManager.id);
   
    const requester = userManager.getUserFromSession(useRequest().headers.get("cookie") ?? "");
    const poster = userManager.getUser(this.userId);

    return {
      id: this.id,
      text: this.text,
      epochs: this.epochs,
      likes: Object.keys(this.likes).length,
      hasLiked: requester ? this.likes.includes(requester.id) : false,
      postedBy: poster!,
      comments: this.comments.map((commentId) => useLocal<typeof FeedItem>(commentId).info()),
    };
  }

  info(): PostData {
    const userManager = useLocal<typeof UserManager>(UserManager.id);
    const requester = userManager.getUserFromSession(useRequest().headers.get("cookie") ?? "");
    const poster = userManager.getUser(this.userId);

    console.log("POSTER", poster);
    return {
      id: this.id,
      text: this.text,
      epochs: this.epochs,
      likes: Object.keys(this.likes).length,
      hasLiked: requester ? this.likes.includes(requester.id) : false,
      postedBy: poster!,
    };
  }
}
