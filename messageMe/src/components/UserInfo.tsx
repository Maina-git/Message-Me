import React from 'react'
import { CgProfile } from 'react-icons/cg';
import { auth } from '../config/Firebase';

const UserInfo:React.FC = () => {
  return (
    <div className="w-full p-5 h-auto bg-white flex justify-between items-center">
        <div className="flex items-center gap-5">
        <span className="text-3xl text-pink-900"><CgProfile/></span>
        <h1 className="text-xs text-pink-900">{auth.currentUser?.displayName}</h1>
</div>
<div>
    <button className="px-5 py-2 text-xs text-white rounded bg-pink-900">LogOut</button>
</div>
      
    </div>
  )
}

export default UserInfo;
