"use client";

import { useState } from "react";
import { Bell, Compass } from "lucide-react";
import { useTour } from "@/components/admin/tour-provider";

export default function NotificationsBell() {
  const { startTour, hasNewTourNotification } = useTour();
  const [open, setOpen] = useState(false);

  function handleStartTour() {
    setOpen(false);
    startTour();
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
      >
        <Bell className="size-4" />
        {hasNewTourNotification && (
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-blue-500" />
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />

          <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
            <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
              Notifications
            </p>

            {hasNewTourNotification && (
              <button
                type="button"
                onClick={handleStartTour}
                className="flex w-full items-start gap-3 rounded-lg p-2 text-left hover:bg-gray-50"
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Compass className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-gray-900">
                    Welcome to the admin panel
                  </span>
                  <span className="block text-xs text-gray-500">
                    Take a quick tour of what&apos;s where.
                  </span>
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStartTour}
              className="mt-1 flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm text-gray-500 hover:bg-gray-50"
            >
              <Compass className="size-4" />
              Take the tour again
            </button>
          </div>
        </>
      )}
    </div>
  );
}
