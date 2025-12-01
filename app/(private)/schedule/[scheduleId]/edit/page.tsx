"use client";

import { getSchedule } from "@/actions/get-schedule";
import { useAction } from "@/hooks/use-action";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EditScheduleForm } from "./_components/edit-schedule-form";
import { toast } from "sonner";

export default function EditSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { execute } = useAction(getSchedule, {
    onSuccess: (data) => {
      if (data) {
        setScheduleData(data);
      } else {
        toast.error("Agendamento não encontrado");
        router.push("/schedules");
      }
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error);
      router.push("/schedules");
    },
  });

  useEffect(() => {
    if (params.scheduleId) {
      execute({ id: params.scheduleId as string });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.scheduleId]);

  if (isLoading) {
    return <LoadingSpinner text="Carregando agendamento..." />;
  }

  if (!scheduleData) {
    return null;
  }

  return <EditScheduleForm initialData={scheduleData} />;
}
