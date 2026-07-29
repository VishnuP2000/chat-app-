import { useAuth } from "@/context/AuthContext";
import { usersFetch } from "@/service/Api/chatApi";
import { IUser } from "@/types/chat";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ShowUsers() {
    // const [users,setUsers]=useState<IUser[]>([])
console.log('enter the showUser')
const {user}=useAuth()



  return (
    <div className=" gap-4 p-4 flex-1 flex justify-center items-center">
      
        <div
          className="bg-amber-500 w-[300px] h-[400px] p-4 rounded-lg  "
        >

          <div className="rounded-full">
           <img 
           className="rounded-4xl"
           src={user?.image} 
           alt="" />
          </div>
          <p><strong>job:</strong>software developer</p>
          <p><strong>Name:</strong> {user?.name}</p>
          
        </div>
    
    </div>
  );
}

export default ShowUsers;