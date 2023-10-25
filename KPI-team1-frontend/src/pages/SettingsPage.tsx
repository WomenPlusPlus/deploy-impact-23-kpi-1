import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Circles } from "../model/circle";
import { User, UserDetails } from "../model/user";
import { supabase } from "../supabase";
import { HiMiniArrowUpTray, HiOutlineInformationCircle } from "react-icons/hi2";

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
  const { circles, user, userDetails, setUserDetails }: OutletContext =
    useOutletContext();

  const [defaultCircleId, setDefaultCircleId] = useState(
    userDetails?.defaultCircleId
  );

  const [username, setUsername] = useState(userDetails?.username);
  const navigate = useNavigate();

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    let newDetails: UserDetails = { ...userDetails };
    if (userDetails.username !== username) {
      newDetails.username = username;
    }

    if (userDetails.defaultCircleId !== defaultCircleId) {
      newDetails.defaultCircleId = defaultCircleId;
    }

    await supabase.rpc("update_username_and_default_circle", {
      p_user_id: user.id,
      p_username: newDetails.username,
      p_default_circle_id: newDetails.defaultCircleId || null,
    });

    setUserDetails(newDetails);
    navigate(
      newDetails?.defaultCircleId
        ? "/kpi/circles/" + newDetails.defaultCircleId
        : "/"
    );
  }

  function resetAndNavigateBack() {
    setUsername(userDetails.username);
    setDefaultCircleId(userDetails.defaultCircleId);

    navigate(-1);
  }

  return (
    <form onSubmit={(e: React.SyntheticEvent) => handleSubmit(e)}>
      <div className="bg-grey-800 p-4 mb-4 border-b border-gray-300">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Settings</h1>
          <div>
            <button
              onClick={() => resetAndNavigateBack()}
              className="w-28 h-10 mr-4 bg-white rounded border border-customYellow justify-center items-center gap-2 inline-flex text-zinc-700 text-base font-medium"
            >
              Cancel
            </button>
            <button className="w-28 h-10 bg-customYellow rounded justify-center items-center gap-2 inline-flex text-base font-medium">
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-1/2 bg-white shadow-sm">
          <div className="p-2 bg-customPurple rounded-t">
            <h2 className="text-[#131313] font-bold m-1">
              Username and circles
            </h2>
          </div>
          <div className="p-4 rounded-b">
            <div className="flex flex-col text-sm mb-5">
              <label
                className="font-bold mb-2 text-gray-800"
                htmlFor="username"
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={username ? username : ""}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#FFF] shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-gray-500 rounded-lg"
              />
            </div>
            <div className="flex flex-col text-sm mb-5">
              <label
                className="font-bold mb-2 text-gray-800"
                htmlFor="defaultCircle"
              >
                Default circle
              </label>
              {circles.length > 0 ? (
                <select
                  name="defaultCircle"
                  defaultValue={defaultCircleId ? defaultCircleId : ""}
                  onChange={(e) => {
                    setDefaultCircleId(e.target.value);
                  }}
                  className="bg-[#FFF] border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:border-gray-500 block w-full p-2"
                >
                  <option value=""></option>
                  {circles.map((c) => (
                    <option
                      value={c.circle_user[0].circle_id}
                      key={`${c.circle_user[0].circle_id}-key`}
                    >
                      {c.circle_name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-start p-4 rounded border-l-4 border-l-yellow-500 text-gray-900 text-sm shadow-md mt-4">
                  <div className="flex items-center justify-center bg-yellow-500 rounded-full p-2 mr-4">
                    <HiOutlineInformationCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xl text-gray-900 mb-2">
                      There are no circles to choose from.
                    </div>
                    <div className="text-gray-700 text-base">
                      Please contact your gatekeeper.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-white ml-4 shadow-sm">
          <div className="p-2 bg-customPurple rounded-t">
            <h2 className="text-[#131313] font-bold m-1">My photo</h2>
          </div>
          <div className="p-4 rounded-b">
            <div className="flex items-center justify-center flex-col mb-2 text-center">
              <HiMiniArrowUpTray className="h-32 w-32 mb-2" color="#7C7E7E" />
              <span className="text-gray-700">
                Change your photo - coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
