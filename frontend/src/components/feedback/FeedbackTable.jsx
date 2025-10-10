"use client";

import { useFeedback } from "./UseFeedback.js";

const sampleRows = [
  {
    id: "sample-1",
    name: "Ayesha B.",
    comments: "Great UX—would love dark mode in settings.",
    rating: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    name: "John D.",
    comments: "Chat is smooth. Message search could be faster.",
    rating: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-3",
    name: "Priya K.",
    comments: "Meetings integration worked. Notification timing felt off.",
    rating: 3,
    createdAt: new Date().toISOString(),
  },
];

export default function FeedbackTable() {
  const { data } = useFeedback();
  const rows = data.length ? data : sampleRows;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <caption className="sr-only">Feedback Summary Table</caption>
        <thead>
          <tr className="[&_th]:text-left [&_th]:text-xs [&_th]:font-medium [&_th]:text-muted-foreground">
            <th scope="col" className="p-2 border border-border rounded-tl-md">
              Client Name
            </th>
            <th scope="col" className="p-2 border border-border">
              Comments
            </th>
            <th scope="col" className="p-2 border border-border rounded-tr-md">
              Rating the app
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="align-top">
              <td className="p-3 border border-border text-sm font-medium">{row.name}</td>
              <td className="p-3 border border-border text-sm">{row.comments}</td>
              <td className="p-3 border border-border text-sm">{row.rating}/5</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          Showing examples. New submissions will replace these.
        </p>
      )}
    </div>
  );
}
