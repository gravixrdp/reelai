"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import Loading from "@/components/ui/loading";

interface SocialAccount {
  is_connected: boolean;
  connection_type: string;
  instagram_username?: string;
  facebook_page_name?: string;
  token_expires_at?: string;
  is_token_valid: boolean;
  last_refreshed_at?: string;
}

export default function SocialAccountsPage() {
  const router = useRouter();
  const [account, setAccount] = useState<SocialAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetchSocialStatus();

    // Check for callback
    const params = new URLSearchParams(window.location.search);
    if (params.has("success")) {
      const success = params.get("success") === "true";
      if (success) {
        setError("");
        fetchSocialStatus();
        // Clear URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const fetchSocialStatus = async () => {
    try {
      setLoading(true);
      const response = await api.social.getSocialStatus();
      setAccount(response.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch social account status");
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectInstagram = async () => {
    try {
      const response = await api.social.getFacebookLoginUrl();
      const { login_url } = response.data;
      // Redirect to Facebook login
      window.location.href = login_url;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to start Facebook login");
    }
  };

  const handleRefreshToken = async () => {
    try {
      setRefreshing(true);
      const response = await api.social.refreshToken();
      if (response.data.success) {
        setError("");
        await fetchSocialStatus();
        alert("Token refreshed successfully!");
      } else {
        setError(response.data.message || "Failed to refresh token");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to refresh token");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect your Instagram account?")) {
      return;
    }

    try {
      setDisconnecting(true);
      const response = await api.social.disconnect();
      if (response.data.success) {
        setError("");
        setAccount(null);
        alert("Account disconnected successfully!");
      } else {
        setError(response.data.message || "Failed to disconnect account");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to disconnect account");
    } finally {
      setDisconnecting(false);
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isTokenExpiring = account?.token_expires_at
    ? new Date(account.token_expires_at) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Social Accounts</h1>
          <p className="text-gray-600 mt-2">Connect and manage your Instagram Business Account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <Card className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Instagram Business Account</h2>
              <p className="text-gray-600 mt-1">Connect your Facebook Page and Instagram account</p>
            </div>
            {account?.is_connected && (
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            )}
            {!account?.is_connected && (
              <Badge variant="outline" className="text-gray-600">Not Connected</Badge>
            )}
          </div>

          {account?.is_connected ? (
            <div className="space-y-6">
              {/* Connection Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Instagram Username</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">
                      @{account.instagram_username}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Facebook Page</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">
                      {account.facebook_page_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Token Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {account.is_token_valid ? (
                      <>
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="font-medium text-green-800">Token Valid</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={18} className="text-red-600" />
                        <span className="font-medium text-red-800">Token Invalid</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {account.is_token_valid ? "Your access token is currently valid" : "Your token needs to be refreshed"}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {isTokenExpiring ? (
                      <>
                        <Clock size={18} className="text-amber-600" />
                        <span className="font-medium text-amber-800">Expiring Soon</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="font-medium text-green-800">Not Expiring</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Expires on {formatDate(account.token_expires_at)}
                  </p>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Last refreshed:</span> {formatDate(account.last_refreshed_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleRefreshToken}
                  disabled={refreshing}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw size={18} />
                  {refreshing ? "Refreshing..." : "Refresh Token"}
                </Button>
                <Button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  variant="destructive"
                >
                  {disconnecting ? "Disconnecting..." : "Disconnect Account"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <AlertCircle size={40} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Account Connected</h3>
                <p className="text-gray-600">
                  Connect your Instagram Business Account to enable automatic uploads
                </p>
              </div>

              <Button
                onClick={handleConnectInstagram}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Connect Instagram Account
              </Button>

              <p className="text-sm text-gray-600 mt-6">
                You&apos;ll need a Facebook Business Account with access to the Instagram Business Account you want to connect.
              </p>
            </div>
          )}
        </Card>

        {/* Info Section */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">1</span>
              <span>Click &quot;Connect Instagram Account&quot; to link via Facebook</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">2</span>
              <span>Authorize the app to access your Instagram Business Account</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">3</span>
              <span>Your token will automatically refresh every 50 days</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-600">4</span>
              <span>Reels will upload directly to your Instagram account</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
