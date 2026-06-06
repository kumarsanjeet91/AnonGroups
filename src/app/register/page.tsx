import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center"><LoadingSpinner /></main>}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
