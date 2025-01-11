import Head from 'next/head'
import Link from 'next/link'
import { FC } from 'react'

const Contact: FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-purple-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea 
              className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-purple-500 h-32"
              placeholder="How can we help?"
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact 