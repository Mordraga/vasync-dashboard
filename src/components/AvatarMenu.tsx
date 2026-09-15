"use client";

import { useEffect, useRef, useState } from "react";

interface AvatarMenuProps {
  displayName: string;
  avatarUrl: string | null;
  isStaff: boolean;
}

function initialsOf(name: string): string {
  return name.trim().slice(0, 1).toUpperCase() || "?";
}

export function AvatarMenu({ displayName, avatarUrl, isStaff }: AvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="avatar-menu" ref={containerRef}>
      <button
        type="button"
        className="avatar-menu-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="avatar-image" />
        ) : (
          <span className="avatar-fallback">{initialsOf(displayName)}</span>
        )}
        <span className="avatar-menu-caret">▾</span>
      </button>

      {open && (
        <div className="avatar-menu-dropdown">
          {isStaff && <a href="/admin">Admin settings</a>}
          <form action="/api/auth/logout" method="post">
            <button type="submit">Sign out</button>
          </form>
        </div>
      )}
    </div>
  );
}
