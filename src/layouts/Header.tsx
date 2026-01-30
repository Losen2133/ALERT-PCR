import AppSidebarSheet from "./AppSidebarSheet";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="flex items-center gap-4 px-6 py-4">
        <AppSidebarSheet />

        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tight">{title}</span>
          {subtitle && (
            <span className="text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
