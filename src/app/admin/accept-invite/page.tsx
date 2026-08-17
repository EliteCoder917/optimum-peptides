"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

type Status = "checking" | "ready" | "saving" | "invalid";

export default function AcceptInvitePage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function establishSession() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      // PKCE flow (a `code` param) — not what Supabase invite emails
      // actually use, but handled in case that ever changes.
      if (code) {
        const { error: exchangeError } =
          await supabaseBrowser.auth.exchangeCodeForSession(code);
        setStatus(exchangeError ? "invalid" : "ready");
        return;
      }

      // Invite/magic-link emails deliver tokens in the URL hash, since the
      // link is generated server-side with no browser-held code_verifier
      // for a PKCE exchange to use.
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error: setSessionError } =
          await supabaseBrowser.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

        if (!setSessionError) {
          window.history.replaceState({}, "", url.pathname);
        }

        setStatus(setSessionError ? "invalid" : "ready");
        return;
      }

      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      setStatus(session ? "ready" : "invalid");
    }

    establishSession();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setStatus("saving");

    const { error: updateError } = await supabaseBrowser.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setStatus("ready");
      return;
    }

    const response = await fetch("/api/admin/complete-invite", {
      method: "POST",
    });

    if (!response.ok) {
      setError(
        "Your password was set, but we couldn't grant admin access. Contact the site owner.",
      );
      setStatus("ready");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8">
        <p className="text-lg font-semibold tracking-tight text-gray-900">
          Optimum <span className="text-blue-600">Peptides</span>
        </p>
        <p className="mt-1 text-sm text-gray-500">Set up your admin account</p>

        {status === "checking" && (
          <p className="mt-6 text-sm text-gray-500">Verifying your invite…</p>
        )}

        {status === "invalid" && (
          <p className="mt-6 text-sm text-red-600">
            This invite link is invalid or has expired. Ask the site owner to
            send a new one.
          </p>
        )}

        {(status === "ready" || status === "saving") && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-400"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={status === "saving"}
              className="h-10 w-full rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {status === "saving" ? "Saving..." : "Create account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
