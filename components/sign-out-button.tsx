"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SignOutButton({
  className,
  label = "Sign Out",
  pendingLabel = "Signing out...",
  redirectTo = "/login",
}: {
  className?: string;
  label?: string;
  pendingLabel?: string;
  redirectTo?: string;
}) {
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    setIsPending(true);
    await signOut({ redirectTo });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className={className}
    >
      {isPending ? pendingLabel : label}
    </button>
  );
}
