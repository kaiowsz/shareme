import React, { useState, useEffect, ElementType } from "react"
import { AiOutlineLogout } from "react-icons/ai"
import { useParams, useNavigate } from "react-router-dom"
import { googleLogout } from "@react-oauth/google"

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/data"
import { client } from "../utils/client"
import { MasonryLayout, Spinner } from "./"
import { FcGoogle } from "react-icons/fc"
import { MdLogout } from "react-icons/md"
import { User, PinType } from "./PinDetail"

const activeBtnStyles = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none"
const notActiveBtnStyles = "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none"




const UserProfile = () => {
  const [user, setUser] = useState<User>()
  const [pins, setPins] = useState<PinType[]>([])
  const [text, setText] = useState("Created")
  const [activeBtn, setActiveBtn] = useState("created")
  const navigate = useNavigate()
  const { userId } = useParams()

  useEffect(() => {
    const query = userQuery(`${userId}`);

    client.fetch(query)
      .then((data) => {
        setUser(data[0])
      })
  }, [userId])

  useEffect(() => {
    if(text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId)

      client.fetch(createdPinsQuery)
        .then((data) => setPins(data))
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId)

      client.fetch(savedPinsQuery)
        .then((data) => setPins(data))
    }
  }, [text, userId])

  if(!user) return <Spinner message="Loading profile..."/>

  const handleLogout = async () => {
    try {
      googleLogout()
      localStorage.clear()
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img className="w-full h-[370px] 2xl:h-510 shadow-lg object-cover" src="https://source.unsplash.com/1600x900/?nature,photography,technology" alt="random user-banner" />
            <img className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover" src={user.image} alt="user-pic" />
            <h1 className="font-bold text-3xl text-center mt-3">{user.username}</h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <button 
                onClick={handleLogout}
                type="button" 
                className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md">
                  <MdLogout color="red" fontSize={25} />
                </button>
              )}
            </div>
          </div>

          <div className="text-center mb-7">
            <button
            type="button"
            onClick={(e: any) => {
              setText(e.target.textContent)
              setActiveBtn("created")
            }}
            className={`${activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
            <button
            type="button"
            onClick={(e: any) => {
              setText(e.target.textContent)
              setActiveBtn("saved")
            }}
            className={`${activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>

          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No Pins found!
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default UserProfile