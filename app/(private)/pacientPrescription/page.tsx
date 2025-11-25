"use client";
import { ListPrescription } from "./_components/list-prescription";

// Static generation with 1 week cache (604800 seconds)
export const revalidate = 604800;

const PacientPrescriptionPage = () => {
  return (
    <div className="w-full min-h-screen">
      <h1 className="mt-10 text-4xl font-bold">Atestados</h1>
      <ListPrescription id="" content="" name="" />
    </div>
  );
};

export default PacientPrescriptionPage;
