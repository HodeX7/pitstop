import { useEffect, useState } from "react";
import data from "../../assets/dummyFormData.json";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { useNavigate, useParams } from "react-router-dom";
import {
  API_MEDIA,
  SITE_URL,
  TournamentAPI,
  useAxios,
} from "../../services/api.service";
import {
  CONSTANTS,
  formatDate,
  formatDateTime,
  formatTime,
} from "../../services/misc.services";
import FixturesComponent from "../FixturesComponent";
import EventCompletion from "./EventCompletion";
import { NavigationHeaderComponent } from "../../services/header.service";
import TournamentCard from "../TournamentCard";
import Shimmer from "../Shimmer";

const ParticipantTab = ({
  pendingTeams,
  participatingTeams,
  rejectedTeams,
  tournamentID,
}) => {
  return (
    <div className="p-6">
      {pendingTeams?.length > 0 ? (
        <div className="mb-8">
          <h1 className="font-semibold mb-3">
            {pendingTeams?.length} Pending Requests
          </h1>
          <Teams
            teams={pendingTeams}
            status="Pending"
            tournamentID={tournamentID}
          />
        </div>
      ) : null}

      <div className="mb-8">
        <h1 className="font-semibold mb-3">
          {participatingTeams?.length} Participants
        </h1>
        <Teams
          teams={participatingTeams}
          status="Participating"
          tournamentID={tournamentID}
        />
      </div>

      {rejectedTeams?.length > 0 ? (
        <div className="mb-8">
          <h1 className="font-semibold mb-3">
            {rejectedTeams?.length} Rejected Requests
          </h1>
          <Teams
            teams={rejectedTeams}
            status="Rejected"
            tournamentID={tournamentID}
          />
        </div>
      ) : null}
    </div>
  );
};

