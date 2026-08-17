"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Joyride,
  ACTIONS,
  EVENTS,
  STATUS,
  type EventData,
  type Step,
} from "react-joyride";

type TourStep = Step & { route: string };

const TOUR_STEPS: TourStep[] = [
  {
    route: "/admin",
    target: "#tour-sidebar-nav",
    title: "Navigation",
    content: "Jump between Dashboard, Products, Orders, and Reviews from here.",
    skipBeacon: true,
  },
  {
    route: "/admin",
    target: "#tour-dashboard-stats",
    title: "Store overview",
    content: "Revenue, orders, stock levels, and average rating at a glance.",
  },
  {
    route: "/admin",
    target: "#tour-recent-orders",
    title: "Recent orders",
    content: "New orders show up here as customers check out.",
  },
  {
    route: "/admin",
    target: "#tour-low-stock",
    title: "Low stock alert",
    content: "Get warned here before a product variant runs out of stock.",
  },
  {
    route: "/admin/products",
    target: "#tour-products-toolbar",
    title: "Manage your catalog",
    content: "Filter by status, search by name, or add a new product.",
  },
  {
    route: "/admin/products",
    target: "#tour-products-table",
    title: "Product list",
    content: "Manage price, stock, and status for each product here.",
  },
  {
    route: "/admin/orders",
    target: "#tour-orders-table",
    title: "Orders",
    content:
      "Track every order and update its status as it moves from pending to delivered.",
  },
  {
    route: "/admin/reviews",
    target: "#tour-reviews-queue",
    title: "Review moderation",
    content: "Approve or reject customer reviews before they go public.",
  },
];

type TourContextValue = {
  startTour: () => void;
  hasNewTourNotification: boolean;
};

const TourContext = createContext<TourContextValue | null>(null);

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}

export function TourProvider({
  children,
  initialHasSeenTour,
}: {
  children: React.ReactNode;
  initialHasSeenTour: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(initialHasSeenTour);
  // Route changes triggered by the tour are client-side navigations, so the
  // step for the new page can't be shown until its target has actually
  // mounted. This tracks "advance to this step once the URL catches up."
  const pendingStepRef = useRef<number | null>(null);
  // Joyride mishandles stepIndex and run flipping true in the same commit
  // after a target search failure — settle stepIndex on its own render
  // first, then flip run on a later render.
  const [resumeAt, setResumeAt] = useState<number | null>(null);

  useEffect(() => {
    if (pendingStepRef.current === null) return;
    const pending = pendingStepRef.current;
    if (pathname === TOUR_STEPS[pending]?.route) {
      pendingStepRef.current = null;
      setStepIndex(pending);
      setResumeAt(pending);
    }
  }, [pathname]);

  useEffect(() => {
    if (resumeAt === null) return;
    // Intentional: this needs to land in a render after stepIndex settles,
    // not the same one — see the comment above resumeAt. Deliberately not
    // derived during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRun(true);
    setResumeAt(null);
  }, [resumeAt]);

  const dismiss = useCallback(() => {
    setRun(false);
    setHasSeenTour((seen) => {
      if (!seen) {
        fetch("/api/admin/dismiss-tour", { method: "POST" }).catch(() => {});
      }
      return true;
    });
  }, []);

  const startTour = useCallback(() => {
    const firstStep = TOUR_STEPS[0];
    if (pathname !== firstStep.route) {
      pendingStepRef.current = 0;
      router.push(firstStep.route);
    } else {
      setStepIndex(0);
      setRun(true);
    }
  }, [pathname, router]);

  const handleEvent = useCallback(
    (data: EventData) => {
      const { status, action, index, type } = data;

      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        dismiss();
        return;
      }

      if (type === EVENTS.STEP_AFTER) {
        const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        const nextStep = TOUR_STEPS[nextIndex];

        if (!nextStep) {
          dismiss();
          return;
        }

        if (nextStep.route !== pathname) {
          setRun(false);
          pendingStepRef.current = nextIndex;
          router.push(nextStep.route);
        } else {
          setStepIndex(nextIndex);
        }
      }
    },
    [pathname, router, dismiss],
  );

  return (
    <TourContext.Provider
      value={{ startTour, hasNewTourNotification: !hasSeenTour }}
    >
      <Joyride
        steps={TOUR_STEPS}
        run={run}
        stepIndex={stepIndex}
        continuous
        scrollToFirstStep
        onEvent={handleEvent}
        options={{
          primaryColor: "#2563eb",
          buttons: ["back", "close", "skip", "primary"],
          showProgress: true,
          overlayClickAction: false,
          // Generous — a step after a page navigation has to wait for that
          // route's RSC payload (and, in dev, on-demand compilation) before
          // its target exists at all.
          targetWaitTimeout: 8000,
        }}
      />
      {children}
    </TourContext.Provider>
  );
}
