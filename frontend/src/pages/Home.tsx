import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Navbar from "@/components/layout/Navbar";

function Home() {
  const navigate = useNavigate();

  

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex justify-center items-center">
        <div className="w-[1000px] h-[700px] bg-green-400 rounded-xl flex justify-center items-center">
          <Button
            title="Get Started"
            onClick={() => navigate("/showUsers")}
          />
        </div>
      </div>
    </div>
  );

}

export default Home;