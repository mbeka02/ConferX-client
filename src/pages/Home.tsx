import Navbar from "../components/Navbar";
import Controls from "../components/Controls";

const Home = () => {
  return (
    <div className="font-nunito     relative">
      <Navbar />
      <div className="mx-4  mt-24     grid  md:mx-10">
        <Controls />
      </div>
    </div>
  );
};

export default Home;
