import React, { useState } from "react"
import { urlFor, client } from "../utils/client"
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"
import { MdDownloadForOffline } from "react-icons/md"
import { AiTwotoneDelete } from "react-icons/ai"
import { BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { fetchUser } from "../utils/fetchUser";

import { PinType } from "../@types";

interface PinProps {
  pin: PinType;
  className: string;
}

const Pin = ({pin}: PinProps) => {
  const [postHovered, setPostHovered] = useState(false)
  const navigate = useNavigate()
  const {postedBy, image, _id, destination, save} = pin;

  const user = fetchUser()

  const alreadySaved = (save?.filter((item: any) => item.postedBy._id === user._id))?.length

  const savePin = (e: any, id: string) => {
    e.preventDefault();
    
    if(!alreadySaved) {

      client
        .patch(id)
        .setIfMissing({save: []})
        .insert("after", "save[-1]", [{
          _key: uuidv4(),
          userId: user._id,
          postedBy: {
            _type: "postedBy",
            _ref: user._id,
          }
        }])
        .commit()
        .then(() => {
          window.location.reload();
        })
    }
  }

  const deletePin = (id: string) => {
    client
      .delete(id)
      .then(() => window.location.reload())
  }

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

              {alreadySaved ? (
                <button 
                type="button"
                onClick={e => {
                  e.stopPropagation() 
                  e.preventDefault()
                }}
                className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                > {save?.length} Saved</button>
              ): (
                <button
                onClick={e => {
                  e.stopPropagation()
                  savePin(e, _id);
                }}
                type="button"
                className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >Save</button>
              )}  
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
                {destination && (
                  <a 
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md"
                  >
                    <BsFillArrowUpRightCircleFill />
                    {destination.length > 15 ? `${destination.slice(0, 15)}...` : destination}
                  </a>
                )}

                {postedBy?._id === user._id && (
                  <button type="button"
                  className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={e => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  >
                    <AiTwotoneDelete/>
                  </button>
                )}
            </div>

          </div>
        )}
      </div>
      <Link className="flex gap-2 mt-2 items-center" to={`user-profile/${postedBy?._id}`}>
        <img className="w-8 h-8 rounded-full object-cover" src={postedBy?.image} alt="user-profile" />
        <p className="font-semibold capitalize">{postedBy?.username}</p>
      </Link>
    </div>
  )
}

export default Pin