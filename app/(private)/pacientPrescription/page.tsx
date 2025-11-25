import { ListPrescription } from "./_components/list-prescription";

// Force dynamic rendering for real-time prescription data (critical medical data)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const pacientPrescription = () => {
  return (
    <div className="w-full min-h-screen">
      <h1 className="mt-10 text-4xl font-bold">Atestados</h1>
      <ListPrescription id="" content="" name="" />;
    </div>
  );
};

export default pacientPrescription;
