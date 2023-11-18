import { useEffect, useState } from "react";

import data from "../../assets/dummyFormData.json";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { TeamAPI, TournamentAPI, useAxios } from "../../services/api.service";
import { formatDateTime } from "../../services/misc.services";
import { NavigationHeaderComponent } from "../../services/header.service";
import Shimmer from "../Shimmer";

const ParticipantScreen = () => {
  const navigate = useNavigate()
  const { tournament_id, team_id } = useParams()
  // const [team, setTeam] = useState()
  // const [tournament, setTournament] = useState()
  const [tournament, isTourneyReady] = useAxios({
    url: `tournament/${parseInt(tournament_id)}`,
    method: "get",
  });

  const [team, isteamReady] = useAxios({
    url: `team/${parseInt(team_id)}`,
    method: "get",
  });

  const [enable, setEnable] = useState(false);

  const navigateToParticipant = (participant_id) => {
    const state = { ...team.participantsDetails[participant_id], tid: team_id, is_host: tournament.user_is_host }
    navigate(`/tournament/${team.parent_tournament}/team/${team.id}/participant`, { state });
  }

  const acceptTeamParticipation = () => {
    TeamAPI.changeTeamParticipationStatus(team_id, { tournament_id: tournament_id, status: "accepted" })
      .then(res => {
        if (res.status == 200) {
          navigate(-1)
        }
      })
      .catch(err => {
        if (err.status == 404) {
          alert('Bad Request')
        }
      })
  }

  useEffect(() => {
    if (isteamReady) {
      let isAnyParticipantNotVerified = team.participantsDetails.some((member) => !member.is_verified)
      setEnable(!isAnyParticipantNotVerified)
    }
  }, [isteamReady])

  return (
    <>
      {isteamReady && isTourneyReady ?
        <>
          <NavigationHeaderComponent title={team?.name} />
          <div>
            {team.status === "Pending" ? (
              <div className="bg-gray-200 rounded-lg p-2 w-full flex justify-center">
                Request Pending
              </div>
            ) : null}
            <div className="p-6">
              <h1 className="font-semibold ">Participation Submitted By</h1>
              <h1 className="font-light mb-5">{team.leader.name}</h1>

              <h1 className="font-semibold ">Submission Date</h1>
              <h1 className="font-light mb-5">{formatDateTime(team.submissionDate)}</h1>

              <h1 className="font-semibold ">Contact Number</h1>
              <h1 className="font-light mb-5">{team.leader.contact_number}</h1>

              <h1 className="font-semibold ">Email ID</h1>
              <h1 className="font-light mb-5">{team.leader.email}</h1>

              <h1 className="font-semibold mb-2">Participant Details</h1>
              {team.participantsDetails.map((participant, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-5 rounded-lg mb-2 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {participant.is_verified ? (
                        <CheckCircleOutlineOutlinedIcon className="text-green-500" />
                      ) : (
                        <ErrorOutlineOutlinedIcon className="text-orange-500" />
                      )}
                    </div>
                    <div>
                      <h1 className="font-semibold mb-2">{participant.name}</h1>
                      <h1 className="font-light text-gray-500">
                        {participant.gender}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-3">
                      <h1 className="flex justify-end text-gray-500">#{index + 1}</h1>
                      <h1 className="text-gray-500">{participant.age} Years Old</h1>
                    </div>
                    <ChevronRightOutlinedIcon className="cursor-pointer" onClick={() => navigateToParticipant(index)} />
                  </div>
                </div>
              ))}
              <h1 className="font-semibold mb-2">Registration Payment Proof</h1>
              <h1 className="bg-gray-100 font-semibold p-5 rounded-lg mb-2 flex items-center justify-between">
                <img className="mb-8" src={team.paymentProof} alt="" />
              </h1>
              {tournament.user_is_host ? (
                <div className="flex justify-between ">
                  <button
                    type="submit"
                    className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                    onClick={() => navigate('reject', {state: {team_id: team_id, tournament_id: tournament_id, team: team?.name}})}
                  >
                    Reject
                  </button>
                  {!enable ? (
                    <button
                      className="bg-orange-200 cursor-not-allowed border-orange-200 text-white  border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                    >
                      Accept
                    </button>
                  ) : (
                    <button
                      className="bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                      onClick={acceptTeamParticipation}
                    >
                      Accept
                    </button>
                  )}
                </div>
              ) : ((tournament.user_status === "Participating" || tournament.user_status == "Pending") && !tournament.isOver) ? (
                <button
                  className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                  onClick={() => navigate('cancel/', {state: {}})}
                >
                  Cancel Participation
                </button>
              ) : null}
            </div>
          </div>
        </>
        : <Shimmer />
      }
    </>
  );
};

export default ParticipantScreen;
