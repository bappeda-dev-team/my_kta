'use client'

import { useRouter } from 'next/navigation'

import HeaderPengajuanKTA from './header'

export default function PengajuanPage() {
  const router = useRouter()

  return (
    <>
      <HeaderPengajuanKTA />
    </>
  )
}
