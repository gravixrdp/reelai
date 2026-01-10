"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/ui/loading";

export default function CallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CallbackContent />
    </Suspense>
  );
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (errorParam) {
        setError(`Error: ${errorParam} - ${errorDescription || "Unknown error"}`);
        setTimeout(() => {
          router.push("/settings/social-accounts?success=false");
        }, 3000);
        return;
      }

      if (!code) {
        setError("No authorization code received");
        setTimeout(() => {
          router.push("/settings/social-accounts?success=false");
        }, 3000);
        return;
      }

      try {
        // Call backend to exchange code for token
        const response = await fetch("/api/social/facebook/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Failed to connect account");
        }

        // Success - redirect back to settings
        router.push("/settings/social-accounts?success=true");
      } catch (err: any) {
        setError(err.message || "Failed to connect account");
        setTimeout(() => {
          router.push("/settings/social-accounts?success=false");
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <div className="p-8 bg-white rounded-lg shadow">
            <div className="text-red-600 mb-4">
              <h2 className="text-2xl font-bold mb-2">Connection Failed</h2>
              <p className="text-gray-600">{error}</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-white rounded-lg shadow">
            <Loading />
            <p className="text-gray-600 mt-4">Connecting your Instagram account...</p>
          </div>
        )}
      </div>
    </div>
  );
}
