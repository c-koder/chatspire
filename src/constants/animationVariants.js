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

// export const chatLoadVariants = {
//   hidden: {
//     opacity: 0.5,
//     x: "-5px",
//   },
//   visible: {
//     opacity: 1,
//     x: "0px",
//     transition: { duration: 0.2 },
//   },
//   exit: {
//     transition: { ease: "easeIn" },
//   },
// };
