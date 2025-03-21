import { GuessNumber } from "./_components/guess-number";
import { SnakeGamilis } from "./_components/snake_gamilis";

const SnakeGmae = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <SnakeGamilis width={400} height={400} />
      <GuessNumber />
    </div>
  );
};

export default SnakeGmae;
