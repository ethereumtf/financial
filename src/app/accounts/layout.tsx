import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accounts - USD Financial',
  description: 'Manage your stablecoin accounts, earn interest, and handle fiat transactions',
}

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}