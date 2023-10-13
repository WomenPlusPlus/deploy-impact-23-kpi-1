import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Circles } from "../model/circle";
import { User, UserDetails } from "../model/user";

interface UserUpdateError {
  message: String;
}

interface OutletContext {
  user: User;
  circles: Circles[];
  userDetails: UserDetails;
  setUserDetails: (u: UserDetails) => void;
}

export default function UserDetailsPage(): JSX.Element {
  const { circles, user, userDetails, setUserDetails }: OutletContext = useOutletContext();

  const [defaultCircleId, setDefaultCircleId] = useState(userDetails?.defaultCircleId);

  const [username, setUsername] = useState(userDetails?.username);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    let newDetails: UserDetails = { ...userDetails }
    if (userDetails.username !== username) {
      newDetails.username = username
    }

    if (userDetails.defaultCircleId !== defaultCircleId) {
      newDetails.defaultCircleId = defaultCircleId
    }

    setUserDetails(newDetails);
  }

  return (
    <>
      {" "}
      <div className="flex flex-col items-center justify-center mt-10 gap-10">
        <h1 className="text-2xl font-bold text-center text-gray-800 md:text-3xl">
          Edit user details
        </h1>
        <form
          className="w-1/3"
          onSubmit={(e: React.SyntheticEvent) => handleSubmit(e)}
        >
          <div className="flex flex-col text-sm mb-5">
            <label className="font-bold mb-2 text-gray-800" htmlFor="username">
              Username
            </label>
            <input
              className="bg-[#FFF] shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-gray-500 rounded-lg"
              name="username"
              type="text"
              placeholder="Username"
              value={username ? username : undefined}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-sm mb-7">
            <label className="font-bold mb-2 text-gray-800" htmlFor="defaultCircle">
              Default circle
            </label>

            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:border-gray-500 block w-full p-2"
              name="defaultCircle"
              defaultValue={defaultCircleId ? defaultCircleId : undefined}
              onChange={(e) => setDefaultCircleId(e.target.value)}
            >
              <option value={undefined}></option>
              {circles.map(c => <option value={c.circle_name}>{c.circle_name}</option>)}
            </select>
          </div>
          <button className="w-full shadow-sm rounded-lg bg-yellow-500 hover:bg-yellow-600 py-2 px-4">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
