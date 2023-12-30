import { useNavigate, useParams } from "react-router-dom";

import { useAxios } from "../../services/api.service";
import { NavigationHeaderComponent } from "../../services/header.service";
import Shimmer from "../Shimmer";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { CONSTANTS, FORM_OPTIONS, formatDate } from "../../services/misc.services";


const Events = ({ tournaments, loaded }) => {
    const navigate = useNavigate();

    return (
        <>
            {loaded & (tournaments?.length > 0)
                ? tournaments?.map((event) => {
                    return (
                        <div
                            key={event.id}
                            className={` p-3 mb-2 rounded-lg ${CONSTANTS.getSportsColor(
                                event.tournament_wrapper.sport
                            )} cursor-pointer`}
                            onClick={() => navigate(`/tournament/${event.id}`)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h1 className="font-semibold capitalize ">{event.tournament_wrapper.title}</h1>
                                <h1 className="text-gray-500 text-sm capitalize">
                                    {event.tournamentStatus}
                                </h1>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <h1 className="text-orange-500 font-semibold capitalize">
                                    {event.tournament_wrapper.sport}
                                </h1>
                                <div className="flex text-gray-500 ">
                                    <CalendarTodayOutlinedIcon className="mr-2" />
                                    <h1>
                                        {formatDate(event.tournament_wrapper.fromDate)} - {formatDate(event.tournament_wrapper.toDate)}
                                    </h1>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <h1 className="text-gray-500 font-semibold">
                                    Age Groups : {event.additionalDetails}
                                </h1>
                                <h1 className="text-gray-500 font-semibold">
                                    {CONSTANTS.PARTICIPATION[event.participationType]} ({event.gender})
                                </h1>
                            </div>
                        </div>
                    );
                })
                : "No Tournaments Categories Available."}
        </>
    );
};


export default () => {

    const { id } = useParams();

    const [tournamentCategories, categoriesLoaded] = useAxios({
        url: `tournament/wrapper/${id}/get_categories/`,
        method: "get",
    });

    if (!categoriesLoaded) {
        return <Shimmer />;
    }

    return (
        <>
            <NavigationHeaderComponent
                title={tournamentCategories[0]?.tournament_wrapper?.title}
            />
            <div className="overflow-y-scroll maxh hide-scrollbar px-5">
                <h1 className="mt-7 mb-2 font-semibold">All Categories ( {tournamentCategories?.length ? tournamentCategories?.length : "0"} )</h1>
                <hr className="w-full h-[1px] bg-[#000] mb-4" />
                <Events tournaments={tournamentCategories} loaded={categoriesLoaded} />
            </div>
        </>
    );
}