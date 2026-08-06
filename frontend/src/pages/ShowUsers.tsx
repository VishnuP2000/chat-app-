import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { requestFetch, usersFetch } from "@/service/Api/chatApi";
import { IRequest, IUser } from "@/types/chat";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ShowUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<IRequest[]>([]);
  console.log('request state',requests)
  const [totalPages, setTotalPages] = useState(1);
  const {user}=useAuth()
  console.log("users in showUsers", users);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await usersFetch(page,4);
      console.log("response fetchUsers", response);
      console.log("Array?", Array.isArray(response));
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      // setLoadingUsers(false);
    }
  };
  const sendRequest = async (userId:string) => {
    try {
      console.log('enter sendRequest',userId)
      const response=await requestFetch(userId)
      console.log('response++',response)
      setRequests((prev) => [...prev, response.data]);
      toast.success("Request sent");
    } catch (error) {
      console.log('error',error)
    }
  }

  

  return (
    <div>
      <Navbar />
 <div className="flex gap-4 p-4">
{users.map((data) => {
  const hasPendingRequest = requests.some(
    (req) =>
      req.receiver === data._id &&
      req.status === "pending"
  );

  return (
    <div
      key={data._id}
      className="bg-amber-500 w-[300px] h-[400px] p-4 rounded-lg"
    >
      <img src={data.image.url} alt={data.name} />

      <p>
        <strong>Name:</strong> {data.name}
      </p>

      {hasPendingRequest ? (
        <Button title="Pending"  />
      ) : (
        <Button
          title="Request"
          onClick={() => sendRequest(data._id)}
        />
      )}
    </div>
  );
})}
</div>

<div className="flex justify-center gap-4 mt-6">
  <button className="cursor-pointer"
    disabled={page === 1}
    onClick={() => setPage((prev) => prev - 1)}
  >
    Previous
  </button>

  <span>
    {page} / {totalPages}
  </span>

  <button className="cursor-pointer"
    disabled={page === totalPages}
    onClick={() => setPage((prev) => prev + 1)}
  >
    Next
  </button>
</div>
    </div>
  );
}

export default ShowUsers;
