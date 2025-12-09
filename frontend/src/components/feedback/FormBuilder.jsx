"use client";
import React, { useEffect, useRef, useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

const FormBuilder = () => {
  const creatorRef = useRef(null);
  const [creatorReady, setCreatorReady] = useState(false);
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const creator = new SurveyCreator({
      showLogicTab: true,
      isAutoSave: false,
      haveCommercialLicense: true,
    });

    creator.saveSurveyFunc = async (saveNo, callback) => {
      const formJSON = creator.JSON;

      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE}/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formJSON.title || "Untitled Form",
            status: "open",
            form_structure: formJSON,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save feedback");
        }

        const result = await res.json();
        console.log("✅ Feedback saved successfully:", result);

        // Redirect to feedback list after successful save
        alert("Feedback created successfully!");
        callback(saveNo, true);

        router.refresh(); // Force refresh of the data
        setTimeout(() => {
          router.push("/feedback");
        }, 100);
      } catch (err) {
        console.error("❌ Save Error:", err);
        alert("Failed to save feedback. Please try again.");
        callback(saveNo, false);
      }
    };

    creatorRef.current = creator;
    setCreatorReady(true);
  }, [token, router]);

  return (
    <div style={{ height: "100vh" }}>
      {creatorReady ? (
        <SurveyCreatorComponent creator={creatorRef.current} />
      ) : (
        <p>Loading Form Builder...</p>
      )}
    </div>
  );
};

export default FormBuilder;
