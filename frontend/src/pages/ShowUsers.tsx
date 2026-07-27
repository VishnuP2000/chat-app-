import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { usersFetch } from "@/service/Api/chatApi";
import { IUser } from "@/types/chat";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ShowUsers() {
    const [users,setUsers]=useState<IUser[]>([])
    console.log('users in showUsers',users)

  useEffect(()=>{
    fetchUsers()
  },[])

    const fetchUsers = async () => {
      try {
        const response = await usersFetch();
        console.log("response fetchUsers", response);
        setUsers(response);
      } catch (error) {
        toast.error("Failed to load users");
        console.error(error);
      } finally {
        // setLoadingUsers(false);
      }
    };
  

  return (
    <div>
       <Navbar/>
    <div className="flex gap-4 p-4">
      {users.map((data, index) => (
        <div
          key={index}
          className="bg-amber-500 w-[300px] h-[400px] p-4 rounded-lg"
        >
          <img 
          src={data.image.url}
           alt=""
            />
          <p><strong>Name:</strong> {data.name}</p>
          <Button
          title="Request"
          className=""
          />
        </div>
      ))}
    </div>
    </div>
  );
}

export default ShowUsers;