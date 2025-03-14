import { auth } from "@/app/api/firebase/firebase-connect";
import { HomePrivate } from "./_components/home-private";

const PrivateHomePage = async () => {
  return (
    <div className="flex flex-grow">
      <HomePrivate />
    </div>
  );
};

export default PrivateHomePage;
