"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { MyPrescriptionsList } from "./_components/my-prescriptions-list";

export default function MyPrescriptionsPage() {
  return (
    <RoleGuard allowedRoles={["admin", "guest"]}>
      <MyPrescriptionsList />
    </RoleGuard>
  );
}
