import { useEffect } from "react";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { API_MEDIA, useAxios } from "../services/api.service";
import Shimmer from "./Shimmer";
import { Share } from "@capacitor/share";
import { Clipboard } from "@capacitor/clipboard";
import { Toast } from "@capacitor/toast";

const TournamentCard = ({ tournament_details_id }) => {
  const [media, isReady] = useAxios({
    url: `tourney_details/${tournament_details_id}/get_media/`,
    method: "get",
  });

  const shareMediaFile = async (title, url) => {
    const canShare = await Share.canShare();
    if (canShare.value) {
      await Share.share({
        title: 'Checkout this Tournament Highlight at Pitstop!',
        text: title,
        url: url,
        dialogTitle: 'Share with buddies',
      });
    } else {
      await Clipboard.write({
        string: url
      });
      Toast.show({
        text: "Media URL was copied to clipboard.",
        duration: "long"
      });
    }
  }

  if (isReady && !(media.length > 0)) {
    return (
      <h1 className="flex items-center justify-center text-2xl mt-10">
        No Media Available.
      </h1>
    );
  }

  return (
    <>
      {isReady ? (
        <div className="mt-5">
          {media.map((item, idx) => (
            <div className="mb-5 px-4" key={idx}>

              {item.media_type === "image" ? (
                <img
                  className="w-full h-70 object-cover mb-2 rounded-lg"
                  src={API_MEDIA + item.media_file.url}
                  alt={item.media_file.name}
                />
              ) : (
                <video className="" controls>
                    <source src={API_MEDIA + item.media_file.url} />
                </video>
              )}
              
              <div className="p-2 flex items-center justify-between">
                <div className="flex items-center w-3/4">
                  <h2>{item.title}</h2>
                </div>
                <ShareOutlinedIcon className="cursor-pointer" onClick={() => shareMediaFile(item.title, API_MEDIA + item.media_file.url)} />
              </div>
              <div className="px-2 flex items-center justify-between">
                <h3 className="text-gray-500 text-sm mr-4">
                  {item.views} Views
                </h3>
                <h3 className="text-gray-500 text-sm">{item.createdAt}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Shimmer />
      )}
    </>
  );
};

export default TournamentCard;
