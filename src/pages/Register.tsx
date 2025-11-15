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
import { registerSchema } from "@/types/auth";
import { authService } from "@/services/auth.service";

type RegisterForm = {
  name: string;
  email?: string;
  phone: string;
  password: string;
  image?: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingData, setPendingData] = useState<RegisterForm | null>(null);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", image: "" },
  });

  const sendOtp = useMutation({
    mutationFn: async (data: { phone: string; email?: string }) => {
      const res = await authService.requestForOtp(data.phone ?? data.email)
      return res?.data;
    },
    onSuccess: () => {
      toast.success("OTP sent for verification");
      setOtpStep(true);
    },
    onError: () => toast.error("Failed to send OTP"),
  });

  const verifyAndLogin = useMutation({
    mutationFn: async ({ values, otp }: { values: RegisterForm; otp: string }) => {
      const res = await authService.loginViaOtp(values.phone ?? values.email, otp);
      return res?.data;
    },
    onSuccess: () => {
      toast.success("Account created. Redirecting to login...");
      navigate("/login");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
          <CardDescription className="text-center">Create an account and verify with OTP</CardDescription>
        </CardHeader>
        <CardContent>
          {!otpStep ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => {
                  setPendingData(values);
                  sendOtp.mutate({ phone: values.phone, email: values.email });
                })}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input type="password" placeholder="Create password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={sendOtp.isPending}>
                  {sendOtp.isPending ? "Sending OTP..." : "Register & Send OTP"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!pendingData) return toast.error("Missing registration data");
                    verifyAndLogin.mutate({ values: pendingData, otp });
                  }}
                  disabled={verifyAndLogin.isPending}
                >
                  {verifyAndLogin.isPending ? "Verifying..." : "Verify & Create Account"}
                </Button>
                <Button variant="outline" onClick={() => pendingData && sendOtp.mutate({ phone: pendingData.phone, email: pendingData.email })}>
                  Resend
                </Button>
              </div>
              <div className="text-sm text-center">
                <Link to="/login" className="text-primary">Back to Login</Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
