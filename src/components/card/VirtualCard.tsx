'use client'

import { Wifi } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface VirtualCardProps {
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  className?: string
}

export function VirtualCard({ 
  cardNumber = "•••• •••• •••• 1234",
  cardHolder = "Alex Johnson",
  expiryDate = "12/28",
  className = ""
}: VirtualCardProps) {
  return (
    <Card className={`overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 shadow-2xl ${className}`}>
      <CardContent className="p-8 text-white relative h-56 flex flex-col justify-between">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_70%)]" />
        
        {/* Top Row */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-xs text-white/60 font-medium tracking-wider">USD FINANCIAL</div>
            <div className="text-sm text-white/80 font-medium">TITANIUM</div>
          </div>
          <Wifi className="h-6 w-6 text-white/60" />
        </div>
        
        {/* Card Number */}
        <div className="relative z-10">
          <div className="text-2xl font-mono tracking-widest text-white/90 mb-2">
            {cardNumber}
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
        </div>
        
        {/* Bottom Row */}
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <div className="text-xs text-white/60 mb-1 font-medium tracking-wider">CARD HOLDER</div>
            <div className="font-medium text-white/90">{cardHolder}</div>
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1 font-medium tracking-wider">EXPIRES</div>
            <div className="font-medium text-white/90">{expiryDate}</div>
          </div>
        </div>
        
        {/* Chip */}
        <div className="absolute top-24 left-8 w-12 h-8 rounded-md bg-gradient-to-br from-amber-400 to-orange-500" />
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
      </CardContent>
    </Card>
  )
}