import { useState } from "react";
import QR from "../assets/dummyQR.webp";
import { IconButton, Tooltip } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { update } from "../features/formSlice";

const PaymentPage = ({ paymentType, tournament }) => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.form);

  const [file, setFile] = useState(null);

  let toPay = tournament ? tournament.teamRegistrationFees : "NaN";
  if (paymentType == "player_pay") {
    toPay = tournament?.player_register_fees * tournament?.numOfPlayersPerTeam;
  }

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const paymentKey =
      paymentType === "team_pay" ? "teamPayment" : "playerPayment";

    setFile(uploadedFile);

    dispatch(update({ [paymentKey]: uploadedFile }));

    console.log(form); //Dhruv check here if the state is properly populated or not
  };

  const handleSubmit = () => {
    // handle submit logic
  };

  const handleCopy = () => {
    const textToCopy = "pitstopapp@ybl";
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-center mb-3">
          <img
            src={paymentType == "team_pay" ? tournament?.host_QRCode : QR}
            alt="QR Code"
            className="w-3/4 "
          />
        </div>
        {paymentType != "team_pay" ? (
          <div className="flex items-center">
            <h1 className="font-semibold mb-1">pitstopapp@ybl</h1>
            <Tooltip title={isCopied ? "Copied!" : "Copy"}>
              <IconButton onClick={handleCopy}>
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : null}
        <h1>
          {paymentType == "team_pay" && tournament
            ? tournament.host.contact_number
            : "+91 98989 98989"}
        </h1>

        <h1 className="text-3xl space-x-2 tracking-wider font-semibold mt-10">
          ₹{toPay}
        </h1>
        {paymentType != "team_pay" ? (
          <h1 className="tracking-tighter text-sm">
            {tournament?.numOfPlayersPerTeam} Players x ₹
            {tournament?.player_register_fees}
          </h1>
        ) : null}

        <h1 className=" space-x-2 font-semibold mt-10">
          Confirm {paymentType == "team_pay" ? "Team" : "Player"} Registration
          Payment
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
          >
            {paymentType == "team_pay" ? "Continue" : "Submit"}
          </button>
        ) : (
          <button
            type="submit"
            className="bg-orange-200 cursor-not-allowed text-white flex p-3 rounded-lg mt-6 w-full justify-center"
            onChange={
              paymentType == "team_pay"
                ? () => {
                    console.log(form);
                  }
                : () => {
                    console.log("Final data is ", form);
                    handleSubmit();
                  }
            }
          >
            {paymentType == "team_pay" ? "Continue" : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};
PaymentPage.propTypes = {
  paymentType: PropTypes.string.isRequired,
  tournament: PropTypes.shape({
    teamRegistrationFees: PropTypes.number,
    player_register_fees: PropTypes.number,
    numOfPlayersPerTeam: PropTypes.number,
    host_QRCode: PropTypes.string,
    host: PropTypes.shape({
      contact_number: PropTypes.string,
    }),
  }),
};

export default PaymentPage;
