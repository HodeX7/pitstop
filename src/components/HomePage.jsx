import { useEffect, useRef, useState } from "react";
import "../styles/Home.css";
import { API_MEDIA, axiosAuthRequest } from "../services/api.service";

const mockMedia = [
  {
    createdAt: "2024-01-29",
    id: 19,
    media_file: {
      name: "reels 1",
      url: "https://www.youtube.com/shorts/MxmPttZeja8",
    },
    media_type: "reel",
    sport: "cricket",
    title: "Top goals - Commandos FC seniors",
    tournament_details: 34,
    views: 0,
  },
  {
    createdAt: "2024-01-29",
    id: 12,
    media_file: {
      name: "reels 2",
      url: "https://www.youtube.com/shorts/MxmPttZeja8",
    },
    media_type: "reel",
    sport: "cricket",
    title: "Top goals - Commandos FC seniors",
    tournament_details: 34,
    views: 0,
  },
];
const HomePage = () => {
  const videos = useRef({});

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
        setMedia(media.data);
        // setMedia(mockMedia);
        setFilterMedia(media.data);
        // setFilterMedia(mockMedia);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    fetchData();
  }, []);

  const handlePlay = (idx) => {
    Object.keys(videos.current).map((v_key) => {
      let v = videos.current[v_key];

      if (parseInt(v_key) !== idx && !v.paused) {
        v.pause();
      }
    });
  };

  const handlePause = (idx) => {
    console.log("rukaya bhai ", videos.current[idx]);
  };

  const getReels = () => {
    const reels = filterMedia.filter((media) => media.media_type === "reel");
    return reels.slice(0, 2).map((reel) => (
      <div key={reel.id} className="w-1/2 mr-2">
        <video controls className="w-full h-60">
          <source src={API_MEDIA + reel.media_file.url} />
        </video>
      </div>
    ));
  };

  const renderMedia = () => {
    const result = [];
    const reels = getReels();

    for (let i = 0; i < filterMedia.length; i++) {
      if (filterMedia[i].media_type !== "reel") {
        result.push(
          <div key={`video-${i}`} className="my-5">
            <div>
              <video controls className="w-full">
                <source src={API_MEDIA + filterMedia[i].media_file.url} />
              </video>
            </div>
          </div>
        );
      }
      if (i % 2 === 1 && reels.length > 0) {
        result.push(
          <div key={`reel-${i}`} className="flex">
            {reels.shift()}
            {reels.shift()}
          </div>
        );
      }
    }

    return result;
  };

  return (
    <>
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
            selected === "badminton"
              ? "bg-orange-500 text-white border-2 border-orange-500"
              : "bg-white text-orange-500 border-2 border-orange-500"
          } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
          onClick={() => handleDivClick("badminton")}
        >
          Badminton
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
          <>{renderMedia()}</>
        )}
      </div>
    </>
  );
};

export default HomePage;
