"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { MyAppointmentsList } from "./_components/my-appointments-list";

export default function MyAppointmentsPage() {
  return (
    <RoleGuard allowedRoles={["admin", "guest"]}>
      <MyAppointmentsList />
    </RoleGuard>
  );
}
