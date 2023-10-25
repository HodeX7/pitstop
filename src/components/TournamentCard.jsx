import React, { useEffect } from "react";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { API_MEDIA, useAxios } from "../services/api.service";
import Shimmer from "./Shimmer";

const TournamentCard = ({ tournament_details_id }) => {

    const [media, isReady] = useAxios({
        url: `tourney_details/${tournament_details_id}/get_media/`,
        method: 'get'
    });

    useEffect(() => {
        console.log(media);
    }, [isReady])

    if (isReady && !(media.length > 0)) {
        return <h1 className="flex items-center justify-center text-2xl mt-10">Nothing to show</h1>
    }
    
    return (
        <>
            {isReady ? (
                <>
                    {media.map((item, idx) => ( 
                        <div className="mt-5 px-4">
                            <img
                                className="w-full h-70 object-cover mb-2 rounded-lg"
                                src={API_MEDIA + item.media_file.url}
                                alt={item.media_file.name}
                            />
                            <div className="p-2 flex items-center justify-between">
                                <div className="flex items-center w-3/4">
                                    <h2>{item.title}</h2>
                                </div>
                                <ShareOutlinedIcon className="cursor-pointer" />
                            </div>
                            <div className="flex ml-2 items-center">
                                <h3 className="text-gray-500 text-sm mr-4">{item.views} Views</h3>
                                <h3 className="text-gray-500 text-sm">12th June, 2023</h3>
                            </div>
                        </div>
                    ))}
                </>

            ) : (<Shimmer />)}
        </>
    );
};

export default TournamentCard;