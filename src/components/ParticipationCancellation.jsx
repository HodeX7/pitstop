import { useNavigate } from "react-router-dom";

const ParticipationCancellation = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-3">Cancel Participation</h1>
      <h1 className="mb-5">
        Please select a reason for canceling your Participation
      </h1>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2  w-5 h-5 cursor-pointer" />
        Not enough players
      </label>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        Change of Plans
      </label>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        No response from Host
      </label>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        {`I don't like the rules`}
      </label>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        {`I don't like the timing/venue`}
      </label>
      <textarea
        rows={5}
        className="w-full bg-gray-100 placeholder:text-gray-500 rounded-lg p-3 flex outline-none "
        placeholder="Type any additional comments here"
      />
      <div className="flex justify-between mt-10">
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

export default ParticipationCancellation;
