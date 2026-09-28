import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BottomDock } from "@/components/navigation/BottomDock";
import { SplashScreenV2 } from "@/components/motion/SplashScreenV2";
import { RouterProvider, useRouter } from "@/lib/router";

function Shell() {
  const { pathname } = useRouter();
  const [ready, setReady] = useState(false);
  const completeSplash = useCallback(() => setReady(true), []);

  return (
    <div className="heritage-app">
      <AnimatePresence mode="wait">
        {!ready ? <SplashScreenV2 key="splash" onComplete={completeSplash} /> : null}
      </AnimatePresence>
      {ready ? (
        <>
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Heritage Green V2 shell · {pathname}
          </motion.main>
          <BottomDock />
        </>
      ) : null}
    </div>
  );
}

export default function App() {
  return <RouterProvider><Shell /></RouterProvider>;
}
