"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useReducedMotion, AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MessageRole = "customer" | "auto" | "status";

type Message = {
  role: MessageRole;
  text: string;
  /** ms delay after the previous message before this one appears */
  delay: number;
  /** if true, show typing indicator before this message */
  typing?: boolean;
  /** optional timestamp shown under the bubble */
  timestamp?: string;
};

const MESSAGES: Message[] = [
  {
    role: "customer",
    text: "Hi, I filled out the form on your site. Do you have availability this week?",
    delay: 600,
    typing: false,
    timestamp: "2:14 PM",
  },
  {
    role: "auto",
    text: "Thanks for reaching out! We received your request and are looking at availability now. What day works best for you?",
    delay: 950,
    typing: true,
    timestamp: "2:14 PM",
  },
  {
    role: "customer",
    text: "Thursday afternoon would be perfect.",
    delay: 2100,
    typing: false,
    timestamp: "2:16 PM",
  },
  {
    role: "auto",
    text: "We have openings Thursday between 2 and 4 PM. Would either of those work for you?",
    delay: 950,
    typing: true,
    timestamp: "2:16 PM",
  },
  {
    role: "customer",
    text: "2 PM works great. Thank you!",
    delay: 1700,
    typing: false,
    timestamp: "2:18 PM",
  },
  {
    role: "status",
    text: "✓ Appointment Confirmed",
    delay: 850,
    typing: false,
  },
];

const LOOP_RESET_DELAY = 4000; // ms to hold on the final state before looping

type ThreadState = {
  visibleCount: number;
  showTyping: boolean;
};

export function SmsThread() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  const [state, setState] = useState<ThreadState>({ visibleCount: 0, showTyping: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function runSequence(startCount = 0) {
    clearTimer();

    if (startCount >= MESSAGES.length) {
      // Hold on completion, then reset and loop
      timerRef.current = setTimeout(() => {
        setState({ visibleCount: 0, showTyping: false });
        timerRef.current = setTimeout(() => runSequence(0), 400);
      }, LOOP_RESET_DELAY);
      return;
    }

    const msg = MESSAGES[startCount];

    if (msg.typing) {
      // Show typing indicator first
      setState((s) => ({ ...s, showTyping: true }));
      timerRef.current = setTimeout(() => {
        setState({ visibleCount: startCount + 1, showTyping: false });
        timerRef.current = setTimeout(() => runSequence(startCount + 1), MESSAGES[startCount + 1]?.delay ?? 1000);
      }, 1400);
    } else {
      timerRef.current = setTimeout(() => {
        setState({ visibleCount: startCount + 1, showTyping: false });
        const next = MESSAGES[startCount + 1];
        if (next) {
          timerRef.current = setTimeout(() => runSequence(startCount + 1), next.delay);
        } else {
          runSequence(MESSAGES.length);
        }
      }, msg.delay);
    }
  }

  useEffect(() => {
    if (!isInView) {
      clearTimer();
      setState({ visibleCount: 0, showTyping: false });
      return;
    }

    if (prefersReduced) {
      setState({ visibleCount: MESSAGES.length, showTyping: false });
      return;
    }

    // Kick off the first message after a short entry pause
    timerRef.current = setTimeout(() => runSequence(0), 300);

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, prefersReduced]);

  // Auto-scroll to bottom as messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.visibleCount, state.showTyping]);

  const visibleMessages = MESSAGES.slice(0, state.visibleCount);

  return (
    <div ref={containerRef} className="w-full">
      {/* Phone chrome */}
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 shadow-[0_0_60px_-16px_rgba(37,99,235,0.25)] backdrop-blur-sm">
        {/* Header bar */}
        <div className="flex items-center gap-3 border-b border-ink-700/80 bg-ink-900/80 px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-accent-500/20 text-xs font-bold text-accent-400">
            V
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink-50">Valfin Automation</p>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              <p className="text-xs text-ink-400">Active · responds in seconds</p>
            </div>
          </div>
          <div className="text-xs font-medium text-ink-500">SMS</div>
        </div>

        {/* Message scroll area */}
        <div
          ref={scrollRef}
          className="flex min-h-[280px] flex-col gap-3 overflow-y-auto px-4 py-4 sm:min-h-[300px]"
          style={{ scrollBehavior: "smooth" }}
          aria-live="polite"
          aria-label="SMS conversation demonstrating Valfin automated response"
        >
          <AnimatePresence initial={false}>
            {visibleMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <MessageBubble message={msg} />
              </motion.div>
            ))}

            {/* Typing indicator */}
            {state.showTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.25 }}
                className="flex items-end gap-2"
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-[9px] font-bold text-accent-400">
                  V
                </div>
                <div className="flex gap-1.5 rounded-2xl rounded-bl-sm border border-ink-700 bg-ink-800/60 px-3.5 py-3">
                  <span className="sms-typing-dot size-1.5 rounded-full bg-ink-400" />
                  <span className="sms-typing-dot size-1.5 rounded-full bg-ink-400" />
                  <span className="sms-typing-dot size-1.5 rounded-full bg-ink-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Seen indicator — outside AnimatePresence to avoid exit animation conflicts */}
          {state.visibleCount >= MESSAGES.length && !state.showTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex justify-end pr-1"
            >
              <span className="text-[10px] text-ink-600">Seen</span>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-ink-700/60 bg-ink-900/80 px-4 py-2.5 text-center">
          <p className="text-[11px] text-ink-600">
            ⚡ Responded in{" "}
            <span className="font-semibold text-accent-400">38 seconds</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "status") {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          {message.text}
        </span>
      </div>
    );
  }

  const isAuto = message.role === "auto";

  return (
    <div className={cn("flex flex-col gap-0.5", isAuto ? "items-start" : "items-end")}>
      <div className={cn("flex items-end gap-2", isAuto ? "flex-row" : "flex-row-reverse")}>
        {isAuto && (
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-[9px] font-bold text-accent-400">
            V
          </div>
        )}
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
            isAuto
              ? "rounded-bl-sm border border-ink-700 bg-ink-800/60 text-ink-200"
              : "rounded-br-sm bg-ink-700/80 text-ink-100",
          )}
        >
          {isAuto && (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-accent-400/70">
              Auto · Valfin
            </p>
          )}
          {message.text}
        </div>
      </div>
      {message.timestamp && (
        <p className={cn("text-[10px] text-ink-600", isAuto ? "pl-8" : "pr-1")}>
          {message.timestamp}
        </p>
      )}
    </div>
  );
}
