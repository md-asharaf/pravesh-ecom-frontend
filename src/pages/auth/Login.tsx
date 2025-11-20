import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import { loginSchema } from "@/types/auth";
import { useAuth } from "@/providers/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type LoginForm = { phoneOrEmail: string; password?: string };

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<"enter" | "password" | "otp">("enter");
  const [otp, setOtp] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phoneOrEmail: "", password: "" },
  });

  const pwdLogin = useMutation({
    mutationFn: async (vals: LoginForm) => {
      const res = await authService.login({
        phoneOrEmail: vals.phoneOrEmail,
        password: vals.password!,
      });
      return res;
    },
    onSuccess: ({ data, message }) => {
      toast.success(message ?? "Logged in");
      login(data.user);
      navigate("/");
    },
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Invalid credentials"),
  });

  const sendOtp = useMutation({
    mutationFn: async (phoneOrEmail: string) => {
      const res = await authService.requestForOtp(phoneOrEmail);
      return res;
    },
    onSuccess: ({ message }) => {
      toast.success(message ?? "OTP sent");
      setStep("otp");
    },
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Failed to send OTP"),
  });

  const verifyOtp = useMutation({
    mutationFn: async ({ phoneOrEmail, otp }: { phoneOrEmail: string; otp: string }) => {
      const res = await authService.loginViaOtp(phoneOrEmail, otp);
      return res;
    },
    onSuccess: ({ data, message }) => {
      toast.success(message ?? "Logged in");
      login(data.user);
      navigate("/");
    },
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Invalid OTP"),
  });

  const phoneOrEmailValue = form.watch("phoneOrEmail");
  const isLoading = pwdLogin.isPending || sendOtp.isPending || verifyOtp.isPending;
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Login to continue
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-neutral-800 border border-border shadow-xl rounded-2xl p-6 space-y-6">

          {/* STEP 1 — ENTER PHONE/EMAIL */}
          {step === "enter" && (
            <>
              <Form {...form}>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="phoneOrEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone or Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your phone or email"
                            className="h-11 text-sm rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              {/* CONTINUE BUTTONS */}
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full h-11 rounded-xl"
                  disabled={!phoneOrEmailValue}
                  onClick={() => setStep("password")}
                >
                  Continue with Password
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl"
                  disabled={!phoneOrEmailValue}
                  onClick={() => sendOtp.mutate(phoneOrEmailValue)}
                >
                  Continue with OTP
                </Button>
              </div>
            </>
          )}

          {/* STEP 2 — PASSWORD LOGIN */}
          {step === "password" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((vals) => pwdLogin.mutate(vals))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="phoneOrEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone or Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="h-11 rounded-xl" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          placeholder="Enter your password"
                          className="h-11 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full h-11 rounded-xl"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("enter")}
                  className="text-sm text-primary w-full text-center mt-2"
                >
                  Use another method
                </button>
              </form>
            </Form>
          )}

          {/* STEP 3 — OTP LOGIN */}
          {step === "otp" && (
            <div className="space-y-4">
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="h-11 rounded-xl"
              />

              <Button
                className="w-full h-11 rounded-xl"
                onClick={() =>
                  verifyOtp.mutate({
                    phoneOrEmail: phoneOrEmailValue,
                    otp,
                  })
                }
                disabled={verifyOtp.isPending}
              >
                {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                variant="outline"
                className="w-full h-11 rounded-xl"
                onClick={() => sendOtp.mutate(phoneOrEmailValue)}
              >
                Resend OTP
              </Button>

              <button
                type="button"
                onClick={() => setStep("enter")}
                className="text-sm text-primary w-full text-center"
              >
                Use another method
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm mt-6">
          <span className="text-muted-foreground">New user? </span>
          <Link to="/register" className="text-primary font-medium">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
