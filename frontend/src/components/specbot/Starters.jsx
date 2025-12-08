export default function Starter({ onSelect }) {
  // Starter prompts to guide requirements discovery
  const starterQuestions = [
    "List the primary user roles and their goals for this project.",
    "What business outcomes must this release achieve?",
    "What are the top 5 constraints (tech, budget, timeline, compliance)?",
    "Describe the main user journey from sign-up to success.",
    "Identify critical integrations and their data exchange needs.",
    "What non-functional requirements (performance, security, availability) matter most?",
    "List edge cases or failure scenarios we must handle.",
    "Define acceptance criteria for the main feature in this project.",
  ];

  const handleClick = (question) => {
    if (onSelect) {
      onSelect(question);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {starterQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleClick(question)}
            className="cursor-pointer px-3 py-2 sm:px-4 sm:py-2.5 bg-secondary hover:bg-accent text-secondary-foreground rounded-full text-sm sm:text-base transition-colors duration-200 border border-border hover:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
