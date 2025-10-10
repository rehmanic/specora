import { useState } from "react";
export function useFeedback() {
  const [data, setData] = useState([]);
  const add = (feedback) => setData((prev) => [...prev, feedback]);
  return { data, add };
}

