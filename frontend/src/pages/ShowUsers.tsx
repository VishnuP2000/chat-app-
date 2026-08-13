import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { getAcceptRequest, getReceivedRequests, getSentRequests, requestFetch, usersFetch } from "@/service/Api/chatApi";
import { IRequest, IUser } from "@/types/chat";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ShowUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<IRequest[]>([]);
  console.log('requests',requests)
  const [receivedRequests, setReceivedRequests] = useState<IRequest[]>([]);
  console.log('receivedRequests',receivedRequests)
  const [totalPages, setTotalPages] = useState(1);
  const {user}=useAuth()
  const navigate=useNavigate()
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
      console.log('sendRequest++',response.data)
      setRequests((prev)=> [...prev, response.data])
      toast.success("Request sent");
    } catch (error) {
      console.log('error',error)
          toast.error(
      "Failed to send request"
    );
    }
  }
const fetchSentRequests = async () => {
  try {
    const response = await getSentRequests();
     console.log("SENT REQUESTS:", response.data);
    setRequests(response.data ?? []);
    // setRequests((prev)=>[...prev,response.data])
  } catch (error) {
    console.error("error",error);
        toast.error(
      "Failed to send request"
    );
  }
};
const fetchReceivedRequests = async () => {
  try {
    const response = await getReceivedRequests();
      console.log("RECEIVED REQUESTS:", response.data);
    setReceivedRequests(response.data ?? []);
    // setReceivedRequests((prev)=>[...prev,response.data]);
  } catch (error) {
    console.error("Error fetching received requests:", error);
  }
};
const fetchAcceptRequest = async (requestId: string) => {
  try {
    const response = await getAcceptRequest(requestId);

    console.log("Accepted response:", response.data);

    // await Promise.all([
    //   fetchSentRequests(),
    //   fetchReceivedRequests(),
    // ]);
        setReceivedRequests((prev) =>
      prev.map((request) =>
        request._id === requestId
          ? {
              ...request,
              status: "accepted",
            }
          : request
      )
    );

    toast.success("Request accepted");

  } catch (error) {
    console.error("Error accepting request:", error);
  }
};

  

  return (
    <div>
      <Navbar />
 <div className="flex gap-4 p-4">
{users.map((data) => {
  const allRequests = [...requests, ...receivedRequests];
  console.log('allRequest',allRequests)

  const request = allRequests.find(
    (req) =>
      (req.sender === user?.id &&
        req.receiver === data._id) ||
      (req.receiver === user?.id &&
        req.sender === data._id)
  );

  console.log("Logged user:", user?.id);
  console.log("User card:", data._id);
  console.log("Request found:", request);

  return (
    <div
      key={data._id}
      className="bg-amber-500 w-[300px] h-[400px] p-4 rounded-lg"
    >
      <img src={data.image.url} alt={data.name} />
       <p><strong>job:</strong>software developer</p>
      <p>
        <strong>Name:</strong> {data.name}
      </p>

      {!request ? (
        <Button
          title="Request"
          onClick={() => sendRequest(data._id)}
        />

      ) : request.status === "pending" ? (

        request.sender === user?.id ? (
          <Button title="Pending" />
        ) : (
          <Button
            title="Accept"
            onClick={() => fetchAcceptRequest(request._id)}
          />
        )

      ) : request.status === "accepted" ? (

        <Button
        className="bg-emerald-600 hover:bg-emerald-700"
          title="Chat"
          onClick={()=>navigate('/Dashboard')}
        />

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
