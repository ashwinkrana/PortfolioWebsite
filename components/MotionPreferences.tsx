"use client";

import { MotionConfig } from "framer-motion";

/**
 * The CSS reduced-motion guard in globals.css can't reach Framer Motion,
 * because its animations are driven from JS. MotionConfig is the JS-side
 * equivalent: with "user" it follows the OS setting and makes transform
 * animations instant, keeping opacity fades. It has to live in a client
 * component because app/layout.tsx is a server component.
 */
export default function MotionPreferences({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
