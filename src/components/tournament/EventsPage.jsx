import { useEffect, useState } from "react";

import { TournamentAPI, useAxios } from "../../services/api.service";
import { formatDate, CONSTANTS } from "../../services/misc.services";

import Badminton from "../../assets/sportImages/badminton.png";
import Cricket from "../../assets/sportImages/cricket.png";
import Football from "../../assets/sportImages/football.png";
import TableTennis from "../../assets/sportImages/tableTennis.png";
import Snooker from "../../assets/sportImages/snooker.png";
import Swimming from "../../assets/sportImages/swimming.png";
import Skating from "../../assets/sportImages/skating.png";
import Basketball from "../../assets/sportImages/basketball.png";
import Hockey from "../../assets/sportImages/basketball.png";

import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

import "../../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Shimmer from "../Shimmer";

const Events = ({ tournaments, loaded, isHistory }) => {
  const navigate = useNavigate();

  const pastStatus = {
    Participating: "Participated",
    Pending: "Request was pending",
    Rejected: "Rejected",
    Hosted: "Hosted",
  };

  return (
    <>
      {loaded & (tournaments?.length > 0)
        ? tournaments?.map((event) => {
          return (
            <div
              key={event.id}
              className={` p-3 mb-2 rounded-lg ${CONSTANTS.getSportsColor(
                event.sport
              )} cursor-pointer`}
              onClick={() => navigate(`/tournament/wrapper/${event.id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <h1 className="font-semibold capitalize ">{event.title}</h1>
                <h1 className="text-gray-500 text-sm capitalize">
                  {event.categories} {event.categories === 1 ? "Category" : "Categories"}
                </h1>
              </div>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-orange-500 font-semibold capitalize">
                  {event.sport}
                </h1>
                <div className="flex text-gray-500 ">
                  <CalendarTodayOutlinedIcon className="mr-2" />
                  <h1>
                    {formatDate(event.fromDate)} - {formatDate(event.toDate)}
                  </h1>
                </div>
                {/* <div className="flex text-gray-500 ">
                  <h1>{event.categories} {event.categories === 1 ? "Category" : "Categories"}</h1>
                </div> */}
              </div>
              {/* <div className="flex justify-between items-center">
                <div className="flex text-gray-500 ">
                  <CalendarTodayOutlinedIcon className="mr-2" />
                  <h1>
                    {formatDate(event.fromDate)} - {formatDate(event.toDate)}
                  </h1>
                </div>
              </div> */}
            </div>
          );
        })
        : "No Tournaments Available."}
    </>
  );
};

const EventsPage = () => {
  const [explore, setExplore] = useState(true);

  const [myTournaments, mtLoaded] = useAxios({
    url: "tournament/wrapper/my_tournaments/",
    method: "get",
  });

  const [hotTournaments, htLoaded] = useAxios({
    url: "tournament/wrapper/live/",
    method: "get",
  });

  const [upcomingTournaments, utLoaded] = useAxios({
    url: "tournament/wrapper/upcoming/",
    method: "get",
  });

  const [tournamentHistory, thLoaded] = useAxios({
    url: "tournament/wrapper/history/",
    method: "get",
  });

  const sports = [
    "Badminton",
    "Football",
    "Cricket",
    "Table tennis",
    "Hockey",
    "Swimming",
    "Basketball",
    "Skating",
    "Snooker",
  ];

  const sportImages = [
    Badminton,
    Football,
    Cricket,
    TableTennis,
    Hockey,
    Swimming,
    Basketball,
    Skating,
    Snooker,
  ];

  if (!mtLoaded || !htLoaded || !utLoaded || !thLoaded) {
    return <Shimmer />;
  }

  return (
    <>
      <div className="flex p-3 pb-0 justify-around">
        <h1
          className={`cursor-pointer w-1/2 pb-1 flex justify-center ${explore
            ? " border-b-2 border-orange-500 text-orange-500"
            : "border-b-2 border-gray-200 text-gray-500"
            }`}
          onClick={() => setExplore(true)}
        >
          My Events ({myTournaments?.length})
        </h1>
        <h1
          className={`cursor-pointer w-1/2 pb-1 flex justify-center ${!explore
            ? " border-b-2 border-orange-500 text-orange-500"
            : "border-b-2 border-gray-200 text-gray-500"
            }`}
          onClick={() => setExplore(false)}
        >
          Explore
        </h1>
      </div>
      {explore ? (
        <div className="mt-3">
          <div style={{  overflowY: "auto" }}>
            <Events tournaments={myTournaments} loaded={mtLoaded} />
          </div>

          <div className="flex justify-between mt-7 font-semibold items-center mb-2">
            <h1>View History</h1>
            <ChevronRightOutlinedIcon />
          </div>

          <div style={{ maxHeight: "30vh", overflowY: "auto" }}>
            <Events
              tournaments={tournamentHistory}
              loaded={thLoaded}
              isHistory={true}
            />
          </div>
        </div>
      ) : (
        <div className="overflow-y-scroll maxh hide-scrollbar">
          <div className="flex justify-between mt-7 mb-2 font-semibold items-center">
            <h1>Hot Tournaments</h1>
            <ChevronRightOutlinedIcon />
          </div>
          <Events tournaments={hotTournaments} loaded={htLoaded} />

          <div className="flex justify-between mt-7 mb-2 font-semibold items-center">
            <h1>Upcoming in Your Neighbourhood</h1>
            <ChevronRightOutlinedIcon />
          </div>
          <Events tournaments={upcomingTournaments} loaded={utLoaded} />

          <div className="flex justify-between mt-7 font-semibold items-center">
            <h1>Search By Sport</h1>
            <ChevronRightOutlinedIcon />
          </div>
          <div className="font-semibold flex hide-scrollbar overflow-x-auto whitespace-nowrap">
            {sports.map((sport, idx) => {
              return (
                <div
                  key={sport}
                  className={`p-14 cursor-pointer flex flex-col items-center pt-4 m-2 rounded-2xl ${CONSTANTS.getSportsColor(
                    sport
                  )}`}
                >
                  <span className="text-center">{sport}</span>
                  <img
                    src={sportImages[idx]}
                    className="h-16 w-16 mt-8"
                    alt="sportImage"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;
