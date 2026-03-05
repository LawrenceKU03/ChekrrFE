import { FaHeart } from "react-icons/fa";
import { FaBitcoin } from "react-icons/fa";

const index = () => {
  return (
    <div className="bg-indigo-500 py-10 absolute bottom-0 w-full flex flex-row items-center justify-center">
      <p className="mx-auto text-white flex flex-row items-center">
        Made with <FaHeart className="mx-2" /> by{" "}
        <b className="ml-2">Ghost@BUIDLBATTLE2</b>
        <FaBitcoin className="ml-2" />
      </p>
    </div>
  );
};

export default index;
