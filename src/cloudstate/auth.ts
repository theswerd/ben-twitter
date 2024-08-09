import { cloudstate, useRequest } from "freestyle-sh";

function getSessionId(cookie: string) {
  const cookies = parseCookie(cookie?? "");

  const sessionId = cookies.get("freestyle-session-id");
  if (!sessionId) {
    throw new Error("No session ID");
  }
  return sessionId;
}

function parseCookie(str: string) {
  return str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc.set(
        decodeURIComponent(v[0].trim()),
        decodeURIComponent(v[1]?.trim() ?? "")
      );
      return acc;
    }, new Map<string, string>());
}

@cloudstate
export class User {
  id = crypto.randomUUID();
  name: string;
  email: string;
  password: string;
  username: string;

  constructor(username: string, name: string, email: string, password: string) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  info(): UserData {
    return {
      id: this.id,
      name: this.name,
      username: this.username,
      email: this.email,
    };
  }
}

export interface UserData {
  id: string;
  name: string
  username: string;
  email: string;
}

@cloudstate
export class UserManager {
  static readonly id = "user-manager";

  users = new Map<string, User>();
  emailIndex = new Map<string, string>();
  usernameIndex = new Map<string, string>();
  sessions = new Map<string, string>();

  createUser(username: string, name: string, email: string, password: string) {
    if (this.emailIndex.has(email)) {
      return {
        errorCode: "EMAIL_IN_USE" as const,
        error: "Email already in use",
      };
    }
    if (this.usernameIndex.has(username)) {
      return {
        errorCode: "USERNAME_IN_USE" as const,
        error: "Username already in use",
      };
    }

    const user = new User(username, name, email, password);
    this.users.set(user.id, user);
    this.emailIndex.set(email, user.id);
    this.usernameIndex.set(username, user.id);
    return { ...user.info(), errorCode: null };
  }
  getUserFromSession(cookie: string|null) {
    if (!cookie) {
      return null;
    }
    const sessionId = getSessionId(cookie);

    
    return this.users.get(this.sessions.get(getSessionId(cookie))!)?.info();
  }
 
  getUser(id: string) {
    return this.users.get(id)?.info();
  }

  signOut(cookie?: string) {
    this.sessions.delete(getSessionId(cookie?? useRequest().headers.get("cookie")?? ""));
  }

  validateUserSignIn(email: string, password: string, cookie?: string) {
    const sessionId = getSessionId(cookie?? useRequest().headers.get("cookie")?? "");
    const userId = this.emailIndex.get(email);
    if (!userId) {
      return {
        errorCode: "USER_NOT_FOUND" as const,
        error: "User not found",
      };
    }

    const user = this.users.get(userId);
    if (user?.password !== password) {
      return {
        errorCode: "INVALID_PASSWORD" as const,
        error: "Invalid password",
      };
    }

    this.sessions.set(sessionId, userId);

    return {
      sessionId,
      user: user.info(),
    };
  }
}
