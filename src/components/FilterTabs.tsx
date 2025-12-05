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
    <Tabs value={activeFilter} onValueChange={onFilterChange} className="mb-8 animate-fade-in">
      <TabsList className="bg-transparent h-12 p-0 border-b border-border w-full justify-start gap-8">
        <TabsTrigger
          value="all"
          className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-[0_2px_8px_oklch(var(--primary)/0.3)] text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200 px-0 pb-3"
        >
          All <span className="ml-2 text-xs transition-transform duration-200">{counts.all}</span>
        </TabsTrigger>
        <TabsTrigger
          value="work"
          className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-[0_2px_8px_oklch(var(--primary)/0.3)] text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200 px-0 pb-3"
        >
          Work <span className="ml-2 text-xs transition-transform duration-200">{counts.work}</span>
        </TabsTrigger>
        <TabsTrigger
          value="personal"
          className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-brand-rose data-[state=active]:text-foreground data-[state=active]:shadow-[0_2px_8px_oklch(var(--brand-rose)/0.3)] text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200 px-0 pb-3"
        >
          Personal <span className="ml-2 text-xs transition-transform duration-200">{counts.personal}</span>
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-[0_2px_8px_oklch(var(--primary)/0.3)] text-muted-foreground hover:text-foreground hover:scale-105 transition-all duration-200 px-0 pb-3"
        >
          Done <span className="ml-2 text-xs transition-transform duration-200">{counts.completed}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
