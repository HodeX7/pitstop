import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { update } from "../../features/formSlice";
import PropTypes from "prop-types";

import { TeamAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";
import useCamera from "../../utils/useCamera";
import FileInput, { base64ToBlob } from "../../utils/FileInput";
import { Toast } from "@capacitor/toast";

const TeamPaymentPage = ({ tournament, form, setForm }) => {
  const navigate = useNavigate();

  const [picture, error, takePicture, removePicture] = useCamera({
    filename: "teamPayment",
    type: "image",
  });

  let toPay = tournament?.teamRegistrationFees;

  const handleSubmit = async () => {
    console.log(form.data);
    setForm((prevState) => ({
      ...prevState,
      teamPayment: picture,
    }));

    if (form.data && form.playerPayment && form.teamPayment) {
      // Create a new FormData object
      const formData = new FormData();

      // Append fields and their values to the FormData object
      formData.set("parent_tournament", tournament?.id);
      formData.set("name", form.data.name);
      formData.set("ageGroup", form.data.ageGroup);

      form.data.participantsDetails.forEach((obj) => {
        formData.append(`participantsName[]`, obj.name);
        formData.append(`participantsGender[]`, obj.gender);
        formData.append(`participantsAge[]`, obj.age);

        if (obj.id_proof.blob) {
          formData.append(
            `participantsIDProof[]`,
            obj.id_proof.blob,
            obj.id_proof.name
          );
        } else {
          let blob = base64ToBlob(obj.id_proof.data, obj.id_proof.mimeType);
          formData.append(`participantsIDProof[]`, blob, obj.id_proof.name);
        }
      });

      // Append payment proofs
      const playerBlob = await fetch(form.playerPayment.imageUrl);
      formData.append(
        "playerPaymentProof",
        await playerBlob.blob(),
        form.playerPayment.name
      );

      const teamBlob = await fetch(form.teamPayment.imageUrl);
      formData.append(
        "paymentProof",
        await teamBlob.blob(),
        form.teamPayment.name
      );
      // for (const pair of formData.entries()) {
      //   console.log(pair[0] + ": ->" + pair[1]);
      // }
      // for(const i in formData.)
      const response = await TeamAPI.addTeam(formData);
      if (response) {
        Toast.show({
          text: "Request was sent! Wait for the host to accept your participation.",
          duration: "long",
        });
        navigate(`/tournament/${tournament?.id}`);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-center mb-3">
          <img src={tournament?.host_QRCode} alt="QR Code" className="w-3/4 " />
        </div>
        <h1>{tournament?.host.contact_number}</h1>

        <h1 className="text-3xl space-x-2 tracking-wider font-semibold mt-10">
          ₹{toPay}
        </h1>

        <h1 className=" space-x-2 font-semibold mt-10">
          Confirm Team Registration Payment
        </h1>
        <h1 className="text-md mt-1 text-center">
          {`Please make a payment of ₹${toPay} to the above UPI ID and upload the
          transaction screenshot to confirm your Registration`}
        </h1>
        <div className="mt-3">
          <div className="bg-gray-100 flex p-3 rounded-lg flex-col mt-5 mb-10">
            <h1>Upload your payment screenshot here</h1>
            <FileInput
              picture={picture}
              error={error}
              takePicture={takePicture}
              removePicture={removePicture}
            />
          </div>
        </div>
        {picture ? (
          <button
            type="submit"
            className="bg-orange-500 cursor-pointer text-white flex p-3 rounded-lg mt-6 w-full justify-center"
            onClick={handleSubmit}
          >
            Submit Team
          </button>
        ) : (
          <button
            type="submit"
            className="bg-orange-200 cursor-not-allowed text-white flex p-3 rounded-lg mt-6 w-full justify-center"
          >
            Submit Team
          </button>
        )}
      </div>
    </div>
  );
};

TeamPaymentPage.propTypes = {
  tournament: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
};

export default TeamPaymentPage;
