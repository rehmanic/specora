"use client";
import React, { useEffect, useRef, useState } from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

const FormBuilder = () => {
  const creatorRef = useRef(null);
  const [creatorReady, setCreatorReady] = useState(false);

  useEffect(() => {
    const creator = new SurveyCreator({
      showLogicTab: true,
      isAutoSave: false,
      haveCommercialLicense: true,
    });

    creator.saveSurveyFunc = async (saveNo, callback) => {
      const formJSON = creator.JSON;

      try {
        // ✅ API Call Here
        const res = await fetch("http://localhost:4000/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formJSON.title || "Untitled Form",
            status: "Open",
            formJson: formJSON,
          }),
        });

        const result = await res.json();
        console.log("✅ Saved:", result);

        callback(saveNo, true);
      } catch (err) {
        console.log("❌ Save Error:", err);
        callback(saveNo, false);
      }
    };

    creatorRef.current = creator;
    setCreatorReady(true);
  }, []);

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
