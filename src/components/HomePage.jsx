import React, { useState } from "react";
import data from "../assets/dummyTourneyData.json";
import TournamentCard from "./TournamentCard";
import "../styles/Home.css";

const HomePage = () => {
    const [selected, setSelected] = useState(null);
    const handleDivClick = (index) => {
        setSelected(index);
    };
    return (
        <>
            <div className="overflow-x-auto whitespace-nowrap flex hide-scrollbar ">
                <div
                    className={`mr-2 ${selected === 1
                            ? "bg-orange-500 text-white border-2 border-orange-500"
                            : "bg-white text-orange-500 border-2 border-orange-500"
                        } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
                    onClick={() => handleDivClick(1)}
                >
                    All
                </div>
                <div
                    className={`mr-2 ${selected === 2
                            ? "bg-orange-500 text-white border-2 border-orange-500"
                            : "bg-white text-orange-500 border-2 border-orange-500"
                        } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
                    onClick={() => handleDivClick(2)}
                >
                    Football
                </div>
                <div
                    className={`mr-2 ${selected === 3
                            ? "bg-orange-500 text-white border-2 border-orange-500"
                            : "bg-white text-orange-500 border-2 border-orange-500"
                        } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
                    onClick={() => handleDivClick(3)}
                >
                    Cricket
                </div>
                <div
                    className={`mr-2 ${selected === 4
                            ? "bg-orange-500 text-white border-2 border-orange-500"
                            : "bg-white text-orange-500 border-2 border-orange-500"
                        } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
                    onClick={() => handleDivClick(4)}
                >
                    Volleyball
                </div>
                <div
                    className={`mr-2 ${selected === 5
                            ? "bg-orange-500 text-white border-2 border-orange-500"
                            : "bg-white text-orange-500 border-2 border-orange-500"
                        } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
                    onClick={() => handleDivClick(5)}
                >
                    Basketball
                </div>
                <div
                    className={`mr-2 ${selected === 6
                            ? "bg-orange-500 text-white border-2 border-orange-500"
                            : "bg-white text-orange-500 border-2 border-orange-500"
                        } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
                    onClick={() => handleDivClick(6)}
                >
                    Skating
                </div>
                <div
                    className={`mr-2 ${selected === 7
                            ? "bg-orange-500 text-white border-2 border-orange-500"
                            : "bg-white text-orange-500 border-2 border-orange-500"
                        } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
                    onClick={() => handleDivClick(7)}
                >
                    Snooker
                </div>
                <div
                    className={`mr-2 ${selected === 8
                            ? "bg-orange-500 text-white border-2 border-orange-500"
                            : "bg-white text-orange-500 border-2 border-orange-500"
                        } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
                    onClick={() => handleDivClick(8)}
                >
                    Table Tennis
                </div>
                <div
                    className={`mr-2 ${selected === 9
                            ? "bg-orange-500 text-white border-2 border-orange-500"
                            : "bg-white text-orange-500 border-2 border-orange-500"
                        } flex rounded-full p-2 w-full justify-center cursor-pointer mr-4`}
                    onClick={() => handleDivClick(9)}
                >
                    Swimming
                </div>
            </div>
            <div className="mt-2 overflow-y-scroll h-full hide-scrollbar">
                <h1>Nothing to show currently</h1>
                {/* {data.tournaments.map((tournament, item) => (
                    <TournamentCard key={item} tournament={tournament} />
                ))} */}
            </div>
        </>
    );
};

export default HomePage;