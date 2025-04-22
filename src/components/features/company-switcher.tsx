"use client"

import { useCompanyStore } from "@/store/useCompanyStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export function CompanySwitcher() {
  const { companies, currentCompany, setCurrentCompany } = useCompanyStore()

  if (!currentCompany || companies.length <= 1) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5">
          {currentCompany.logo ? (
            <Image
              src={currentCompany.logo}
              alt={currentCompany.name}
              width={24}
              height={24}
              className="rounded-sm"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-muted">
              {currentCompany.name[0]}
            </div>
          )}
          <span className="max-w-[120px] truncate font-medium">
            {currentCompany.name}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {companies.map((company) => (
          <DropdownMenuItem
            key={company.id}
            onSelect={() => setCurrentCompany(company)}
            className="flex items-center gap-2"
          >
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={20}
                height={20}
                className="rounded-sm"
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-muted text-xs">
                {company.name[0]}
              </div>
            )}
            <span className="truncate">{company.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}