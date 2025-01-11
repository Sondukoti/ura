import Head from 'next/head'
import Link from 'next/link'
import { FC } from 'react'

const Terms: FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Terms of Service</h1>
        <div className="space-y-4">
          <p>Last updated: March 2024</p>
          {/* Add your terms content here */}
          <h2 className="text-xl font-semibold mt-6">1. Terms</h2>
          <p>By accessing URA Dashboard, you agree to be bound by these terms of service...</p>
          {/* Add more sections */}
        </div>
      </div>
    </div>
  )
}

export default Terms 