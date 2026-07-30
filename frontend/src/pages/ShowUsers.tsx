import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { usersFetch } from "@/service/Api/chatApi";
import { IUser } from "@/types/chat";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ShowUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  return (
    <div>
      <Navbar />
 <div className="flex gap-4 p-4">
  {users.map((data) => (
    <div
      key={data._id}
      className="bg-amber-500 w-[300px] h-[400px] p-4 rounded-lg"
    >
      <img src={data.image.url} alt={data.name} />
      <p>
        <strong>Name:</strong> {data.name}
      </p>

      <Button title="Request" className="" />
    </div>
  ))}
</div>

<div className="flex justify-center gap-4 mt-6">
  <button
    disabled={page === 1}
    onClick={() => setPage((prev) => prev - 1)}
  >
    Previous
  </button>

  <span>
    {page} / {totalPages}
  </span>

  <button
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
