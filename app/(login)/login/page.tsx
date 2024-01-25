import { useState } from "react";
import { LoginModal } from "./_components/login_modal";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center flex-grow">
      <LoginModal />
    </div>
  );
};

export default LoginPage;
