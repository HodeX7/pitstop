import { useState, useEffect } from "react";
import QR from "../../assets/dummyQR.webp";
import { IconButton, Tooltip } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
// import { useDispatch, useSelector } from "react-redux";
// import { update } from "../../features/formSlice";
import { TeamAPI } from "../../services/api.service";
import { data } from "autoprefixer";
import { useNavigate } from "react-router-dom";

const PlayerPaymentPage = ({ tournament, continueNextPage, form, setForm }) => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const form = useSelector((state) => state.form);

  const [file, setFile] = useState(null);

  let toPay =
    parseInt(tournament?.numOfPlayersPerTeam) *
    parseInt(tournament?.player_register_fees);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const paymentKey = "playerPayment";

    //BLOB code
    // const fileURL = URL.createObjectURL(uploadedFile);

    setFile(uploadedFile);

    // dispatch(update({ [paymentKey]: {blob: fileURL, name: uploadedFile.name, type: uploadedFile.type} }));

    //the new state contains the property "file" instead of "blob" - to Dhruv
    setForm((prevState) => ({
      ...prevState,
      [paymentKey]: uploadedFile,
    }));
  };

  // const blobUrlToFile = async (proof) => {
  //   const response = await fetch(proof.blob);
  //   const blob = await response.blob();

  //   const file = new File([blob], proof.name, { type: proof.type });
  //   return file;
  // };

  const handleCopy = () => {
    const textToCopy = "pitstopapp@ybl";
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="p-6">
      {console.log(tournament)}
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-center mb-3">
          <img src={QR} alt="QR Code" className="w-3/4 " />
        </div>
        <div className="flex items-center">
          <h1 className="font-semibold mb-1">pitstopapp@ybl</h1>
          <Tooltip title={isCopied ? "Copied!" : "Copy"}>
            <IconButton onClick={handleCopy}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        </div>
        <h1>+91 98989 98989</h1>

        <h1 className="text-3xl space-x-2 tracking-wider font-semibold mt-10">
          ₹{toPay}
        </h1>
        <h1 className="tracking-tighter text-sm">
          {tournament?.numOfPlayersPerTeam} Players x ₹
          {tournament?.player_register_fees}
        </h1>

        <h1 className=" space-x-2 font-semibold mt-10">
          Confirm Player Registration Payment
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
            onClick={() => continueNextPage("team_pay")}
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            className="bg-orange-200 cursor-not-allowed text-white flex p-3 rounded-lg mt-6 w-full justify-center"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayerPaymentPage;
