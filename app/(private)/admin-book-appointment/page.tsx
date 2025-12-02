import { AdminBookingForm } from "./_components/admin-booking-form";

export default function AdminBookAppointmentPage() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Novo Agendamento</h2>
      </div>
      <AdminBookingForm />
    </div>
  );
}
