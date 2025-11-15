import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ApiErrorFallback({ error, onRetry }) {
  // Prevent leaking sensitive backend messages
  const safeMessage = "Something went wrong while contacting the server.";

  console.error("API Error:", error); // Logged internally only

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="shadow-xl rounded-2xl border border-gray-200">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>

            <h2 className="text-xl font-semibold">Request Failed</h2>
            <p className="text-gray-600 text-sm">{safeMessage}</p>

            <div className="pt-2">
              <Button
                onClick={onRetry}
                className="w-full rounded-xl p-3 text-base"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
