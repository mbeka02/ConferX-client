import Navbar from "../../components/ui/Navbar";
import Controls from "../../components/ui/Controls";
import { AnimatePresence } from "framer-motion";
import Modal from "../../components/ui/Modal";
import RoomForm from "./RoomForm";
import { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => setModalOpen(false);

  const handleOpen = () => setModalOpen(true);
  return (
    <div className="font-nunito     relative">
      <Navbar />
      <div className="mx-4  mt-24     grid  md:mx-10">
        <Controls handleOpen={handleOpen} />
        <Link
          to="/room"
          className="text-white font-semibold flex justify-center items-center px-4 py-2 w-44 h-12 bg-blue-custom rounded-md"
        >
          go to room
        </Link>
      </div>
      <AnimatePresence mode="wait">
        {modalOpen && (
          <Modal handleClose={handleClose}>
            <RoomForm />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
