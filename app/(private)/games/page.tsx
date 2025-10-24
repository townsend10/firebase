import { ChatGpt } from "./_components/chat-gpt";
import { RegisterPage } from "./_components/snake-game";

const GamePage = () => {
  return (
    <div className="flex w-full">
      <RegisterPage />
      {/* <ChatGpt /> */}
    </div>
  );
};

export default GamePage;
