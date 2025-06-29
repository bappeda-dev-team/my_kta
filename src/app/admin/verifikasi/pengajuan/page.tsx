'use client'

import { useRouter } from 'next/navigation'
import HeaderPengajuan from './header'

export default function PengajuanPage() {
  const router = useRouter()

  return (
    <>
      <HeaderPengajuan />
    </>

  )
}
