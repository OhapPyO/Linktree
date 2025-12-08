import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link in Bio",
  description: "Link in Bio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 lg:px-8">{children}</main>
    </div>
  );
}
