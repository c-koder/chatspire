export const pageLoadVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: {
    transition: { ease: "easeIn" },
  },
};

export const pageLoadVariants2 = {
  hidden: {
    opacity: 0,
    top: "50%",
    left: "40%",
    transform: "translate(-50%, -50%)",
  },
  visible: {
    opacity: 1,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: { duration: 0.5 },
  },
  exit: {
    transition: { ease: "easeIn" },
  },
};
