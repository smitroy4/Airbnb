import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints, getApiErrorMessage } from "@/lib/api";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/account/profile")({
  component: ProfilePage,
});

const schema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHERS"]).optional(),
});
type FormValues = z.infer<typeof schema>;

function ProfilePage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["profile"], queryFn: endpoints.getProfile });
  const { register, control, reset, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", dateOfBirth: "", gender: undefined },
  });

  useEffect(() => {
    if (q.data) reset({ name: q.data.name || "", dateOfBirth: q.data.dateOfBirth || "", gender: q.data.gender });
  }, [q.data, reset]);

  const mut = useMutation({
    mutationFn: (v: FormValues) => endpoints.updateProfile(v),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (q.isLoading) return <LoadingState />;
  if (q.isError) return <ErrorState message={getApiErrorMessage(q.error)} onRetry={() => q.refetch()} />;

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit((v) => mut.mutate(v))} className="grid gap-4 max-w-md">
          <div><Label>Email</Label><Input value={q.data?.email ?? ""} disabled /></div>
          <div><Label>Full name</Label><Input {...register("name")} />
            {formState.errors.name && <p className="text-xs text-destructive mt-1">{formState.errors.name.message}</p>}
          </div>
          <div><Label>Date of birth</Label><Input type="date" {...register("dateOfBirth")} /></div>
          <div>
            <Label>Gender</Label>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHERS">Others</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Button type="submit" disabled={mut.isPending}>{mut.isPending ? "Saving..." : "Save changes"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
