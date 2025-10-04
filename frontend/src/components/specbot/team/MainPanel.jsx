export default function MainPanel() {
  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Welcome</h1>
        <p className="mt-2 text-muted-foreground">
          Select a chat or start a new conversation
        </p>
      </div>
    </div>
  );
}
