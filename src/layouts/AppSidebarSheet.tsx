import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LayoutDashboard, ClipboardPlus, TestTubeDiagonal, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const items = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "New PCR Form", path: "/pcr-form", icon: ClipboardPlus },
  { label: "Testing Grounds", path: "/testing-grounds", icon: TestTubeDiagonal },
  { label: "Testing Grounds 2", path: "/testing-grounds2", icon: TestTubeDiagonal },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

const AppSidebarSheet = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sheet>
      {/* Trigger (Hamburger button) */}
      <SheetTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted">
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>

      {/* Overlay Sidebar */}
      <SheetContent
        side="left"
        className="w-72 p-0"
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b px-4 py-4">
          <img src={logo} className="h-10 w-10" />
          <span className="font-bold text-xl">ALERT PCR</span>
        </div>

        {/* Menu */}
        <motion.nav
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-2"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.button
                key={item.path}
                variants={itemVariants}
                onClick={() => navigate(item.path)}
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.96 }}
                className={`relative flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition
                  ${isActive
                    ? "bg-muted font-medium"
                    : "hover:bg-muted/60"
                  }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 h-full w-1 rounded-r bg-black"
                  />
                )}

                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </motion.nav>
      </SheetContent>
    </Sheet>
  );
};

export default AppSidebarSheet;
