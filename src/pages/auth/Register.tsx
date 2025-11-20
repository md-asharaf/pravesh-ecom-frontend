import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import { Register, registerSchema } from "@/types/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/providers/auth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth()

  const [step, setStep] = useState<"form" | "otp">("form");
  const [pendingData, setPendingData] = useState<Register | null>(null);

  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  const otp = otpDigits.join("");

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newArr = [...otpDigits];
    newArr[index] = value;
    setOtpDigits(newArr);

    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  useEffect(() => {
    if (step !== "otp") return;

    if (timer === 0) {
      setIsResendEnabled(true);
      return;
    }

    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  const resetOtpTimer = () => {
    setTimer(60);
    setIsResendEnabled(false);
    setOtpDigits(["", "", "", "", "", ""]);
    otpRefs[0].current?.focus();
  };

  const form = useForm<Register>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  const register = useMutation({
    mutationFn: async (data: Register) => {
      const res = await authService.register(data);
      return res;
    },
    onSuccess: ({ message }) => {
      toast.success(message || "OTP sent!");
      setStep("otp");
      resetOtpTimer();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    },
  });

  const sendOtp = useMutation({
    mutationFn: async (data: { phone: string; email?: string }) => {
      const res = await authService.requestForOtp(data.phone || data.email);
      return res;
    },
    onSuccess: ({ message }) => {
      toast.success(message || "OTP sent!");
      setStep("otp");
      resetOtpTimer();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async ({ values, otp }: { values: Register; otp: string }) => {
      const res = await authService.loginViaOtp(values.phone || values.email, otp);
      return res;
    },
    onSuccess: ({ message, data }) => {
      toast.success("Account created successfully!");
      login(data.user);
      navigate("/login");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err.message || "Invalid OTP");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground">Register using mobile OTP</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-800 border border-border rounded-2xl shadow-xl p-6 overflow-hidden">

          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((values) => {
                      setPendingData(values);
                      register.mutate(values);
                    })}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl" placeholder="Your full name" />
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
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl" placeholder="Email address" />
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 rounded-xl" placeholder="10-digit number" />
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
                          <FormLabel>Create Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="h-12 rounded-xl" placeholder="At least 6 characters" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full h-12 rounded-xl" disabled={register.isPending}>
                      {register.isPending ? "Sending OTP..." : "Continue"}
                    </Button>

                    <p className="text-sm text-center">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary font-medium">Login</Link>
                    </p>
                  </form>
                </Form>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <p className="text-sm text-muted-foreground">Enter OTP sent to:</p>
                  <p className="font-medium">{pendingData?.email || pendingData?.phone}</p>
                </div>

                {/* OTP Inputs */}
                <div className="grid grid-cols-6 gap-2">
                  {otpDigits.map((digit, idx) => (
                    <Input
                      key={idx}
                      ref={otpRefs[idx]}
                      value={digit}
                      maxLength={1}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-12 text-center text-lg font-semibold rounded-xl"
                    />
                  ))}
                </div>

                <Button
                  className="w-full h-12 rounded-xl"
                  onClick={() => pendingData && verifyOtp.mutate({ values: pendingData, otp })}
                  disabled={verifyOtp.isPending}
                >
                  {verifyOtp.isPending ? "Verifying..." : "Verify & Create Account"}
                </Button>

                {!isResendEnabled ? (
                  <p className="text-sm text-center text-muted-foreground">
                    Resend OTP in <span className="font-medium">00:{timer.toString().padStart(2, "0")}</span>
                  </p>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl"
                    onClick={() => pendingData && sendOtp.mutate({ phone: pendingData.phone, email: pendingData.email })}
                  >
                    Resend OTP
                  </Button>
                )}

                <p className="text-center text-sm">
                  <button className="text-primary" onClick={() => setStep("form")}>
                    Edit Details
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
