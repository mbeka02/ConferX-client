import Navbar from "../../components/ui/Navbar";
import Controls from "../../components/ui/Controls";
import { AnimatePresence } from "framer-motion";
import Modal from "../../components/ui/Modal";
import RoomForm from "./RoomForm";
import { useState } from "react";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => setModalOpen(false);

  const handleOpen = () => setModalOpen(true);
  return (
    <div className="font-nunito     relative">
      <Navbar />
      <div className="mx-4  mt-24     grid  md:mx-10">
        <Controls handleOpen={handleOpen} />
      </div>
      <AnimatePresence mode="wait">
        {modalOpen && (
          <Modal children={<RoomForm />} handleClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
