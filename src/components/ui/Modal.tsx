import { motion } from "framer-motion";
import Backdrop from "./Backdrop";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 35,
      stiffness: 300,
    },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
  },
};
type Props = {
  children: React.ReactNode;
  handleClose: () => void;
};
const Modal = ({ children, handleClose }: Props) => {
  return (
    <Backdrop>
      <motion.div
        onClick={(e) => e.stopPropagation}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="  m-auto grid h-3/4 w-4/5  rounded bg-white  p-6 lg:h-xxl   lg:w-1/2"
      >
        <button
          className="absolute right-4 top-1 h-4 w-4 items-center"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            className="hover:fill-red-custom"
          >
            <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
          </svg>
        </button>
        {children}
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
