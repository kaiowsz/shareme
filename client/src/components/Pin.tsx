import React, { useState } from "react"
import { urlFor, client } from "../utils/client"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"
import { MdDownloadForOffline } from "react-icons/md"
import { AiTwotoneDelete } from "react-icons/ai"
import { BsFillArrowUpRightCircleFill } from "react-icons/bs"

type MyPin = {
  postedBy: {
    image: string;
    username: string;
    _id: string;
  };
  image: {
    asset: {
      url: string;
    }
  };
  _id: string;
  destination: string;
}

interface PinProps {
  pin: MyPin;
}

const Pin = ({pin}: PinProps) => {
  const [postHovered, setPostHovered] = useState(false)
  const [savingPost, setSavingPost] = useState(false)
  const navigate = useNavigate()

  const {postedBy, image, _id, destination} = pin;

  console.log(image?.asset?.url)
  
  return (
    <div className="m-2">
      <div 
      onMouseEnter={() => setPostHovered(true)}
      onMouseLeave={() => setPostHovered(false)}
      onClick={() => navigate(`/pin-detail/${_id}`)}
      className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img className="rounded-lg w-full" src={urlFor(image).width(250).url()} alt="user-post" />
        {postHovered && (
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 py-2 z-50"
          style={{height: "100%"}}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a 
                href={`${image?.asset?.url}?dl=`} 
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Pin