import { AppShell } from '@/components/AppShell'

export default function BridgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}