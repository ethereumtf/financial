'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Home, CreditCard, TrendingUp, ArrowLeftRight, Receipt, User, BarChart3, Zap, Wallet, DollarSign, Building2, Shield, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThemeGenerator } from '@/components/ThemeGenerator'
import { mockUser } from '@/lib/data'
import { cn } from '@/lib/utils'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    name: 'Accounts',
    icon: Wallet,
    subItems: [
      { name: 'Wallet', href: '/accounts/wallet', icon: Wallet },
      { name: 'Earn Interest', href: '/accounts/earn', icon: TrendingUp },
      { name: 'Fiat Gateway', href: '/accounts/fiat', icon: DollarSign },
      { name: 'Send Money', href: '/accounts/send', icon: ArrowLeftRight }
    ]
  },
  {
    name: 'Cards',
    icon: CreditCard,
    subItems: [
      { name: 'Overview', href: '/cards', icon: CreditCard },
      { name: 'Physical Card', href: '/cards/physical', icon: CreditCard },
      { name: 'Virtual Cards', href: '/cards/virtual', icon: CreditCard },
      { name: 'Rewards', href: '/cards/rewards', icon: TrendingUp },
      { name: 'Spending Controls', href: '/cards/controls', icon: Shield }
    ]
  },
  {
    name: 'Exchange',
    icon: ArrowLeftRight,
    subItems: [
      { name: 'Swap', href: '/swap', icon: ArrowLeftRight },
      { name: 'Bridge', href: '/bridge', icon: Zap },
      { name: 'Rates & Market', href: '/exchange', icon: BarChart3 }
    ]
  },
  {
    name: 'Invest',
    icon: TrendingUp,
    subItems: [
      { name: 'Portfolio Overview', href: '/invest', icon: TrendingUp },
      { name: 'Tokenized Assets', href: '/invest/assets', icon: BarChart3 },
      { name: 'Auto-Invest', href: '/invest/auto', icon: Zap },
      { name: 'Portfolio Analytics', href: '/invest/analytics', icon: BarChart3 }
    ]
  },
  {
    name: 'Loans',
    href: '/loans',
    icon: DollarSign
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: Receipt
  },
  {
    name: 'Business',
    href: '/business',
    icon: Building2
  },
  {
    name: 'Insurance',
    href: '/insurance',
    icon: Shield
  }
]

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['Accounts', 'Cards', 'Exchange', 'Invest'])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const NavLink = ({ item, mobile = false }: { item: any, mobile?: boolean }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = expandedItems.includes(item.name)
    const isActive = pathname === item.href || (hasSubItems && item.subItems.some((sub: any) => pathname === sub.href))
    const Icon = item.icon

    if (hasSubItems) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleExpanded(item.name)}
            className={cn(
              "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              mobile && "text-base"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              {item.name}
            </div>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {isExpanded && (
            <div className="ml-6 space-y-1">
              {item.subItems.map((subItem: any) => {
                const isSubActive = pathname === subItem.href
                const SubIcon = subItem.icon
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isSubActive 
                        ? "bg-emerald-100 text-emerald-700 border-l-2 border-emerald-500" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      mobile && "text-base"
                    )}
                  >
                    <SubIcon className="h-4 w-4" />
                    {subItem.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        href={item.href!}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          mobile && "text-base"
        )}
      >
        <Icon className="h-4 w-4" />
        {item.name}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <span className="text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">USD Financial</span>
              </Link>
            </div>
            <div className="flex-1">
              <nav className="grid gap-2 px-2 py-4">
                {navigationItems.map((item) => (
                  <NavLink key={item.href || item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </aside>

        <div className="flex flex-col">
          {/* Mobile Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="flex items-center gap-2 font-semibold mb-6">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">$</span>
                  </div>
                  <span className="text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">USD Financial</span>
                </div>
                <nav className="grid gap-2 text-lg font-medium">
                  {navigationItems.map((item) => (
                    <NavLink key={item.href || item.name} item={item} mobile />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <div className="h-6 w-6 rounded bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">$</span>
                </div>
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">USD Financial</span>
              </Link>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback>{mockUser.initials}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Desktop Header with User Menu */}
          <header className="hidden md:flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1" />
            <ThemeGenerator />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback>{mockUser.initials}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Main Content */}
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}