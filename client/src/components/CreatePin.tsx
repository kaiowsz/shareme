import React, { useState } from "react"
import { AiOutlineCloudUpload } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import { useNavigate } from "react-router-dom"

import { client } from "../utils/client"
import { Spinner } from "./"
import { categories } from "../utils/data"

interface ImageAsset {
  extension: string;
  url: string;
  _id: string;
  size: number | string;
}

const CreatePin = ({user}: any) => {
  const [title, setTitle] = useState("")
  const [about, setAbout] = useState("")
  const [destination, setDestination] = useState("")

  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState<boolean | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [imageAsset, setImageAsset] = useState<ImageAsset | null>(null)

  // verify errors states
  const [wrongImageType, setWrongImageType] = useState(false)
  const [sizeNotAllowed, setSizeNotAllowed] = useState(false)

  const navigate = useNavigate()
  console.log(destination)

  const uploadImage = (e: any) => {
    const selectedFile = e.target.files[0];
    const { type, size, name } = selectedFile

    console.log(selectedFile)

    if(size > 20971520) {
      setSizeNotAllowed(true)

      setTimeout(() => {
        setSizeNotAllowed(false)
      }, 3000);

      return
    } 

    if(type === "image/png" || type === "image/svg" || type == "image/jpeg" || type === "image/gif" || type === "image/tiff") {
      setWrongImageType(false)
      setLoading(true)

      client.assets
        .upload("image", selectedFile, {contentType: type, filename: name})
        .then((document) => {
          console.log(document)
          setImageAsset(document)
          setLoading(false)
        })
        .catch((error) => {
          console.log("Image upload error: ", error)
        })
    } else {
      setWrongImageType(true)
      setTimeout(() => setWrongImageType(false), 3000)
    }
  }

  const savePin = () => {

    
    if(title && about && destination && imageAsset?._id && category) {
      
      if(!(destination.slice(0, 4)).includes("http")) {
        setDestination(prev => `//${prev}`)
      }

      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      }

      try {
        client.create(doc)
        navigate("/")

      } catch (error) {
        console.log(error)
        
      }

    } else {
      setFields(true);

      setTimeout(() => setFields(false), 2000)
    }
  }


  return (
    <div className="flex flex-col justify-center items-center mt-5 lg: h-4/5">
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && (
              <Spinner message="" />
            )}
            {wrongImageType && <p className="text-red-500">Wrong image type</p>}
            {sizeNotAllowed && <p className="text-red-500">The size must be less than 20MB.</p>}
            {!imageAsset ? (
              <label htmlFor="upload-image" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Use high-quality JPG, PNG, SVG, GIF less than 20MB.
                  </p>
                </div>
                <input type="file" name="upload-image" id="upload-image" onChange={uploadImage} className="w-0 h-0" />
              </label>
            ) : (
              <div className="relative h-full">
                <img src={imageAsset?.url} alt="uploaded-pic" className="h-full w-full" />
                <button
                type="button"
                className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                onClick={e => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
            <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title here"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
            />
            {user && (
              <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                <img src={user.image} alt="user profile" className="w-10 h-10 rounded-full" />
                <p className="font-bold">{user.username}</p>
              </div>
            )}
            <input 
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            />
            <input 
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add your destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            />
            <div className="flex flex-col">
              <div>
                <p className="mb-2 font-semibold text-lg sm:text-xl">Choose Pin Category</p>
                <select 
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                name="" id="">
                  <option value="other" className="bg-white">Select Category</option>
                  {categories.map((category: any) => (
                    <option className="text-base border-0 outline-none capitalize bg-white text-black" value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center mt-5">
                  <button
                  type="button"
                  onClick={savePin}
                  className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                  >
                    Save Pin
                  </button>
                  {fields && (
                      <p className="text-red-500 text-xl transition-all duration-150 ease-in">Please fill in all the fields.</p>
                  )}
              </div>


            </div>
        </div>

      </div>

    </div>
  )
}

export default CreatePin