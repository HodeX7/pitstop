import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TeamAPI } from "../services/api.service";

const ParticipantCancellation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { participant } = location.state;

  const rejectParticipant = () => {
    if (participant) {
      const formdata = {
        'name': participant?.name,
        'status': false
      }
    
      TeamAPI.verifyParticipant(participant?.tid, formdata)
        .then(res => {
          if (res.status == 200) {
            navigate(-2)
          }
        })
        .catch(err => {
          console.error(err.response.data)
        })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-3">Cancel Participant</h1>
      <h1 className="mb-5">
        Please select a reason for canceling <strong>{participant?.name}'s</strong> Participation.
      </h1>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2  w-5 h-5 cursor-pointer" />
        Invalid Documents
      </label>
      <label className="flex items-center mb-3">
        <input type="checkbox" className="mr-2 w-5 h-5 cursor-pointer" />
        Canceled by Participant
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
          onClick={() => rejectParticipant()}
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

export default ParticipantCancellation;
