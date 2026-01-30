import { useLocation, useOutlet } from "react-router-dom";
import Header from "./Header";
import { AnimatePresence, motion } from "framer-motion";

const Layout = () => {
  const location = useLocation();
  const currentOutlet = useOutlet();

  const routeMeta: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": { title: "Dashboard", subtitle: "Overview of Missions and Cases" },
    "/pcr-form": { title: "PCR Form", subtitle: "Add a new PCR Record" },
    "/testing-grounds": { title: "Testing Grounds", subtitle: "For Testing Components" },
    "/testing-grounds2": { title: "Testing Grounds 2", subtitle: "For Testing Components" },
  };

  const { title, subtitle } =
    routeMeta[location.pathname] ?? {
      title: "Page",
      subtitle: "Details",
    };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header title={title} subtitle={subtitle} />

      {/* Main */}
      <main className="flex-1 overflow-hidden p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {currentOutlet}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 border-t bg-white p-4 text-center text-sm">
        Safety & Security Department – USJR © 2026
      </footer>
    </div>
  );
};

export default Layout;
