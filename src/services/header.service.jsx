import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Share as ShareAPI } from "@capacitor/share";
import { Clipboard } from "@capacitor/clipboard";
import { Toast } from "@capacitor/toast";
import { Share } from "@mui/icons-material";

export const NavigationHeaderComponent = ({ title, shareLink, img }) => {
  const navigate = useNavigate();

  const exitCurrentScreen = () => navigate("/");
  const backButton = () => navigate(-1);

  const shareTournament = async (url) => {
    const canShare = await ShareAPI.canShare();
    if (canShare.value) {
      await ShareAPI.share({
        title: 'Checkout this Tournament at Pitstop!',
        url: url,
        dialogTitle: 'Share with buddies',
      });
    } else {
      await Clipboard.write({
        string: url
      });
      Toast.show({
        text: "Tournament URL was copied to clipboard.",
        duration: "long"
      });
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-5 font-bold">
      <div className="flex items-center gap-4">
        <ArrowBackIosNewIcon className="cursor-pointer" onClick={backButton} />
        {img ? <img src={img} className="h-10 w-10" /> : null}
      </div>
      <span className="text-lg capitalize text-secondary">{title}</span>
      {shareLink ? (
        <Share
          className="cursor-pointer"
          onClick={() => shareTournament(shareLink)}
        />
      ) : (
        <CloseIcon className="cursor-pointer" onClick={exitCurrentScreen} />
      )}
    </div>
  );
};
