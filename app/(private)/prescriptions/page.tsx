"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { AllPrescriptionsList } from "./_components/all-prescriptions-list";

export default function AllPrescriptionsPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AllPrescriptionsList />
    </RoleGuard>
  );
}