const Teams = ({ teams, status, tournamentID }) => {
  const navigate = useNavigate();

  return (
    <>
      {teams && teams.length != 0
        ? teams.map((team) => {
            return (
              <div
                key={team.id}
                className="bg-gray-100 p-4 rounded-lg mb-5 flex justify-between"
              >
                <div>
                  <h1 className="font-semibold text-lg">{team.name}</h1>
                  <h1 className="text-gray-400 font-extralight">{status}</h1>
                </div>
                <div className="items-center flex">
                  <div className="mr-3">
                    <h1 className=" text-md flex justify-end items-center">
                      {team.participantsDetails.length} Players
                    </h1>
                    <h1 className="text-gray-400 font-extralight">
                      {formatDateTime(team.submissionDate)}
                    </h1>
                  </div>
                  <ChevronRightOutlinedIcon
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/tournament/${tournamentID}/team/${team.id}`)
                    }
                  />
                </div>
              </div>
            );
          })
        : "Any teams falling under this category will be shown here."}
    </>
  );
};

const DisplayForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tournament, isReady] = useAxios({
    url: `tournament/${parseInt(id)}/`,
    method: "get",
  });

  const filledStars = Math.floor(data.host.rating);
  const remainingStar = 5 - filledStars;
  const [isDetail, setIsDetail] = useState("details");
  const [ageGroup, setAgeGroup] = useState(null);

  useEffect(() => {
    if (isReady) {
      setAgeGroup(tournament.additionalDetails[0]);
    }
  }, [isReady]);

  if (!isReady) {
    return <Shimmer />;
  }

  return (
    <>
      <NavigationHeaderComponent
        title={tournament?.tournament_wrapper?.title}
        shareLink={SITE_URL + `tournament/${tournament?.id}`}
      />
      {isReady ? (
        <div>
          {!tournament?.tournament_wrapper?.allowTournament ? (
            <div className="bg-gray-200 p-2 w-full flex justify-center">
              Request Pending
            </div>
          ) : (
            <>
              <div className="flex p-3 pb-0 justify-around">
                <h1
                  className={`cursor-pointer w-1/3 pb-1 flex justify-center ${
                    isDetail == "details"
                      ? " border-b-2 border-orange-500"
                      : "border-b-2 border-gray-200"
                  }`}
                  onClick={() => setIsDetail("details")}
                >
                  Details
                </h1>
                {tournament.user_status != "None" || tournament.user_is_host ? (
                  <>
                    <h1
                      className={`cursor-pointer w-1/3 pb-1 flex justify-center ${
                        isDetail == "participants"
                          ? " border-b-2 border-orange-500"
                          : "border-b-2 border-gray-200"
                      }`}
                      onClick={() =>
                        tournament.user_is_host
                          ? setIsDetail("participants")
                          : navigate(
                              `/tournament/${id}/team/${tournament.team_id}`
                            )
                      }
                    >
                      Participants
                    </h1>
                  </>
                ) : null}
                {(tournament.user_is_host ||
                  tournament.user_status == "Participating") &&
                (tournament.isLive || tournament.isOver) ? (
                  <h1
                    className={`cursor-pointer w-1/3 pb-1 flex justify-center ${
                      isDetail == "fixtures"
                        ? " border-b-2 border-orange-500"
                        : "border-b-2 border-gray-200"
                    }`}
                    onClick={() => setIsDetail("fixtures")}
                  >
                    Fixtures
                  </h1>
                ) : null}
                {tournament.isOver ? (
                  <h1
                    className={`cursor-pointer w-1/3 pb-1 flex justify-center ${
                      isDetail == "tourney_media"
                        ? " border-b-2 border-orange-500"
                        : "border-b-2 border-gray-200"
                    }`}
                    onClick={() => setIsDetail("tourney_media")}
                  >
                    Media
                  </h1>
                ) : null}
              </div>
            </>
          )}
          {tournament?.user_status == "Pending" ? (
            <div className="bg-gray-200 rounded-lg p-2 w-full flex justify-center">
              Request Pending
            </div>
          ) : tournament?.isOver ? (
            <div className="bg-gray-200 rounded-lg p-2 w-full flex justify-center">
              Tournament is Over
            </div>
          ) : null}
          {isDetail == "details" ? (
            <>
              <img src={tournament?.tournament_wrapper?.banner} className="w-full" alt="" />
              <div className="p-6">
                <h1 className="font-semibold text-xl mb-6">
                  {tournament?.tournament_wrapper?.title}
                </h1>

                <h1 className="font-semibold ">Sport</h1>
                <h1 className="font-semibold mb-5 text-orange-500 capitalize">
                  {tournament?.tournament_wrapper?.sport}
                </h1>

                <h1 className="font-semibold ">Tournament Schedule</h1>
                <h1 className="font-light mb-5">
                  {formatDate(tournament?.tournament_wrapper?.fromDate)} -{" "}
                  {formatDate(tournament?.tournament_wrapper?.toDate)},{" "}
                  {formatTime(tournament?.tournament_wrapper?.fromDate)} onwards
                </h1>

                <h1 className="font-semibold ">Participation Type</h1>
                <h1 className="font-light mb-5">
                  {CONSTANTS.PARTICIPATION[tournament?.participationType]}
                </h1>

                <h1 className="font-semibold">Age Groups</h1>
                <h1 className="font-light mb-5">
                  {tournament?.additionalDetails.map((tour) => (
                    <li key={tour.id}>{tour.ageGroup}</li>
                  ))}
                </h1>

                <h1 className="font-semibold ">Participants Gender</h1>
                <h1 className="font-light mb-5">
                  {CONSTANTS.GENDER[tournament?.gender]}
                </h1>

                <h1 className="font-semibold ">Description</h1>
                <h1 className="font-light mb-5">{tournament?.description}</h1>

                <h1 className="font-semibold mb-2">Venue</h1>
                <div className="bg-gray-200 p-2 rounded-lg mb-5">
                  <h1 className="font-semibold">
                    {tournament?.tournament_wrapper?.venue?.split(",")[0].trim()}
                  </h1>
                  <h1 className="font-light">
                    {tournament?.tournament_wrapper?.venue?.split(",").slice(1).join(",").trim()}
                  </h1>
                  <a
                    href={`https://maps.google.com/maps?search&q=${tournament?.tournament_wrapper?.venue
                      ?.split(",")
                      .slice(1)
                      .join("+")
                      .trim()}`}
                    target="_blank"
                    className="text-purple-400 italic cursor-pointer"
                  >
                    Get Directions
                  </a>
                </div>

                <h1 className="font-semibold mb-2">Host Details</h1>
                <div className="bg-gray-200 p-2 rounded-lg mb-5 flex justify-between">
                  <div>
                    <h1 className="font-semibold mb-2">{tournament?.tournament_wrapper?.host?.name}</h1>
                    <h1 className="font-light">
                      {tournament?.tournament_wrapper?.host?.contact_number}
                    </h1>
                  </div>
                  {/* <div>
                    <h1>
                      <div>
                        {[...Array(filledStars)].map((_, index) => (
                          <StarIcon
                            className="text-orange-300 border-none"
                            key={index}
                          />
                        ))}

                        {[...Array(remainingStar)].map((_, index) => (
                          <StarBorderIcon key={index} />
                        ))}
                      </div>
                    </h1>
                    <h1 className="font-light text-gray-500">
                      {data.host.rating} / 5
                    </h1>
                  </div> */}
                </div>
                <div className="flex justify-between ">
                  {tournament?.user_is_host ? (
                    <>
                      <button
                        type="submit"
                        className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                        onClick={() =>
                          navigate("cancel/", {
                            state: { tournament_id: tournament?.id },
                          })
                        }
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-white bg-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                        onClick={() =>
                          navigate(`/tournament/edit/${tournament?.id}/`)
                        }
                      >
                        Edit
                      </button>
                    </>
                  ) : tournament?.user_status == "Pending" ? (
                    <>
                      <button
                        type="button"
                        className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                        disabled="true"
                      >
                        Request Pending
                      </button>
                    </>
                  ) : tournament?.user_status == "Rejected" ? (
                    <>
                      <button
                        type="button"
                        className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                        disabled="true"
                      >
                        Your request was rejected by the host.
                      </button>
                    </>
                  ) : tournament?.isOver ? (
                    <>
                      <button
                        type="button"
                        className="bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                      >
                        Tournament has ended
                      </button>
                    </>
                  ) : (
                    <>
                      {tournament?.user_status === "Participating" ? (
                        <button
                          type="button"
                          disabled
                          className="bg-orange-300 text-white border-orange-300 cursor-not-allowed border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                        >
                          Already Participated
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                          onClick={() =>
                            navigate(`${location.pathname}/team/add`)
                          }
                        >
                          Participate
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex p-3 pb-0 justify-around">
                {Array.from(tournament.additionalDetails).map((group) => (
                  <h1
                    key={group.id}
                    className={`cursor-pointer w-1/3 pb-1 flex justify-center 
                      ${
                        ageGroup?.ageGroup == group.ageGroup
                          ? "border-b-2 border-orange-500"
                          : "border-b-2 border-gray-200"
                      }`}
                    onClick={() => setAgeGroup(group)}
                  >
                    {group.ageGroup}
                  </h1>
                ))}
              </div>
              {isDetail == "participants" ? (
                <ParticipantTab
                  pendingTeams={ageGroup?.pendingTeams}
                  participatingTeams={ageGroup?.participatingTeams}
                  rejectedTeams={ageGroup?.rejectedTeams}
                  tournamentID={tournament?.id}
                />
              ) : isDetail == "tourney_media" ? (
                <>
                  {tournament?.user_is_host ? (
                    <EventCompletion
                      tournament_details_id={ageGroup?.id}
                      player_of_tourney={ageGroup?.player_of_tournament}
                      participants={ageGroup?.participatingTeams.map(
                        (item) => item.participantsDetails
                      )}
                      fixtures={ageGroup?.fixtures}
                    />
                  ) : (
                    <TournamentCard tournament_details_id={ageGroup?.id} />
                  )}
                </>
              ) : (
                // <MediaPage />
                <FixturesComponent
                  groupDetails={ageGroup}
                  isHost={tournament?.user_is_host}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <div>Couldn't find the page you looking for</div>
      )}
    </>
  );
};

export default DisplayForm;
