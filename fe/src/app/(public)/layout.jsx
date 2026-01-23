export const metadata = {
  icons: {
    icon: "/specora_favicon_circle.svg",
  },
};

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}
