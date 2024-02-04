import { useState } from "react";
import { LoginModal } from "./_components/login_modal";

const LoginPage = () => {
  return (
    <div className="flex w-full">
      <LoginModal />
    </div>
  );
};

export default LoginPage;
