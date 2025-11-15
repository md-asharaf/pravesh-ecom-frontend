import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/providers/auth";
import { authService } from "@/services/auth.service";
import { loginSchema } from "@/types/auth";

type LoginForm = { phoneOrEmail: string; password?: string };

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [method, setMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phoneOrEmail: "", password: "" },
  });

  const pwdLogin = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await authService.login({ phoneOrEmail: data.phoneOrEmail, password: data.password! });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Logged in");
      login(data);
      navigate("/");
    },
    onError: () => toast.error("Login failed"),
  });

  const sendOtp = useMutation({
    mutationFn: async (phoneOrEmail: string) => {
      const res = await authService.requestForOtp(phoneOrEmail);
      return res?.data;
    },
    onSuccess: () => {
      toast.success("OTP sent");
      setOtpSent(true);
    },
    onError: () => toast.error("Failed to send OTP"),
  });

  const verifyOtp = useMutation({
    mutationFn: async ({ phoneOrEmail, otp }: { phoneOrEmail: string; otp: string }) => {
      const res = await authService.loginViaOtp(phoneOrEmail, otp);
      return res?.data;
    },
    onSuccess: (data) => {
      toast.success("Logged in via OTP");
      login(data);
      navigate("/");
    },
    onError: () => toast.error("OTP verification failed"),
  });

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">Use password or OTP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button variant={method === "password" ? "secondary" : "ghost"} onClick={() => setMethod("password")}>Password</Button>
            <Button variant={method === "otp" ? "secondary" : "ghost"} onClick={() => setMethod("otp")}>OTP</Button>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((vals) => {
                if (method === "password") {
                  pwdLogin.mutate(vals);
                } else {
                  sendOtp.mutate(vals.phoneOrEmail);
                }
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="phoneOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone or Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone or email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {method === "password" && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full" disabled={pwdLogin.isPending || sendOtp.isPending}>
                {method === "password" ? (pwdLogin.isPending ? "Logging in..." : "Login") : (sendOtp.isPending ? "Sending OTP..." : "Send OTP")}
              </Button>
            </form>
          </Form>

          {method === "otp" && otpSent && (
            <div className="mt-4 space-y-2">
              <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => verifyOtp.mutate({ phoneOrEmail: form.getValues("phoneOrEmail"), otp })}>
                  {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button variant="outline" onClick={() => sendOtp.mutate(form.getValues("phoneOrEmail"))}>Resend</Button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center text-sm">
            <Link to="/register" className="text-primary">Create account</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
