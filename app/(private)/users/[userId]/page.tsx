"use client";
import { getCurrentUser } from "@/actions/get-user";
import { useAction } from "@/hooks/use-action";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserInfo } from "./_components/user-info";

const UserIdPage = () => {
  return (
    <div>
      <UserInfo />
    </div>
  );
};

export default UserIdPage;
