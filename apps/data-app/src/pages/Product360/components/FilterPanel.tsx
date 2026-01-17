import { type AttributeDefinition } from "@/utils/attributeUtils.ts";
import { Button } from "@unifirst/ui";
import { Label } from "@unifirst/ui";
import { Badge } from "@unifirst/ui";
import { ScrollArea } from "@unifirst/ui";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@unifirst/ui";
import { Filter, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@unifirst/ui";

export interface FilterOption {
  Id: number;
  TableName: string;
  Name: string;
}

interface FilterPanelProps {
  filters: Record<string, string>;
  onFilterChange: (filterKey: string, value: string) => void;
  onReset: () => void;
  attributes: AttributeDefinition[];
  attributeOptions: Record<string, FilterOption[]>;
}

const FilterPanel = ({
  filters,
  onFilterChange,
  onReset,
  attributes,
  attributeOptions,
}: FilterPanelProps) => {
  // Get active filter names by matching filter keys to attribute labels
  const activeFilters = Object.entries(filters)
    .filter(([, value]) => value !== "")
    .map(([key]) => {
      const attr = attributes.find((a) => a.id === key);
      return attr?.label || key;
    });

  const activeFilterCount = activeFilters.length;
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <Sheet>
      {/* Filter button - triggers the sheet (rounded pill style) */}
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-white hover:bg-gray-50 focus:outline-none transition-colors rounded-full"
        >
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>

          {/* Count badge */}
          {hasActiveFilters && (
            <Badge className="bg-unifirst-teal-600 text-white hover:bg-unifirst-teal-600 px-1.5 py-0 text-xs font-semibold min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[350px] sm:w-[400px] p-0">
        <SheetHeader className="p-6 pb-4 border-b bg-gray-50/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-gray-900">
              Filters
            </SheetTitle>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <>
                  <Badge
                    variant="secondary"
                    className="bg-unifirst-teal-100 text-unifirst-teal-700"
                  >
                    {activeFilterCount} active
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="h-7 px-2 text-gray-500 hover:text-red-600 hover:bg-red-50"
                    title="Clear all filters"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Clear</span>
                  </Button>
                </>
              )}
            </div>
          </div>
          <SheetDescription className="text-sm text-gray-500 mt-1">
            Refine your product search with the options below.
          </SheetDescription>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {activeFilters.map((name) => (
                <Badge
                  key={name}
                  variant="outline"
                  className="text-xs bg-unifirst-teal-50 text-unifirst-teal-700 border-unifirst-teal-200"
                >
                  {name}
                </Badge>
              ))}
            </div>
          )}
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Dynamic attribute filters */}
            {attributes.map((attr) => {
              const options = attributeOptions[attr.id] || [];
              const filterValue = filters[attr.id] || "";
              const hasValue = filterValue !== "";

              return (
                <div key={`${attr.id}-${attr.key}`}>
                  <Label
                    htmlFor={`${attr.id}-filter`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {attr.label}
                  </Label>
                  <Select
                    value={filterValue}
                    onValueChange={(value) =>
                      onFilterChange(attr.id, value === "-1" ? "" : value)
                    }
                  >
                    <SelectTrigger
                      id={`${attr.id}-filter`}
                      className={`w-full rounded-lg focus:ring-2 focus:ring-unifirst-teal-500 focus:border-unifirst-teal-500 transition-colors ${
                        hasValue
                          ? "border-unifirst-teal-500 ring-1 ring-unifirst-teal-500"
                          : "border-gray-300 hover:border-unifirst-teal-400"
                      }`}
                    >
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-1">- Select -</SelectItem>
                      {options.map((option) => (
                        <SelectItem
                          key={`${option.Id}_${option.TableName}`}
                          value={option.Name}
                        >
                          {option.Name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default FilterPanel;
