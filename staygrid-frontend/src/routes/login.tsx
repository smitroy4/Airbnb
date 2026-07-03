import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api";

export const Route = createFileRoute("/login")({
  ssr: false,
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (v: z.infer<typeof schema>) => {
    try {
      const { roles } = await auth.login(v.email, v.password);
      toast.success("Welcome back!");
      if (roles.includes("HOTEL_MANAGER") || roles.includes("ADMIN")) {
        navigate({ to: "/manager" });
      } else {
        navigate({ to: "/" });
      }
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold">Log in to StayGrid</h1>
            <p className="mt-1 text-sm text-muted-foreground">Access your bookings and manage your stays.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" {...register("email")} />
                {formState.errors.email && <p className="text-xs text-destructive mt-1">{formState.errors.email.message}</p>}
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" {...register("password")} />
                {formState.errors.password && <p className="text-xs text-destructive mt-1">{formState.errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Signing in..." : "Log in"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              New to StayGrid? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
