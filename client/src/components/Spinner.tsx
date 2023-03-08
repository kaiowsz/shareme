import React from 'react'
import { ColorRing } from "react-loader-spinner"

interface Spinner {
  message: string;
}

// color="#00BFFF"

const Spinner = ({message}: Spinner) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <ColorRing height={50} width={200} wrapperClass="m-5" />

      <p className="text-lg text-center px-2">{message}</p>
    </div>
  )
}

export default Spinner