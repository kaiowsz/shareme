import React, { useState, useEffect } from 'react'
import { MdDownloadForOffline } from "react-icons/md"
import { Link, useParams } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

import { client, urlFor } from '../utils/client'
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data'
import { MasonryLayout, Spinner } from "./"

import { User, PinDetail, Comment, PinType, PostedBy } from '../@types'

interface PropsPinDetail {
  user: User;
}

const PinDetail = ({user}: PropsPinDetail) => {
  const [pins, setPins] = useState<PinType[] | null>(null)
  const [pinDetail, setPinDetail] = useState<PinDetail | null>(null)
  const [comment, setComment] = useState("")
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams()

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)

    if(!query) return

    client.fetch(query)
      .then((data) => {
        setPinDetail(data[0])

        if(data[0]) {
          query = pinDetailMorePinQuery(data[0])

          client.fetch(query)
            .then(res => setPins(res))
        }
      })
  }

  const addComment = () => {
    if(comment.trim() === "" || !comment) return

    setAddingComment(true)
    client.patch(`${pinId}`)
      .setIfMissing({comments: []})
      .insert("after", "comments[-1]", [
        {comment,
         _key: uuidv4(),
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        }
      }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("")
          setAddingComment(false)
        })
  }

  useEffect(() => {
    fetchPinDetails()
  }, [pinId])

  if(!pinDetail) {
    return <Spinner message="Loading pin..." />
  }

  return (
    <>
    <section className="rounded-[32px] flex xl-flex-row flex-col m-auto bg-white max-w-[1500px]">
      <div className="flex justify-center items-center md:items-start flex-initial">
        <img src={pinDetail?.image && urlFor(pinDetail.image).url()} alt="user-post" className="rounded-t-3xl rounded-b-lg" />
      </div>
      <div className="w-full p-5 flex-1 xl:min-w-620">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <a 
              href={`${pinDetail.image?.asset?.url}?dl=`} 
              download
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
          </div>
          <a className="underline hover:text-gray-600 transition-all duration-200" href={`${pinDetail.destination}`} target="_blank">{pinDetail.destination}</a>
        </div>

        <div>
          <h1 className="text-4xl font-bold break-words mt-3">{pinDetail.title}</h1>
          <p className="mt-3">{pinDetail.about}</p>
        </div>

        <Link className="flex gap-2 mt-5 items-center bg-white rounded-lg" to={`/user-profile/${pinDetail.postedBy?._id}`}>
        <img className="w-8 h-8 rounded-full object-cover" src={pinDetail.postedBy?.image} alt="user-profile" />
        <p className="font-semibold capitalize">{pinDetail.postedBy?.username}</p>
        </Link>
        
        <h2 className="mt-5 text-2xl">Comments</h2>
        <div className="max-h-370 overflow-y-auto">
          {pinDetail.comments && pinDetail.comments.map((comment, i) => (
            <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
              <img src={comment.postedBy.image} alt="user-profile comment" className="h-10 w-10 rounded-full cursor-pointer" />
              <div className="flex flex-col">
                <p className="font-bold">{comment.postedBy.username}</p>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap mt-6 gap-3">
          <Link className="" to={`/user-profile/${pinDetail.postedBy?._id}`}>
          <img className="w-10 h-10 rounded-full cursor-pointer" src={user.image} alt="user-profile" />
          </Link>
          <input 
          className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
          type="text" 
          placeholder="Add a comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          />
          <button 
          type="button" 
          onClick={addComment}
          className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none">
            {addingComment ? "Posting the comment..." : "Post"}
          </button>
        </div>
      </div>
    </section>
    {pins && pins.length > 0 ? (
      <>
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">More like this</h2>
        <MasonryLayout pins={pins}  />
      </>
    ) : (
      <h1 className="mt-10 text-center">Similar pins not found.</h1>
    )}
    </>
  )
}

export default PinDetail