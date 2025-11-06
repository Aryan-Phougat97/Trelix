import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    work: number;
    personal: number;
    completed: number;
  };
}

export const FilterTabs = ({ activeFilter, onFilterChange, counts }: FilterTabsProps) => {
  return (
    <Tabs value={activeFilter} onValueChange={onFilterChange} className="mb-6">
      <TabsList className="glass-card h-14 p-1 rounded-xl grid grid-cols-4 gap-1">
        <TabsTrigger
          value="all"
          className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan data-[state=active]:to-neon-purple data-[state=active]:text-white transition-all duration-300"
        >
          All <span className="ml-2 text-xs opacity-70">{counts.all}</span>
        </TabsTrigger>
        <TabsTrigger
          value="work"
          className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan data-[state=active]:to-neon-purple data-[state=active]:text-white transition-all duration-300"
        >
          Work <span className="ml-2 text-xs opacity-70">{counts.work}</span>
        </TabsTrigger>
        <TabsTrigger
          value="personal"
          className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan data-[state=active]:to-neon-purple data-[state=active]:text-white transition-all duration-300"
        >
          Personal <span className="ml-2 text-xs opacity-70">{counts.personal}</span>
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-cyan data-[state=active]:to-neon-purple data-[state=active]:text-white transition-all duration-300"
        >
          Done <span className="ml-2 text-xs opacity-70">{counts.completed}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
