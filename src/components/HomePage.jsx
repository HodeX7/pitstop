import React, { useEffect, useState } from "react";
import data from "../assets/dummyTourneyData.json";
import TournamentCard from "./TournamentCard";
import "../styles/Home.css";
import EditIcon from "@mui/icons-material/Edit";
import { API_MEDIA, axiosAuthRequest } from "../services/api.service";

const HomePage = () => {
  const [selected, setSelected] = useState(null);
  const [filterMedia, setFilterMedia] = useState([]);
  const [media, setMedia] = useState([]);
  const handleDivClick = (sport) => {
    setSelected(sport);
    if (sport === "all") {
      setFilterMedia(media);
    } else {
      const filtered = media.filter((media) => media.sport === sport);
      setFilterMedia(filtered);
    }
    console.log(filterMedia);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const media = await axiosAuthRequest(
          "tourney_details/get_home_media",
          {
            method: "GET",
          },
          false
        );
        // console.log(media);
        setMedia(media.data);
        setFilterMedia(media.data);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {console.log(filterMedia)}
      <div className="overflow-x-auto whitespace-nowrap flex hide-scrollbar ">
        <div
          className={`mr-2 ${
            selected === "all"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 px-6 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("all")}
        >
          All
        </div>
        <div
          className={`mr-2 ${
            selected === "football"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("football")}
        >
          Football
        </div>
        <div
          className={`mr-2 ${
            selected === "cricket"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("cricket")}
        >
          Cricket
        </div>
        <div
          className={`mr-2 ${
            selected === "volleyball"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("volleyball")}
        >
          Volleyball
        </div>
        <div
          className={`mr-2 ${
            selected === "basketball"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("basketball")}
        >
          Basketball
        </div>
        <div
          className={`mr-2 ${
            selected === "skating"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("skating")}
        >
          Skating
        </div>
        <div
          className={`mr-2 ${
            selected === "snooker"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("snooker")}
        >
          Snooker
        </div>
        <div
          className={`mr-2 ${
            selected === "table_tennis"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("table_tennis")}
        >
          Table Tennis
        </div>
        <div
          className={`mr-2 ${
            selected === "swimming"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("swimming")}
        >
          Swimming
        </div>
      </div>
      <div className="mt-2 overflow-y-scroll maxh hide-scrollbar">
        {filterMedia?.length === null || filterMedia?.length === 0 ? (
          <h1>Nothing to show currently</h1>
        ) : (
          <>
            {filterMedia?.map((media, item) => (
              <div key={item} className="mb-5">
                {media.media_type === "image" ? (
                  <img
                    className=""
                    src={API_MEDIA + media.media_file.url}
                    alt={media.media_file.title}
                  />
                ) : (
                  <video controls>
                    <source src={API_MEDIA + media.media_file.url} />
                  </video>
                )}{" "}
                <div className="flex mt-2 justify-between">
                  <h1 className="font-semibold">{media.title}</h1>
                  <h1>{media.createdAt}</h1>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
