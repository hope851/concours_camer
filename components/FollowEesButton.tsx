"use client";

import { useState, useTransition } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { ToggleFollowEes } from "@/app/action/user";

export default function FollowEesButton({
  eesId,
  initialFollowing = false,
}: {
  eesId: string;
  initialFollowing?: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await ToggleFollowEes(eesId);
      if (result?.success) setFollowing((prev) => !prev);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
        following
          ? "bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20"
          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
      }`}
    >
      {pending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : following ? (
        <BellOff size={14} />
      ) : (
        <Bell size={14} />
      )}
      {following ? "Suivi actif" : "Suivre cet établissement"}
    </button>
  );
}
