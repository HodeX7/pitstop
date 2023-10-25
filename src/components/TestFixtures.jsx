import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";

const CustomSeed = ({ seed, breakpoint, roundIndex, seedIndex }) => {
  // breakpoint passed to Bracket component
  // to check if mobile view is triggered or not

  // mobileBreakpoint is required to be passed down to a seed
  const [index, setIndex] = useState(null);
  const handleFixtureEdit = (seed) => {
    console.log(seed);
    setIndex(seed.id);
  };

  return (
    <>
      <Seed
        mobileBreakpoint={breakpoint}
        style={{ fontSize: "18px" }}
        onClick={() => {
          handleFixtureEdit(seed);
        }}
      >
        <SeedItem
          style={{
            background: "#E0FFF8",
            boxShadow: "none",
            border: "2px solid #50A5AF",
            borderRadius: ".75rem",
            color: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%" }} className="cursor-pointer">
            <SeedTeam
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <span>{seed.teams[0]?.name}</span>
              <span>{seed.score != 0 ? seed.score : ""}</span>
            </SeedTeam>

            <SeedTeam
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <span>{seed.teams[1]?.name}</span>
              <span>{seed.score != 0 ? seed.score : ""}</span>
            </SeedTeam>

            <div>
              {seed.teams[1]?.name ? (
                <>
                  {" "}
                  <span className="text-sm">June 23</span>{" "}
                  <span className="text-sm">3:30 PM</span>{" "}
                </>
              ) : (
                <span className="text-sm">BYE.</span>
              )}
            </div>
          </div>
        </SeedItem>
      </Seed>
      {/* {index !== null ? <Modal team={seed} /> : <></>} */}
    </>
  );
};

const TestFixture = ({ rounds }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabIndexChange = (index) => () => {
    setTabIndex(index);
  };

  const handleSwipeChange = (index) => {
    setTabIndex(index);
  };

  return (
    <div className="h-screen overflow-x-auto py-8 flex">
      {console.log(rounds)}
      {rounds?.length > 0 || rounds?.seeds?.length > 0 ? (
        <div className="App">
          <div className="tabs">
            <button onClick={handleTabIndexChange(0)}>1</button>
            <button onClick={handleTabIndexChange(1)}>2</button>
            <button onClick={handleTabIndexChange(2)}>3</button>
            <button onClick={handleTabIndexChange(3)}>4</button>
          </div>
          <Bracket 
            rounds={rounds} 
            renderSeedComponent={CustomSeed}
            swipeableProps={{
              enableMouseEvents: true,
              animateHeight: true,
              index
            }} />
        </div>
      ) : (
        <h1>No Fixtures Available.</h1>
      )}
    </div>
  );
};

export default TestFixture;
