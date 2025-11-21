export default function Starter({ onSelect }) {
  // Dummy array of starter questions
  const starterQuestions = [
    "What's the weather like today?",
    "Tell me a fun fact",
    "How do I learn React?",
    "What are the best practices for TypeScript?",
    "Explain async/await in JavaScript",
    "What is Tailwind CSS?",
    "How does Next.js work?",
    "What are React hooks?",
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
