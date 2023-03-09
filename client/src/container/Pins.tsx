import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Feed, PinDetail, CreatePin, Search } from "../components";
import { User } from '../@types';

interface PinsProps {
  user: User;
}

const Pins = ({user}: PinsProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <main className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route path="/pin-detail/:pinId" element={<PinDetail user={user} />} />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        </Routes> 
      </div>

    </main>
  )
}

export default Pins