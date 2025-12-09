import { AlertTriangle } from "lucide-react";

export default function ErrorBox({ message }) {
  return (
    <div
      className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 
                    flex items-center gap-3"
    >
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm leading-tight">{message}</p>
    </div>
  );
}
