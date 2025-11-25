"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { BookAppointmentForm } from "./_components/book-appointment-form";

export default function BookAppointmentPage() {
  return (
    <RoleGuard allowedRoles={["admin", "guest"]}>
      <BookAppointmentForm />
    </RoleGuard>
  );
}
