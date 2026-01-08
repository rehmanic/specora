"use client";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function MessageMenu({ id, menuOpenId, setMenuOpenId }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setMenuOpenId]);

  return (
    <div className="absolute top-1 right-1" ref={menuRef}>
      <button
        onClick={() => setMenuOpenId(menuOpenId === id ? null : id)}
        className="p-1 rounded cursor-pointer"
      >
        <MoreHorizontal size={16} />
      </button>

      {menuOpenId === id && (
        <div className="absolute right-0 mt-1 w-28 rounded-md bg-white shadow-lg z-10 overflow-hidden">
          <button className="flex w-full items-center gap-2 px-3 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer rounded-t-md">
            <Edit2 size={14} /> Edit
          </button>
          <div className="h-px bg-gray-200" /> {/* divider */}
          <button className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer rounded-b-md">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
