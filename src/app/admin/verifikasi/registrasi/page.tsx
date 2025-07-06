'use client'

import { useRouter } from 'next/navigation'
import HeaderRegistrasiKTA from './header'

export default function PengajuanPage() {
  const router = useRouter()

  return (
      <>
      <HeaderRegistrasiKTA />
      </>
  )
}
