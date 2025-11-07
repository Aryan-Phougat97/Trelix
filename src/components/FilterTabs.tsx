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
    <Tabs value={activeFilter} onValueChange={onFilterChange} className="mb-8">
      <TabsList className="bg-transparent h-12 p-0 border-b border-border w-full justify-start gap-8">
        <TabsTrigger
          value="all"
          className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-cool-blue data-[state=active]:text-foreground data-[state=active]:shadow-[0_2px_8px_hsl(var(--cool-blue)/0.3)] text-muted-foreground hover:text-foreground transition-all duration-200 px-0 pb-3"
        >
          All <span className="ml-2 text-xs">{counts.all}</span>
        </TabsTrigger>
        <TabsTrigger
          value="work"
          className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-cool-blue data-[state=active]:text-foreground data-[state=active]:shadow-[0_2px_8px_hsl(var(--cool-blue)/0.3)] text-muted-foreground hover:text-foreground transition-all duration-200 px-0 pb-3"
        >
          Work <span className="ml-2 text-xs">{counts.work}</span>
        </TabsTrigger>
        <TabsTrigger
          value="personal"
          className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-electric-red data-[state=active]:text-foreground data-[state=active]:shadow-[0_2px_8px_hsl(var(--electric-red)/0.3)] text-muted-foreground hover:text-foreground transition-all duration-200 px-0 pb-3"
        >
          Personal <span className="ml-2 text-xs">{counts.personal}</span>
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-cool-blue data-[state=active]:text-foreground data-[state=active]:shadow-[0_2px_8px_hsl(var(--cool-blue)/0.3)] text-muted-foreground hover:text-foreground transition-all duration-200 px-0 pb-3"
        >
          Done <span className="ml-2 text-xs">{counts.completed}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
