import Link from 'next/link'
import { siteInfo } from '@/config/config'
import { Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center md:justify-items-stretch">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">{siteInfo.name}</h3>
            <p className="text-sm">{siteInfo.shortDescription}</p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">Email: {siteInfo.supportEmail}</p>
            <p className="text-sm">Phone: {siteInfo.supportPhone}</p>
          </div>
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <Link href={siteInfo.socialMedia.facebook} className="text-gray-600 hover:text-blue-600">
                <Facebook size={24} />
              </Link>
              <Link href={siteInfo.socialMedia.twitter} className="text-gray-600 hover:text-blue-400">
                <Twitter size={24} />
              </Link>
              <Link href={siteInfo.socialMedia.instagram} className="text-gray-600 hover:text-pink-600">
                <Instagram size={24} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} {siteInfo.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}