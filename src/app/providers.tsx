"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
// ^NOTE: This SessionProvider is in place to see if a 
// user is signed in from a client component

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
}

// There are many components inside of NextUI that require
// state to work correctly. All the state is coordinated
// across the application using React Context. This NextUI
// Provider is the mechanism that is sharing all this state
// throughout all the different NextUI components that we are
// using in the application. So this is going to be used by
// things like modals and whatnot to make sure that different
// events, different pieces of state are shared across all these
// different components that we are using.
