"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterState {
  search: string
  plant: string
  collar: string
  department: string
  salaryType: string
  sortBy: string
}

export function FilterNavbar() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    plant: "",
    collar: "",
    department: "",
    salaryType: "",
    sortBy: "newest",
  })

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      plant: "",
      collar: "",
      department: "",
      salaryType: "",
      sortBy: "newest",
    })
  }

  const activeFiltersCount = Object.values(filters).filter((value) => value && value !== "newest").length

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="salary">Salary</SelectItem>
          </SelectContent>
        </Select>

        {/* Plant Filter */}
        <Select value={filters.plant} onValueChange={(value) => updateFilter("plant", value)}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Plant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CHU">CHU</SelectItem>
            <SelectItem value="SSD">SSD</SelectItem>
          </SelectContent>
        </Select>

        {/* Collar Filter */}
        <Select value={filters.collar} onValueChange={(value) => updateFilter("collar", value)}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Collar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blue">Blue</SelectItem>
            <SelectItem value="white">White</SelectItem>
            <SelectItem value="gray">Gray</SelectItem>
          </SelectContent>
        </Select>

        {/* Department Filter */}
        <Select value={filters.department} onValueChange={(value) => updateFilter("department", value)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="quality">Quality</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="admin">Administration</SelectItem>
          </SelectContent>
        </Select>

        {/* Salary Type Filter */}
        <Select value={filters.salaryType} onValueChange={(value) => updateFilter("salaryType", value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Salary" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="2weeks">Bi-weekly</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  )
}
