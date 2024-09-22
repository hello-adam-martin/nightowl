import Link from 'next/link'
import { siteInfo } from '@/config/config'
import { Facebook, Twitter, Instagram } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <Image src="/NightOwl.png" alt="NightOwl Logo" width={40} height={40} className="mr-2" />
            <h3 className="text-lg font-semibold">{siteInfo.name}</h3>
          </div>
          <div className="text-sm">
            <p>{siteInfo.supportEmail} | {siteInfo.supportPhone}</p>
          </div>
          <div className="flex space-x-4">
            <Link href={siteInfo.socialMedia.facebook} className="text-gray-600 hover:text-blue-600">
              <Facebook size={20} />
            </Link>
            <Link href={siteInfo.socialMedia.twitter} className="text-gray-600 hover:text-blue-400">
              <Twitter size={20} />
            </Link>
            <Link href={siteInfo.socialMedia.instagram} className="text-gray-600 hover:text-pink-600">
              <Instagram size={20} />
            </Link>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} {siteInfo.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}