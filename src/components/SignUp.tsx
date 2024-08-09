import { useCloud } from "freestyle-sh";
import { UserManager } from "../cloudstate/auth";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userManager = useCloud<typeof UserManager>(UserManager.id);
  const [userName, setUserName] = useState("Ben");
  const [name, setName] = useState("Ben");
  return (
    <>
      <div className=" flex items-center justify-center  h-screen">
        <div className="border rounded-lg p-8 text-center">
          <p className=" font-bold mb-8">Sign Up For Ben Twitter</p>
          <input
            type="text"
            className="border p-4 w-full mb-4 "
            placeholder="Name"
            pattern="[a-z0-9]+"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            className="border p-4 w-full mb-4 "
            placeholder="@username"
            pattern="[a-z0-9]+"
            value={userName}
            onChange={(e) => {
              
              setUserName(e.target.value.toLowerCase());
            }}
          />
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
            className="bg-gray-100 text-black p-2 w-full mt-4 hover:bg-gray-200 transition-all"
            onClick={async () => {
              console.log("Sign up");

              const user = await userManager.createUser(userName, name,email, password);
              console.log("new user", user);
              if (user.errorCode) {
                alert(user.error);
              } else {
                await userManager
                  .validateUserSignIn(email, password)
                  .then((user) => {
                    window.location.href = "/";
                  });
              }
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
