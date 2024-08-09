import { useCloud } from "freestyle-sh";
import { useState } from "react";
import { UserManager } from "../cloudstate/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userManager = useCloud<typeof UserManager>(UserManager.id);
  return (
    <>
      <div className=" items-center justify-center h-screen w-full space-y-4 flex flex-col">
        <div className="p-8 border rounded-lg text-center">
          <p className="text-lg pb-4">Sign Into Ben Twitter</p>
          <input
            type="text"
            placeholder="Email"
            className="border p-4 w-full mb-4 "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-4 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 w-full mt-4 hover:bg-blue-600 transition-all"
            onClick={() => {
              console.log("Sign in");
            }}
          >
            Sign In
          </button>
          <div className="mt-4"/>
          <a href="/signup" className="text-gray-600 mt-8 transition-all">
            Don't have an account? <span className="text-blue-700 font-bold underline">Sign up</span>
          </a>
        </div>
      </div>
    </>
  );
}
