import { useState } from "react";
import QR from "../../assets/pitstopQR.jpeg";
import { IconButton, Tooltip } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import useCamera from "../../utils/useCamera";
import FileInput from "../../utils/FileInput";
import { Clipboard } from "@capacitor/clipboard";
import { Toast } from "@capacitor/toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { update } from "../../features/formSlice";

const PlayerPaymentPage = ({ tournament, continueNextPage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useSelector((state) => state.form);

  const [file, setFile] = useState(null);
  const [picture, error, takePicture, removePicture] = useCamera({
    filename: "teamPayment",
    type: "image",
  });

  const numOfPlayers = tournament?.numOfPlayersPerTeam
    ? tournament?.numOfPlayersPerTeam
    : tournament.participationType === "singles"
    ? 1
    : 2;

  let toPay =
    parseInt(numOfPlayers) * parseInt(tournament?.player_register_fees);

  const handleContinue = () => {
    // console.log("form", form);
    if (picture) {
      dispatch(update({ playerPayment: picture }));
      // setForm((prevState) => ({
      //   ...prevState,
      //   playerPayment: picture,
      // }));
      continueNextPage("team_pay");
    }
  };

  const handleCopy = async () => {
    const textToCopy = "kartiknair8@okicici";
    try {
      await Clipboard.write({
        string: textToCopy,
      });
    } catch (err) {
      Toast.show({
        text: "Something went wrong: " + err,
        duration: "long",
      });
    }
    // navigator.clipboard.writeText(textToCopy).then(() => {
    //   alert("Copied to clipboard!");
    // });
  };

  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-center mb-3">
          <img src={QR} alt="QR Code" className="w-3/4 " />
        </div>
        <div className="flex items-center">
          <h1 className="font-semibold mb-1">kartiknair8@okicici</h1>
          <Tooltip title={isCopied ? "Copied!" : "Copy"}>
            <IconButton onClick={handleCopy}>
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        </div>
        <h1>+91 73874 35929</h1>

        <h1 className="text-3xl space-x-2 tracking-wider font-semibold mt-10">
          ₹{toPay}
        </h1>
        <h1 className="tracking-tighter text-sm mt-1">
          ₹{tournament?.player_register_fees}{" "}
          <span className="ml-1">/ per player</span>
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
            <h1>Upload your payment screenshot here</h1>
            <FileInput
              picture={picture}
              error={error}
              takePicture={takePicture}
              removePicture={removePicture}
            />
            {/* <input
              name={`identityProof`}
              type="file"
              placeholder="Upload Payment Screenshot"
              className="outline-none bg-gray-100 flex-1"
              onChange={handleFileUpload}
            /> */}
          </div>
        </div>
        {picture ? (
          <button
            type="submit"
            className="bg-orange-500 cursor-pointer text-white flex p-3 rounded-lg mt-6 w-full justify-center"
            onClick={() => handleContinue()}
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
