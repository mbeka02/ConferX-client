import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

const Backdrop = ({ children }: Props) => {
  return (
    <motion.div
      className="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
