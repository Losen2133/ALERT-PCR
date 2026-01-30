import CounterCard from "@/components/CounterCard";
import { ChevronDown, Calendar as CalendarIcon, BriefcaseMedical, CircleAlert, Ambulance, FileText } from "lucide-react";
import CaseCard from "@/components/CaseCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Case, PatientDemographics } from "@/interfaces/interfaces";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function Dashboard() {
  interface CaseCardType {
    patient: PatientDemographics;
    case: Case;
  }

  const caseIconColorMap = {
    Low: "text-blue-100",
    High: "text-red-100",
  };

  const caseIconTextColorMap = {
    Low: "text-blue-500",
    High: "text-red-500",
  };

  // Dummy data
  const dummyCaseCard: CaseCardType = {
    patient: {
      lastName: "Doe",
      firstName: "John",
      mi: "A.",
      age: 45,
      sex: "Male",
    },
    case: {
      caseNumber: "#PCR-1234",
      date: new Date(),
      dispatchTime: "14:30",
      priority: "Low",
    },
  };
  const dummyCaseCard2: CaseCardType = {
    patient: {
      lastName: "Doe",
      firstName: "Cassandra",
      mi: "A.",
      age: 25,
      sex: "Female",
    },
    case: {
      caseNumber: "#PCR-5678",
      date: new Date(),
      dispatchTime: "14:30",
      priority: "High",
    },
  };

  // Original case list
  const [caseCardList] = useState<CaseCardType[]>([
    dummyCaseCard,
    dummyCaseCard2,
  ]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<"all" | "Low" | "High">("all");
  const [dateOpen, setDateOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });


  // Filtered list based on search query
  const filteredCases = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return caseCardList.filter(({ patient, case: caseData }) => {
      // Search filter
      const matchesQuery =
        patient.firstName?.toLowerCase().includes(query) ||
        patient.lastName?.toLowerCase().includes(query) ||
        caseData.caseNumber?.toLowerCase().includes(query);

      // Priority filter
      const matchesPriority =
        selectedPriority === "all" ||
        caseData.priority?.toLowerCase() === selectedPriority.toLowerCase();

      // Date filter
      const caseTime = new Date(caseData.date ?? "").setHours(0,0,0,0); // normalize
      const fromTime = dateRange.from?.setHours(0,0,0,0);
      const toTime = dateRange.to?.setHours(0,0,0,0);

      const matchesDateRange =
        (!fromTime || caseTime >= fromTime) &&
        (!toTime || caseTime <= toTime);

      return matchesQuery && matchesPriority && matchesDateRange;
    });
  }, [searchQuery, selectedPriority, dateRange, caseCardList]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full"
    >
      {/* Counter Cards */}
      <div className="grid grid-flow-col auto-cols-fr gap-4 mb-4">
        <CounterCard
          title="Total Missions"
          count={4}
          Icon={BriefcaseMedical}
          iconColor="bg-blue-100"
          iconTextColor="text-blue-500"
        />
        <CounterCard
          title="High Priority"
          count={4}
          Icon={CircleAlert}
          iconColor="bg-red-100"
          iconTextColor="text-red-500"
        />
        <CounterCard
          title="Transports"
          count={4}
          Icon={Ambulance}
          iconColor="bg-yellow-100"
          iconTextColor="text-yellow-500"
        />
      </div>

      {/* Search Bar */}
      <div className="mb-3 pb-1 border-b border-gray-300 flex flex-row items-center justify-center gap-2">
        <Input
        type="text"
        placeholder="Search cases here..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-80"
        >
        </Input>
        <Select value={selectedPriority} onValueChange={(value) => setSelectedPriority(value as "all" | "Low" | "High")}>
          <SelectTrigger>
              <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low Priority</SelectItem>
            <SelectItem value="High">High Priority</SelectItem>
          </SelectContent>
        </Select>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 w-52 justify-between font-normal">
              <span className="flex items-center">
                <CalendarIcon className="mr-2" />
                {dateRange.from && dateRange.to
                  ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                  : "Pick a Date Range"}
              </span>
              <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDateRange({ from: undefined, to: undefined })}
              className="mt-2 w-full"
            >
              Clear Date Range
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Scrollable CaseCards */}
      <ScrollArea className="h-[62.5vh] rounded-md">
        <div className="flex-1 flex flex-col gap-2">
          {filteredCases.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              No matching cases found.
            </div>
          ) : (
            <AnimatePresence>
              {filteredCases.map((caseCard) => (
                <motion.div
                  key={caseCard.case.caseNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CaseCard
                    caseId={caseCard.case.caseNumber ?? ""}
                    priority={caseCard.case.priority ?? "Low"}
                    firstName={caseCard.patient.firstName ?? ""}
                    lastName={caseCard.patient.lastName ?? ""}
                    mi={caseCard.patient.mi ?? ""}
                    date={caseCard.case?.date?.toISOString().split("T")[0] ?? ""}
                    dispatchTime={caseCard.case.dispatchTime ?? ""}
                    sex={caseCard.patient.sex ?? ""}
                    age={caseCard.patient.age ?? 0}
                    Icon={FileText}
                    iconColor={caseIconColorMap[caseCard.case.priority ?? "Low"]}
                    iconTextColor={caseIconTextColorMap[caseCard.case.priority ?? "Low"]}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}

export default Dashboard;
