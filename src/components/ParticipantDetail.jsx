import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/ParticipantAdhaar.png";
import { useEffect, useState } from "react";
import { API_URL, TeamAPI } from "../services/api.service";
import { NavigationHeaderComponent } from "../services/header.service";

const ParticipantDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const [participant, setParticipant] = useState()

  const verifyParticipant = (status) => {
    if (participant) {
      const formdata = {
        'name': participant.name,
        'status': status
      }
    
      TeamAPI.verifyParticipant(participant.tid, formdata)
        .then(res => {
          if (res.status == 200) {
            navigate(-1)
          }
        })
        .catch(err => {
          console.error(err.response.data)
        })
    }
  }

  useEffect(() => {
    setParticipant(data)
  }, [])

  return (
    <>
      <NavigationHeaderComponent title={participant?.name} />
      <div className="p-6">
        {participant ? (
          <div>
            <h1 className="text-xl font-semibold mb-2">Name</h1>
            <h1 className="mb-6 capitalize">{participant.name}</h1>

            <h1 className="text-xl font-semibold mb-2">Gender</h1>
            <h1 className="mb-6 capitalize">{participant.gender}</h1>

            <h1 className="text-xl font-semibold mb-2">Age</h1>
            <h1 className="mb-6">{participant.age}</h1>

            <h1 className="text-xl font-semibold mb-2">
              Government Identification Document
            </h1>
            <img className="mb-8" src={API_URL.slice(0, -4) + participant.id_proof} alt="" />
            {participant.is_host ? (
              <>
                <button className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                  onClick={() => navigate('reject/', {state: {participant: participant}})}
                >
                  Reject
                </button>
                <button className="bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                  onClick={() => verifyParticipant(true)}
                >
                  Accept
                </button>
              </>
            ) : (null)}
          </div>
        ) : (
          <h1>Couldn't find the info you're looking for</h1>
        )}
      </div>
    </>
  );
};

export default ParticipantDetail;
