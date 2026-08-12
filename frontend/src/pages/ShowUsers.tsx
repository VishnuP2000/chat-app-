import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { getAcceptRequest, getReceivedRequests, getSentRequests, requestFetch, usersFetch } from "@/service/Api/chatApi";
import { IRequest, IUser } from "@/types/chat";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ShowUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<IRequest[]>([]);
  console.log('requests',requests)
  const [receivedRequests, setReceivedRequests] = useState<IRequest[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const {user}=useAuth()
  console.log("users:", users);
console.log("requests:", requests);

  useEffect(() => {
    fetchUsers();
    fetchSentRequests();
    fetchReceivedRequests();
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
      console.log('response++',response.data)
      setRequests((prev)=> [...prev, response.data])
      toast.success("Request sent");
    } catch (error) {
      console.log('error',error)
    }
  }
const fetchSentRequests = async () => {
  try {
    const response = await getSentRequests();
    console.log('response---',response.data)
    setRequests(response.data ?? []);
  } catch (error) {
    console.error("error",error);
  }
};
const fetchReceivedRequests = async () => {
  try {
    const response = await getReceivedRequests();
    console.log('response******',response.data)
    setReceivedRequests(response.data ?? []);
  } catch (error) {
    console.error("Error fetching received requests:", error);
  }
};
const fetchAcceptRequest = async (requestId:string) => {
  try {
    const response = await getAcceptRequest(requestId);
    console.log('response acceptRequest',response.data)
     toast.success("Request accepted");
    // setReceivedRequests(response.data ?? []);
        setReceivedRequests((prev) =>
      prev.filter((request) => request._id !== requestId)
    );
  } catch (error) {
    console.error("Error fetching received requests:", error);
  }
};

  

  return (
    <div>
      <Navbar />
 <div className="flex gap-4 p-4">
{users.map((data) => {
  const hasPendingRequest = requests.some(
    (req) =>
     ( req.receiver === data._id &&
      req.status === "pending")
    );
    console.log('data._Id',data._id,data.name)
      const receivedRequest = receivedRequests.find(
    (request) =>
      request.sender === data._id &&
      request.status === "pending"
  );
  const accepted=requests.some((req)=>(req.status=="accepted"))

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
        <Button
          title="Pending"
          // disabled
        />
      ) : receivedRequest ? (
        <Button
          title="Accept"
          onClick={() => fetchAcceptRequest(receivedRequest._id)}
        />
      ) :accepted?<Button
      title="chat"
      /> :(
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
