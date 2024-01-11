import { useNavigate } from "react-router-dom";

export default ({ tournament_id,status, is_host, is_over }) => {

    const navigate = useNavigate()

    const renderCancelButton = () => (
        <button
            type="submit"
            className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
            onClick={() => navigate("cancel/", { state: { tournament_id: tournament_id } })}
        >
            Cancel
        </button>
    );

    const renderEditButton = () => (
        <button
            type="submit"
            className="text-white bg-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
            onClick={() => navigate(`/tournament/wrapper/edit/${tournament_id}/`)}
        >
            Edit
        </button>
    );

    const renderOverButton = () => (
        <button
            type="submit"
            className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
            onClick={() => navigate(`/tournament/end/${tournament_id}/`)}
        >
            End Tournament
        </button>
    );

    const renderPendingButton = () => (
        <button
            type="button"
            className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
            disabled
        >
            Request Pending
        </button>
    );

    const renderRejectedButton = () => (
        <button
            type="button"
            className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
            disabled
        >
            Your request was rejected by the host.
        </button>
    );

    const renderParticipationButtons = () => {
        if (status === "Participating") {
            return (
                <button
                    type="button"
                    disabled
                    className="bg-orange-300 text-white border-orange-300 cursor-not-allowed border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                >
                    Already Participated
                </button>
            );
        }

        return (
            <button
                type="submit"
                className="bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                onClick={() => navigate(`${location.pathname}/team/add`)}
            >
                Participate
            </button>
        );
    };

    return (
        <div className="flex justify-between">
            {is_over ? (
                null
            ) : status === "Pending" ? (
                renderPendingButton()
            ) : status === "Rejected" ? (
                renderRejectedButton()
            ) : is_host && !is_over ? (
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="w-full flex items-center">
                        {renderCancelButton()}
                        {renderEditButton()}
                    </div>
                    {renderOverButton()}
                </div>
            ) : (
                renderParticipationButtons()
            )}
        </div>
    );
};
