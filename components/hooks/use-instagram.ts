"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface InstagramAccount {
    id: string;
    username: string;
    status: "pending_verification" | "connected" | "verification_failed" | "inactive";
    verification_attempts: number;
    last_error?: string;
}

export function useInstagram() {
    const [account, setAccount] = useState<InstagramAccount | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccount = async () => {
        try {
            // Simplify: assume list returns array, we take first or null
            const accounts = await api.get("/api/instagram/");
            if (Array.isArray(accounts) && accounts.length > 0) {
                setAccount(accounts[0]);
            } else {
                setAccount(null);
            }
        } catch (err: any) {
            console.error("Failed to fetch instagram account", err);
            // Don't set error on initial fetch to avoid UI clutter if just empty
        }
    };

    const connectAccount = async (username: string, accessToken: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.post("/api/instagram/", {
                username,
                access_token: accessToken,
                label: "Main Account"
            });
            await fetchAccount();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyAccount = async (accountId: string, igUserId: string, accessToken: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.post(`/api/instagram/${accountId}/verify`, {
                ig_user_id: igUserId,
                access_token: accessToken
            });
            await fetchAccount();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const disconnectAccount = async (accountId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.delete(`/api/instagram/${accountId}`);
            setAccount(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    return {
        account,
        isLoading,
        error,
        connectAccount,
        verifyAccount,
        disconnectAccount,
        refresh: fetchAccount
    };
}
