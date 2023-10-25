import { useLocation, useNavigate } from "react-router-dom";
import { TournamentAPI } from "../services/api.service";

const EventCancellation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tournament_id } = location.state;

  const cancelTournament = () => {
    TournamentAPI.deleteTournament(parseInt(tournament_id)).then((res) => {
      if (res) {
        alert('Your tournament was cancelled.');
        navigate('/');
      }
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-3">Cancel Tournament</h1>
      <h1 className="mb-5">Please select a reason for canceling your tournament.</h1>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2  w-5 h-5 cursor-pointer" />
        Not enough participants
      </label>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        Change of plans
      </label>
      <label className="flex items-center mb-5">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        Postponed
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

export default EventCancellation;
