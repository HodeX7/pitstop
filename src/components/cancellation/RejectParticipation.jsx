import { useLocation, useNavigate } from "react-router-dom";
import { TeamAPI } from "../../services/api.service";

const RejectParticipation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { team_id, tournament_id, team } = location.state;

  const rejectTeamParticipation = () => {
    TeamAPI.changeTeamParticipationStatus(team_id, { tournament_id: tournament_id, status: "rejected" })
      .then(res => {
        if (res.status == 200) {
          alert(`${team}'s participation was rejected.`);
          navigate(-2);
        }
      })
      .catch(err => {
        if (err.status == 404) {
          alert('Bad Request');
        }
        console.error(err)
      })
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-3">Reject Participation Request</h1>
      <h1 className="mb-5">
        Please select a reason for Rejecting <strong>{team}'s</strong> Participation Request..
      </h1>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2  w-5 h-5 cursor-pointer" />
        Invalid Documents
      </label>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        Too many players
      </label>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        Not enough players
      </label>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        Payment not received
      </label>
      <textarea
        rows={5}
        className="w-full bg-gray-100 placeholder:text-gray-500 rounded-lg p-3 flex outline-none "
        placeholder="Type any additional comments here"
      />
      <div className="flex justify-between mt-80">
        <button
          type="submit"
          className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
          onClick={rejectTeamParticipation}
        >
          Submit
        </button>
        <button
          type="submit"
          className="bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
          onClick={() => navigate(-1)}
        >
          Discard
        </button>
      </div>
    </div>
  );
};

export default RejectParticipation;
