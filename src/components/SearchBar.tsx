import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import type { FC, FormEvent } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  live?: boolean; // optional prop to enable live search
}

export const SearchBar: FC<SearchBarProps> = ({ placeholder = "Search...", onSearch, live = true }) => {
  const [query, setQuery] = useState("");

  // live search: call onSearch whenever query changes
  useEffect(() => {
    if (live) {
      onSearch(query);
    }
  }, [query, live, onSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query); // fallback when pressing Enter
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md mx-auto items-center space-x-2 mt-7 mb-2"
    >
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-center"
      />
      {/* <Button type="submit" variant="default">
        <Search className="w-5 h-5" />
      </Button> */}
    </form>
  );
};
