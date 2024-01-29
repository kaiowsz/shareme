import React, { useState, useEffect } from "react"

import { PinType } from "../@types"
import { MasonryLayout, Spinner } from "./"
import { client } from "../utils/client"
import { feedQuery, searchQuery } from "../utils/data"

interface SearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Search = ({searchTerm, setSearchTerm}: SearchProps) => {

  const [pins, setPins] = useState<PinType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
        if(searchTerm) {
          setLoading(true);
          const query = searchQuery(searchTerm.toLowerCase())
    
          client.fetch(query)
            .then(data => {
              setPins(data)
              setLoading(false)
            })
        } else {
          client.fetch(feedQuery)
            .then(data => {
              setPins(data)
              setLoading(false)
            })
        }

      }, 300)

    return () => clearTimeout(delayDebounce);


  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message="Searching for pins..." />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl">No pins found.</div>
      )}
    </div>
  )
}

export default Search