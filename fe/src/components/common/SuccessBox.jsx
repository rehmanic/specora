import { CheckCircle2 } from "lucide-react";

export default function SuccessBox({ message }) {
  return (
    <div
      className="p-3 rounded-md bg-green-50 border border-green-200 text-green-700 
                    flex items-center gap-3"
    >
      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm leading-tight">{message}</p>
    </div>
  );
}

