"use client";

import {useState, useTransition} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {Mail, Lock, User, Eye, EyeOff, Loader2} from "lucide-react";
import {signupSchema} from "@/schemas/signupSchema";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  console.log(errors)

  const onSubmit = async (data: SignupFormData) => {

    try {
      startTransition(async () => {
        await authClient.signUp.email({
          email: data.email,
          name: data.fullName,
          password: data.password,
        })
        toast.success("Account created successfully! Please sign in.");
        router.push("/signin");
      })
      reset();
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-secondary/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create account</h1>
          <p className="text-muted-foreground">
            Join us today and start exploring
          </p>
        </div>

        {/* Form Card */}
        <Card className="border border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  <User className="inline w-4 h-4 mr-1.5" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  {...register("fullName")}
                  className="h-10"
                  disabled={isPending}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  <Mail className="inline w-4 h-4 mr-1.5" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="h-10"
                  disabled={isPending}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  <Lock className="inline w-4 h-4 mr-1.5" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="h-10 pr-10"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  <Lock className="inline w-4 h-4 mr-1.5" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className="h-10 pr-10"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isPending}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-10 mt-6"
                disabled={isPending}
              >
                {isPending ? <><Loader2 className={"animate-spin"} /> <span>Signing up</span>
                </> : "Sign up"}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/signin"
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our{" "}
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
