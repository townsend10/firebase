import { GuessNumber } from "./_components/guess-number";
import { SnakeGamilis } from "./_components/snake_gamilis";

const SnakeGmae = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <SnakeGamilis />
      {/* <GuessNumber /> */}
    </div>
  );
};

export default SnakeGmae;
