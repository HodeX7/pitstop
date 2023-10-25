import { useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsRunOutlinedIcon from "@mui/icons-material/DirectionsRunOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EventsPage from "./EventsPage";
import Profile from "./Profile";
import Search from "./Search";
import "../styles/Home.css";
import HomePage from "./HomePage";
import { useNavigate } from "react-router-dom";
import { NavigationHeaderComponent } from "../services/header.service";
import { Add, Create } from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selected1, setSelected1] = useState(10);
  const [currentPage, setCurrentPage] = useState("home");
  const handleDivClick1 = (index) => {
    setSelected1(index);

    // if (index == 14) {
    //   navigate('/profile')
    // }
  };
  return (
    <div className="h-screen relative">
      {currentPage === "home" ? (
        <div className="p-6 flex justify-start flex-col">
          <Search />
          <HomePage />
        </div>
      ) : currentPage === "events" ? (
        <>
          <NavigationHeaderComponent title={"PITSTOP LOGO"} />
          <div className="p-6 flex justify-start flex-col">
            <EventsPage />
          </div>
        </>
      ) : currentPage === "profile" ? (
        <Profile />
      ) : null}
      <footer className="flex justify-between z-10 px-6 pb-6 absolute bottom-0 w-full">
        <div
          className={`${
            selected1 === 10 ? "text-orange-500" : "text-gray-500"
          } flex flex-col items-center cursor-pointer text-xs`}
          onClick={() => {
            setCurrentPage("home");
            handleDivClick1(10);
          }}
        >
          <HomeOutlinedIcon />
          <h1>Home</h1>
        </div>
        <div
          className={`${
            selected1 === 11 ? "text-orange-500" : "text-gray-500"
          } flex flex-col items-center cursor-pointer text-xs`}
          onClick={() => {
            setCurrentPage("events");
            handleDivClick1(11);
          }}
        >
          <DirectionsRunOutlinedIcon />
          <h1>Events</h1>
        </div>
        <div
          className={`${
            selected1 === 12 ? "text-orange-500" : "text-gray-500"
          } flex flex-col items-center cursor-pointer text-xs`}
          onClick={() => navigate("tournament/add/")}
        >
          <Add />
          <h1>Tournament</h1>
        </div>
        <div
          className={`${
            selected1 === 13 ? "text-orange-500" : "text-gray-500"
          } flex flex-col items-center cursor-pointer text-xs`}
          onClick={() => handleDivClick1(13)}
        >
          <NotificationsNoneOutlinedIcon />
          <h1>Alerts</h1>
        </div>
        <div
          className={`${
            selected1 === 14 ? "text-orange-500" : "text-gray-500"
          } flex flex-col items-center cursor-pointer text-xs`}
          onClick={() => {
            setCurrentPage("profile");
            handleDivClick1(14);
          }}
        >
          <PersonOutlineOutlinedIcon />
          <h1>Profile</h1>
        </div>
      </footer>
    </div>
  );
};

export default Home;
