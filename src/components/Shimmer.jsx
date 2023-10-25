import MoonLoader from "react-spinners/MoonLoader";

const Shimmer = () => {
  return (
    <div className=" p-6 min-h-screen flex justify-center items-center">
      <MoonLoader size={120} color={"orange"} speedMultiplier={0.5} />
    </div>
  );
};

export default Shimmer;
