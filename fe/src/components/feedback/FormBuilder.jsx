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

    creator.saveSurveyFunc = (saveNo, callback) => {
      const formJSON = creator.JSON;
      console.log("Form JSON:", formJSON);
      callback(saveNo, true);
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
