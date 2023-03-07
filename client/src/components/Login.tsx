import React from 'react'
import { GoogleLogin, googleLogout } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"

import shareWallpaper from "../assets/share.mp4"
import logo from "../assets/logowhite.png" 
import { createOrGetUser } from '../utils/getGoogleUser'
import { client } from '../utils/client'

const Login = () => {
  const navigate = useNavigate()

  const handleGoogleResponse = async (response: any) => {
    const user = await createOrGetUser(response)

    localStorage.setItem("user", JSON.stringify(user))
    
    const {_id, image, username} = user

    const doc = {
      _id,
      _type: "user",
      username,
      image,
    }

    try {
      await client.createIfNotExists(doc)
        .then(() => navigate("/", {replace: true}))
        
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="flex justify-start items-center flex-col h-screen" style={{display: "flex", justifyContent: "start", alignItems: "center", flexDirection: "column", height: "100vh"}}>
      <main className="relative w-full h-full" style={{position: "relative", width: "100%", height: "100%"}}>
        <video 
        src={shareWallpaper}
        autoPlay 
        controls={false}
        muted
        loop 
        className="w-full h-full object-cover"
        style={{width: "100%", height: "100%", objectFit: "cover"}}
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>

          <div className="shadow-2xl">
            <GoogleLogin
            onSuccess={handleGoogleResponse}
            onError={() => console.log("We had an error. Please try again.")}
            state_cookie_domain="single_host_origin"
            />
          </div>

        </div>
      </main>
    </section>
  )
}

export default Login
