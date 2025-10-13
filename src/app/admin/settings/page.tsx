'use client'

import { useState, useEffect } from 'react'
import { Settings, Home, Mail, Save, Image, Tag, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import LoadingButton from '@/components/ui/loading-button'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string>('products')
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sectionProducts, setSectionProducts] = useState({
    dealOfTheDay: [] as string[],
    featuredSection: [] as string[],
    bestSeller: [] as string[],
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ]).then(([data, productsData]) => {
      if (data.sectionProducts) {
        const { newArrivals, trendingNow, ...rest } = data.sectionProducts
        setSectionProducts(rest)
      }
      setProducts(productsData || [])
    }).catch(() => {})
  }, [])

  const handleSave = async (section: string, tag: string, data: any) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag, data })
      })
      if (res.ok) {
        toast.success(`${section} settings saved successfully!`)
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const sections = [
    { id: 'products', name: 'Section Products', icon: Package, color: 'text-orange-600' },
  ]

  const sectionNames: Record<string, string> = {
    dealOfTheDay: 'Deal of the Day',
    featuredSection: 'Featured Section',
    bestSeller: 'Best Seller',
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="bg-white px-4 sm:px-6 py-4 sm:py-6 border-b shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage your store settings and content</p>
      </header>

      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Assign Products to Sections</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Select products to display in each homepage section</p>
          
          <div className="space-y-6">
            {Object.entries(sectionProducts).map(([key, selectedIds]) => (
              <div key={key} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{sectionNames[key]}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                  {products.map((product) => (
                    <label key={product.id} className="flex items-start gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={(e) => {
                          const updated = { ...sectionProducts }
                          if (e.target.checked) {
                            updated[key as keyof typeof sectionProducts] = [...selectedIds, product.id]
                          } else {
                            updated[key as keyof typeof sectionProducts] = selectedIds.filter(id => id !== product.id)
                          }
                          setSectionProducts(updated)
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">₹{product.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">{selectedIds.length} products selected</p>
              </div>
            ))}
          </div>
          
          <LoadingButton onClick={() => handleSave('Section products', 'sectionProducts', sectionProducts)} loading={isLoading} className="mt-4 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Product
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}
