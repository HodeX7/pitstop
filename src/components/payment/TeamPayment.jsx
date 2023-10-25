import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { update } from "../../features/formSlice";
import PropTypes from "prop-types";

import { TeamAPI } from "../../services/api.service";
import { useNavigate } from "react-router-dom";

const TeamPaymentPage = ({ tournament, form, setForm }) => {
  // const dispatch = useDispatch();
  // const form = useSelector((state) => state.form);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  let toPay = tournament?.teamRegistrationFees;

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const paymentKey = "teamPayment";

    // const fileURL = URL.createObjectURL(uploadedFile);

    setFile(uploadedFile);

    // dispatch(update({ [paymentKey]: { blob: fileURL, name: uploadedFile.name, type: uploadedFile.type } }));
    setForm((prevState) => ({
      ...prevState,
      [paymentKey]: uploadedFile,
    }));
  };

  const handleSubmit = async () => {
    if (form.data && form.playerPayment && form.teamPayment) {
      // Create a new FormData object
      const formData = new FormData();

      // Append fields and their values to the FormData object
      formData.append('parent_tournament', tournament?.id);
      formData.append('name', form.data.name);
      formData.append('ageGroup', form.data.ageGroup);

      // Append arrays using a loop
      form.data.participantsDetails.forEach((obj, index) => {
        formData.append(`participantsName[]`, obj.name);
        formData.append(`participantsGender[]`, obj.gender);
        formData.append(`participantsAge[]`, obj.age);
        formData.append(`participantsIDProof[]`, obj.id_proof);
      });

      // Append payment proofs
      formData.append('paymentProof', form.teamPayment);
      formData.append('playerPaymentProof', form.playerPayment);

      const response = await TeamAPI.addTeam(formData);
      if (response) {
        alert("Wait for the host to accept your participation.");
        navigate('/');
      }
      console.log(data);
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
            <input
              name={`identityProof`}
              type="file"
              placeholder="Upload Payment Screenshot"
              className="outline-none bg-gray-100 flex-1"
              onChange={handleFileUpload}
            />
          </div>
        </div>
        {file ? (
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
