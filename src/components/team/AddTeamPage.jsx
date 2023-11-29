import { useState } from "react";
import * as Yup from "yup";
import ParticipantForm from "./ParticipantForm";
// import PaymentPage from "./PaymentPage";
import { useParams } from "react-router-dom";
import { TournamentAPI, useAxios } from "../../services/api.service";
import { NavigationHeaderComponent } from "../../services/header.service";
import TeamPaymentPage from "../payment/TeamPayment";
import PlayerPaymentPage from "../payment/PlayerPayment";
import Shimmer from "../Shimmer";

const AddTeamPage = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState("team_form");
  const [completedTabs, setCompletedTabs] = useState(["team_form"]);
  const [form, setForm] = useState({
    data: {
      name: "",
      ageGroup: "",
      participantsDetails: [],
    },
    playerPayment: null,
    teamPayment: null,
  });

  const [tournament, isReady] = useAxios({
    url: `tournament/${parseInt(id)}`,
    method: "get",
  });

  //   const form = useSelector((state) => state.form);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Team name is required"),
  });

  const handleTabClick = (tabName) => {
    if (completedTabs.includes(tabName)) {
      setCurrentPage(tabName);
    }
  };

  const handleContinueClick = (tabName) => {
    if (!completedTabs.includes(tabName)) {
      setCompletedTabs([...completedTabs, tabName]);
    }
    setCurrentPage(tabName);
  };

  return (
    <>
      {isReady ? (
        <>
          <NavigationHeaderComponent title={"Create a team"} />
          <div>
            <div className="flex p-3 pb-0 justify-around">
              <h1
                className={`cursor-pointer w-1/3 pb-1 flex justify-center ${
                  currentPage == "team_form"
                    ? " border-b-2 border-orange-500"
                    : "border-b-2 border-gray-200 text-gray-500 text-opacity-50"
                }`}
                onClick={() => handleTabClick("team_form")}
              >
                Team Form
              </h1>
              <h1
                className={`cursor-pointer w-1/3 pb-1 flex justify-center ${
                  currentPage == "player_pay"
                    ? " border-b-2 border-orange-500"
                    : "border-b-2 border-gray-200 text-gray-500 text-opacity-50"
                }`}
                onClick={() => handleTabClick("player_pay")}
              >
                Player Payment
              </h1>
              <h1
                className={`cursor-pointer w-1/3 pb-1 flex justify-center ${
                  currentPage == "team_pay"
                    ? " border-b-2 border-orange-500"
                    : "border-b-2 border-gray-200 text-gray-500 text-opacity-50"
                }`}
                onClick={() => handleTabClick("team_pay")}
              >
                Team Payment
              </h1>
            </div>
            {currentPage == "team_form" ? (
              <ParticipantForm
                numberOfCards={tournament?.numOfPlayersPerTeam}
                ageGroups={tournament?.additionalDetails.map(
                  (item) => item.ageGroup
                )}
                continueNextPage={handleContinueClick}
                form={form}
                setForm={setForm}
              />
            ) : currentPage == "player_pay" ? (
              <>
                <PlayerPaymentPage
                  tournament={tournament}
                  continueNextPage={handleContinueClick}
                  form={form}
                  setForm={setForm}
                />
              </>
            ) : (
              <>
                <TeamPaymentPage
                  tournament={tournament}
                  form={form}
                  setForm={setForm}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <Shimmer />
      )}
    </>
  );
};

export default AddTeamPage;
