import React, { useEffect } from "react";
import { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import MediaPage from "./MediaPage";
import { axiosAuthorized, capacitorHTTPClient, useAxios } from "../services/api.service";

const EventCompletion = ({tournament_details_id, player_of_tourney, participants, fixtures}) => {
  const [winner, setWinner] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [media, setMedia] = useState([]);

  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  const [files, setFiles] = useState([]);

  // const teams = ["Team A", "Team B"];
  // const players = ["player 1", "player 2", "player 3", "player 4", "player 5"];

  const refreshMedia = async () => {
    const res = await capacitorHTTPClient(`tourney_details/${tournament_details_id}/get_media/`, {
      method: 'get'
    })
  
    if (res) {
      setFiles(res.data)
    }
  }

  const updatePlayer = async (data) => {
    const res = await capacitorHTTPClient(`tourney_details/${tournament_details_id}/update_pot/`, {
      method: 'post',
      data: data
    })
  
    if (res) {
      alert("Player of tournament was updated.")
    }
  }

  const uploadMedia = async (media) => {
    const res = await capacitorHTTPClient(`tourney_details/${tournament_details_id}/update_pot/`, {
      method: 'post',
      data: media
    }, true)
  
    if (res) {
      alert("Media was uploaded");
    }
  }

  useEffect(() => {
    refreshMedia();
    // axiosAuthorized.get(`tourney_details/${tournament_details_id}/get_media/`)
    //   .then(res => {
    //     setFiles(res.data)
    //   })
  }, [tournament_details_id]);

  useEffect(() => {
    let clone = [...fixtures];
    const last_round = clone?.pop()?.seeds[0];
    setWinner(last_round?.winner);
    setTeams(last_round?.teams?.map(item => item.name));
    setPlayers([].concat(...participants?.map(item => item.map(i => i.name))));
    setSelectedPlayer(player_of_tourney);

  }, [participants, fixtures, player_of_tourney])

  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
  };
  const handleMediaClick = () => {
    //redirect to specific tourney's media page.
  };
  const handleFileSelection = (event) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);
    setMedia((prevMedia) => [...prevMedia, ...filesArray]);
  };

  const openFilePicker = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  const renderMediaPreview = (file) => {
    const fileType = file.type;
    if (fileType.startsWith("image/")) {
      return (
        <img
          className="w-20 h-20 rounded-lg"
          src={URL.createObjectURL(file)}
          alt={file.name}
        />
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <video controls>
          <source
            className="w-20 h-20 rounded-lg"
            src={URL.createObjectURL(file)}
            type={fileType}
          />
        </video>
      );
    }
    return null;
  };

  const handleSubmitForm = () => {
    let pot_data = {
      player: selectedPlayer
    }
    
    let media_data = {
      media_files: media
    }

    if (player_of_tourney != selectedPlayer) {
      updatePlayer(pot_data);
    }

    if (media.length > 0) {
      uploadMedia(media_data);
    }
  }

  return (
    <div className="p-6 flex flex-col justify-between min-h-screen">
      <div>
        <h1 className="font-semibold">Here's the tournament winner!</h1>
        {teams?.map((team, idx) => (
          <div
            key={idx}
            className={`w-full p-2 my-4 cursor-pointer flex justify-between ${winner === team
                ? "border-2 bg-gray-200 font-semibold text-[#50A5AF] border-[#50A5AF] rounded-xl"
                : "bg-gray-200 border-2 rounded-xl"
              }`}
          >
            {team}
            {winner === team && <DoneIcon className="mr-2 text-[#50A5AF]" />}
          </div>
        ))}
        <h1 className="font-semibold">
          Please select the player of the tournament!
        </h1>
        <select
          value={selectedPlayer}
          onChange={handlePlayerChange}
          className="bg-gray-200 w-full p-2 my-4 rounded-xl cursor-pointer"
        >
          <option value="">Select a player</option>
          {players.map((player, idx) => (
            <option key={idx} value={player}>
              {player}
            </option>
          ))}
        </select>
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Media</h1>
          <div className="font-semibold flex items-center">
            {media.length}
            <ChevronRightIcon
              className="cursor-pointer"
              onClick={handleMediaClick}
            />
          </div>
        </div>
        <div
          className="mt-4 rounded-xl cursor-pointer p-5 w-20 bg-gray-200"
          onClick={openFilePicker}
        >
          <AddPhotoAlternateIcon
            className="text-[#50A5AF]"
            style={{ fontSize: 45 }}
          />
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*, video/*"
          style={{ display: "none" }}
          onChange={handleFileSelection}
          multiple
        />
        <div className="overflow-x-auto">
          <ul className="flex">
            {media.map((file, index) => (
              <div
                key={index}
                className="mt-2 mr-2 overflow-hidden"
                style={{ minWidth: "80px" }}
              >
                {renderMediaPreview(file)}
              </div>
            ))}
          </ul>
        </div>
      </div>
      <button className=" bg-orange-500 text-white flex p-3 rounded-lg mt-6 w-full justify-center"
        onClick={() => handleSubmitForm()}>
        Submit
      </button>
      <MediaPage files={files} media={media} setMedia={setMedia} />
    </div>
  );
};

export default EventCompletion;
