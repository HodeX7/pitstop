import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Share } from "@mui/icons-material";

export const NavigationHeaderComponent = ({ title, shareLink, img }) => {
  const navigate = useNavigate();

  const exitCurrentScreen = () => navigate("/");
  const backButton = () => navigate(-1);

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
          onClick={() => {
            navigator.clipboard.writeText(shareLink);
            alert("Link Copied");
          }}
        />
      ) : (
        <CloseIcon className="cursor-pointer" onClick={exitCurrentScreen} />
      )}
    </div>
  );
};
