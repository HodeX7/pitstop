import { useEffect, useRef, useState } from "react";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { rounds } from "../services/misc.services";
import "../App.css";
import DoneIcon from "@mui/icons-material/Done";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { axiosAuthRequest, capacitorHTTPClient } from "../services/api.service";
import { Toast } from "@capacitor/toast";
import { Device } from "@capacitor/device";
import { Refresh } from "@mui/icons-material";

const Menu = ({
  seed,
  isMenuVisible,
  setMenuVisibility,
  menuPage,
  group,
  refreshRounds,
}) => {
  const [type, setType] = useState(menuPage ? "menu" : "edit");
  const [title, setTitle] = useState(false);
  const [winner, setWinner] = useState("");

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedTeams, setSelectedTeams] = useState({
    team1: "",
    team2: "",
  });

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };
  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const formattedDateTime = () => {
    const date = new Date(selectedDate + " " + selectedTime);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };

  const handleWinnerSubmit = async () => {
    const res = capacitorHTTPClient("tournament/update_winner/", {
      method: "post",
      data: { seed_id: seed.id, details: group.id, winner: winner },
    });

    if (res) {
      Toast.show({
        text: "Winner was updated successfully.",
        duration: "long",
      });
      refreshRounds();
    }
  };

  const handleEditFixtureSubmit = async () => {
    let data = seed;
    data.date = formattedDateTime();
    data.teams[0].name = selectedTeams.team1;
    data.teams[1].name = selectedTeams.team2;

    const res = await capacitorHTTPClient("tournament/update_seed/", {
      method: "post",
      data: { seed_id: seed.id, details: group.id, updated_fixture: data },
    });

    if (res) {
      Toast.show({
        text: "Fixture was updated.",
        duration: "long",
      });
      refreshRounds();
    }
  };

  useEffect(() => {
    if (!isMenuVisible) {
      setType("menu");
      setTitle(false);
    }
  }, [isMenuVisible]);

  return (
    <div
      className={`w-full flex z-40 items-center flex-col ${isMenuVisible ? "" : "hidden"
        } bg-white absolute rounded-t-3xl bottom-0 py-4`}
    >
      <div className="ruler w-12 h-1 bg-gray-400 rounded-xl mb-3"></div>
      {seed ? (
        <h1 className="font-bold text-lg">
          {!title
            ? `${seed?.teams[0]?.name} v/s ${seed?.teams[1]?.name}`
            : title}
        </h1>
      ) : null}

      <div className="w-full content mt-4">
        {menuPage && type === "menu" ? (
          <div>
            <button
              className="w-full py-4 px-4 border"
              onClick={() => {
                setType("edit");
                setTitle("Edit Fixture");
              }}
            >
              Edit Fixture
            </button>
            <button
              className="w-full py-4 px-4 border"
              onClick={() => {
                setType("complete");
                setTitle("Mark as Complete");
              }}
            >
              Mark as Completed
            </button>
            <button
              className="w-full py-4 px-4 border"
              onClick={() => {
                setMenuVisibility(false);
                setType("menu");
                setTitle(false);
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {type === "complete" ? (
              <div className="px-4">
                <span className="font-bold">Please select a Winner!</span>
                <div className="teams">
                  {/* Idhar pe figma mai jaisa aa rha hai na tick, like select hoke kaisa dikh rha hai woh kardo and usko state mai daldo mai backend mardega */}
                  {seed?.teams.map((team, idx) => (
                    <div
                      key={idx}
                      onClick={() => setWinner(team.name)}
                      className={`w-full p-2 my-4 cursor-pointer flex justify-between ${winner === team.name
                        ? "border-2 bg-gray-200 font-semibold text-[#50A5AF] border-[#50A5AF] rounded-xl"
                        : "bg-gray-200 border-2 rounded-xl"
                        }`}
                    >
                      {team.name}
                      {winner === team.name && (
                        <DoneIcon className="mr-2 text-[#50A5AF]" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="actions flex items-center justify-center">
                  <button
                    className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                    onClick={() => {
                      setType("menu");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                    onClick={() => {
                      handleWinnerSubmit();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4">
                {/* Idhar Yup ka form daldo jaisa apko image bheja hai waisa and uska jo bhi submit hoke values aayeag toh func mai console log karado mai backend mardega */}
                <div className="form">
                  <select
                    className="bg-gray-200 w-full p-2 my-4 rounded-xl cursor-pointer"
                    onChange={() =>
                      setSelectedTeams({
                        ...selectedTeams,
                        team1: event.target.value,
                      })
                    }
                  >
                    {group?.participatingTeams
                      ?.map((item) => item.name)
                      .map((teams, idx) => (
                        <option value={teams} key={idx}>
                          {teams}
                        </option>
                      ))}
                  </select>
                  <h4 className="flex justify-center items-center font-bold">
                    VS
                  </h4>
                  <select
                    className="bg-gray-200 w-full p-2 my-4 rounded-xl cursor-pointer"
                    onChange={() =>
                      setSelectedTeams({
                        ...selectedTeams,
                        team2: event.target.value,
                      })
                    }
                  >
                    {group?.participatingTeams
                      ?.map((item) => item.name)
                      .map((teams, idx) => (
                        <option value={teams} key={idx}>
                          {teams}
                        </option>
                      ))}
                  </select>
                  <div className="flex ">
                    <div className="bg-gray-200 w-full p-3 rounded-xl cursor-pointer my-2 mr-1">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      />
                    </div>
                    <div className="bg-gray-200 w-full p-3 rounded-xl cursor-pointer my-2 ml-1 flex items-center">
                      <AccessTimeIcon />
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="actions flex items-center justify-center">
                  <button
                    className="bg-white text-orange-500 border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                    onClick={() => {
                      setType("menu");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                    onClick={handleEditFixtureSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const CustomSeed = ({
  seed,
  breakpoint,
  roundIndex,
  seedIndex,
  toggleMenu,
}) => {
  // breakpoint passed to Bracket component
  // to check if mobile view is triggered or not

  // mobileBreakpoint is required to be passed down to a seed

  const handleFixtureEdit = (seed) => {
    if (!seed.hasBye) {
      toggleMenu(seed);
    }
  };

  return (
    <Seed
      mobileBreakpoint={breakpoint}
      style={{ fontSize: "18px", cursor: "pointer" }}
    >
      <SeedItem
        style={{
          background: "#E0FFF8",
          boxShadow: "none",
          border: `2px solid #50A5AF`,
          borderRadius: ".75rem",
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // width: "fit-content",
          paddingInline: "3rem",
        }}
        onClick={() => handleFixtureEdit(seed)}
      >
        <div style={{ width: "100%" }}>
          <SeedTeam
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <span
              className={`${seed.winner === seed.teams[0].name && !seed.hasBye
                ? "font-bold"
                : ""
                }`}
            >
              {seed.teams[0].name ? seed.teams[0].name : <strong>BYE</strong>}
            </span>
          </SeedTeam>

          <SeedTeam
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <span
              className={`${seed.winner === seed.teams[1].name && !seed.hasBye
                ? "font-bold"
                : ""
                }`}
            >
              {seed.teams[1].name ? seed.teams[1].name : <strong>BYE</strong>}
            </span>
          </SeedTeam>

          <div>
            <span className="text-sm">{seed.date}</span>
          </div>
        </div>
      </SeedItem>
    </Seed>
  );
};

const RenderFixtures = ({ isHost, groupDetails, fixtureData, refreshRounds }) => {

  const [seed, setSeed] = useState(false);
  const [rounds, setRounds] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [isHandset, setisHandset] = useState();

  const handleTabIndexChange = (index) => () => setTabIndex(index);

  const handleSwipeChange = (index) => setTabIndex(index);

  const isMobile = async () => {
    const info = await Device.getInfo();
    setisHandset(
      info.platform === "android" ||
      info.platform === "ios" ||
      (info.platform === "web" && window.innerWidth < 995)
    );
  };

  const regenerateFixtures = async () => {
    const res = await capacitorHTTPClient(
      `tourney_details/${groupDetails?.id}/regenerate_fixtures/`,
      {
        method: "post",
      }
    );

    if (res) {
      setRounds(res.data.fixtures);
      setFixtureData(res.data)
    }
  }

  const toggleMenu = (seed) => {
    if (isHost) {
      setSeed(seed);
      setMenuVisibility(!isMenuVisible);
    }
  };

  useEffect(() => {
    setRounds(fixtureData?.fixtures)
    setTabIndex(0)
    setMenuVisibility(false)
  }, [fixtureData])

  useEffect(() => {
    isMobile();

    document.addEventListener("click", () => {
      if (isMenuVisible) {
        setMenuVisibility(!isMenuVisible);
      }
    });
  }, [])

  return (
    <div className="main-fixtures-component relative mt-4">
      {isHost && (
        <button className="absolute z-[99] bottom-10 right-10 flex items-center justify-center text-white w-[4rem] h-[4rem] bg-orange-500 rounded-full" onClick={regenerateFixtures}>
          <Refresh />
        </button>
      )}
      <div
        className={`absolute w-full h-full bg-black opacity-50 pointer-events-none z-20 ${isMenuVisible ? "" : "hidden"
          }`}
      ></div>
      <div className="h-screen overflow-x-auto py-8 flex">
        {rounds?.length > 0 || rounds?.seeds?.length > 0 ? (
          <div className="App flex justify-center items-center flex-col w-full">
            {isHandset ? (
              <div className="tabs">
                {Array.from({ length: rounds.length }).map((_, index) => (
                  <button
                    className="mx-4 border border-black p-2 mb-10"
                    onClick={handleTabIndexChange(index)}
                  >
                    Round {index + 1}
                  </button>
                ))}
              </div>
            ) : null}
            <Bracket
              rounds={rounds ? rounds : groupDetails?.fixtures}
              renderSeedComponent={(props) => (
                <CustomSeed {...props} toggleMenu={toggleMenu} />
              )}
              bracketClassName="max-w-[25rem]"
              swipeableProps={{
                enableMouseEvents: true,
                animateHeight: true,
                index: tabIndex,
                onChangeIndex: handleSwipeChange,
              }}
            />
          </div>
        ) : (
          <h1 className="p-4 text-center">No Fixtures Available.</h1>
        )}
      </div>
      {/* Animated Menu Component */}
      <Menu
        seed={seed}
        isMenuVisible={isMenuVisible}
        setMenuVisibility={setMenuVisibility}
        menuPage={true}
        group={groupDetails}
        refreshRounds={refreshRounds}
      />
    </div>
  )
}

const FixturesComponent = ({ groupDetails, isHost }) => {

  const [fixtureData, setFixtureData] = useState([])

  const refreshRounds = async () => {
    const res = await capacitorHTTPClient(
      `tourney_details/${groupDetails?.id}/`,
      {
        method: "get",
      }
    );

    if (res) {
      setFixtureData(res.data)
    }
  };

  const setFixtureState = async (by_pitstop) => {
    const res = await axiosAuthRequest(`tourney_details/${fixtureData?.id}/`, {
      method: "PATCH",
      data: {
        fixtures_by_pitstop: by_pitstop
      }
    }, false);

    if (res.status === 200) {
      refreshRounds()
      Toast.show({
        text: "Fixtures are now updated.",
        duration: "long",
      });
    }
  }

  useEffect(() => {
    refreshRounds();
  }, [groupDetails]);

  return (
    <div className="root-container relative">

      {/* 
        agar default hai and host hai -> toh change kar sakta hai (default)
        agar default hai and host ni hai || agar false hai toh -> contact host for fixtures 
        agar true hai toh -> fixtures dikhao
      */}

      {isHost ? (
        <>
          {fixtureData?.fixtures_by_pitstop === 0 ? (
            <div className="px-5">
              <button
                type="button"
                className="my-4 bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                onClick={() => setFixtureState(1)}
              >
                Generate Fixtures using PITSTOP
              </button>
              <button
                className="bg-orange-500 text-white border-orange-500 border-2 m-1 flex p-3 rounded-lg font-semibold w-full justify-center"
                onClick={() => setFixtureState(2)}
              >
                Generate your own Fixtures
              </button>
            </div>
          ) : fixtureData?.fixtures_by_pitstop === 1 ? (
            <RenderFixtures
              refreshRounds={refreshRounds}
              isHost={isHost}
              groupDetails={groupDetails}
              fixtureData={fixtureData}
            />
          ) : (<h1 className="p-5 text-center">You are handling the fixtures for this tournament manually.</h1>)}
        </>
      ) : (
        <>
          {fixtureData?.fixtures_by_pitstop === 1 ? (
            <RenderFixtures
              refreshRounds={refreshRounds}
              isHost={isHost}
              groupDetails={groupDetails}
              fixtureData={fixtureData}
            />
          ) : (<h1 className="p-5 text-cener">Contact Host for the fixtures.</h1>)}
        </>
      )}
    </div>
  );
};

export default FixturesComponent;
