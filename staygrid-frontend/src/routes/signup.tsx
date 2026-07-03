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

export const Route = createFileRoute("/signup")({
  ssr: false,
  component: SignupPage,
});

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "At least 6 characters"),
});

function SignupPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (v: z.infer<typeof schema>) => {
    try {
      await auth.signup(v.email, v.password, v.name);
      toast.success("Account created — please log in");
      navigate({ to: "/login" });
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign up to book and manage your stays.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div><Label>Full name</Label><Input {...register("name")} />{formState.errors.name && <p className="text-xs text-destructive mt-1">{formState.errors.name.message}</p>}</div>
              <div><Label>Email</Label><Input type="email" {...register("email")} />{formState.errors.email && <p className="text-xs text-destructive mt-1">{formState.errors.email.message}</p>}</div>
              <div><Label>Password</Label><Input type="password" {...register("password")} />{formState.errors.password && <p className="text-xs text-destructive mt-1">{formState.errors.password.message}</p>}</div>
              <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Creating account..." : "Sign up"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
