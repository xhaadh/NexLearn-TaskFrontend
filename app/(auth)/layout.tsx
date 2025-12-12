// app/(auth)/layout.tsx
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[url('/dark-nature-blue.png')] min-h-screen bg-no-repeat bg-cover bg-center">
      {children}
    </div>
  );
};

export default AuthLayout;
