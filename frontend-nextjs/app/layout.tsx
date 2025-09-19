import React, { ReactNode } from "react";

export const metadata = {
  title: "GeoFace",
  description: "MicroService-based Face Recognition Attendance System",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
