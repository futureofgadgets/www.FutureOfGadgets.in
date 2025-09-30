'use client'

import { useSession } from 'next-auth/react'
import { notFound, useRouter } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import { ArrowLeft, ShoppingCart, Eye, Download, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { OrderProgress } from '@/components/order-progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Loading from '@/app/loading'

type Order = {
  id: string
  userId: string
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
  }
  items: {
    productId: string
    name: string
    price: number
    qty: number
  }[]
  total: number
  status: string
  statusHistory?: Array<{
    status: string
    timestamp: string
    note?: string
  }>
  address: {
    fullName: string
    phone: string
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
  }
  paymentMethod: string
  deliveryDate: string
  billUrl?: string
  createdAt: string
  updatedAt: string
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const resolvedParams = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadingBill, setUploadingBill] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showBillDialog, setShowBillDialog] = useState(false)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (status === 'loading' || !session || (session.user?.role !== 'admin' && session.user?.email !== 'admin@electronic.com')) {
      return
    }
    
    const fetchOrder = async () => {
      try {
        const [ordersResponse, productsResponse] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/products')
        ])
        
        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders')
        }
        
        const ordersData = await ordersResponse.json()
        const foundOrder = ordersData.orders.find((o: Order) => o.id === resolvedParams.id)
        if (!foundOrder) {
          notFound()
        }
        setOrder(foundOrder)
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(productsData)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        toast.error('Failed to load order')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [session, status, resolvedParams.id])

  if (status === 'loading' || loading) {
    return (
         <Loading/>
    )
  }

  if (!session || (session.user?.role !== 'admin' && session.user?.email !== 'admin@electronic.com')) {
    notFound()
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600">The order you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update order')
      }
      
      const data = await response.json()
      setOrder(data.order)
      toast.success('Order status updated successfully')
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleBillUpload = async (file: File) => {
    setUploadingBill(true)
    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB')
      }
      
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })
      
      const response = await fetch(`/api/admin/orders/${order.id}/bill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          billData: base64,
          fileName: file.name,
          fileType: file.type
        }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to upload bill')
      }
      
      toast.success('Bill uploaded successfully')
      
      // Refresh order data
      const ordersResponse = await fetch('/api/admin/orders')
      if (ordersResponse.ok) {
        const data = await ordersResponse.json()
        const updatedOrder = data.orders.find((o: Order) => o.id === order.id)
        if (updatedOrder) setOrder(updatedOrder)
      }
    } catch (error) {
      console.error('Error uploading bill:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload bill'
      toast.error(errorMessage)
    } finally {
      setUploadingBill(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/admin/orders')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.id.slice(-8)}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                ₹{order.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Payment: {order.paymentMethod.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId)
                  const imageUrl = product?.frontImage || product?.images?.[0] || '/placeholder-product.jpg'
                  return (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={imageUrl} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.jpg'
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                        <p className="text-sm text-gray-600">Unit Price: ₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200">
                  <span className="text-xl font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
              <OrderProgress status={order.status} statusHistory={order.statusHistory} />
            </div>
          </div>
          
          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium text-gray-900">{order.user.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium text-gray-900">{order.user.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-medium text-gray-900">{order.user.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{order.address.fullName}</p>
                <p className="text-gray-700">{order.address.line1}</p>
                {order.address.line2 && <p className="text-gray-700">{order.address.line2}</p>}
                <p className="text-gray-700">{order.address.city}, {order.address.state} {order.address.zip}</p>
                <p className="text-sm text-gray-600">Phone: {order.address.phone}</p>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={order.status}
                  onChange={(e) => {
                    const newStatus = e.target.value
                    const statusOrder = ['pending', 'paid', 'processing', 'shipped', 'out-for-delivery', 'delivered']
                    const currentIndex = statusOrder.indexOf(order.status)
                    const newIndex = statusOrder.indexOf(newStatus)
                    
                    if (newIndex < currentIndex) {
                      toast.error('Cannot revert order status')
                      return
                    }
                    
                    if (newStatus === 'delivered' && !order.billUrl) {
                      toast.error('Please upload bill before marking as delivered')
                      return
                    }
                    
                    handleStatusChange(newStatus)
                  }}
                  disabled={order.status === 'delivered' || updatingStatus}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    order.status === 'delivered' ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="pending" disabled={['paid', 'processing', 'shipped', 'out-for-delivery', 'delivered'].includes(order.status)}>Pending</option>
                  <option value="paid" disabled={['processing', 'shipped', 'out-for-delivery', 'delivered'].includes(order.status)}>Paid</option>
                  <option value="processing" disabled={['shipped', 'out-for-delivery', 'delivered'].includes(order.status)}>Processing</option>
                  <option value="shipped" disabled={['out-for-delivery', 'delivered'].includes(order.status)}>Shipped</option>
                  <option value="out-for-delivery" disabled={order.status === 'delivered'}>Out For Delivery</option>
                  <option value="delivered" disabled={!order.billUrl}>Delivered</option>
                </select>
                {updatingStatus && (
                  <div className="flex items-center gap-2 text-blue-600 mt-2">
                    <Loader2 className='h-4 w-4'/>
                    {/* <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div> */}
                    <span className="text-sm">Updating...</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Management
                </label>
                {order.billUrl ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="mb-3">
                      <p className="text-green-800 font-medium text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Bill uploaded
                      </p>
                      <p className="text-green-600 text-xs">Available for download</p>
                    </div>
                    {order.billUrl.startsWith('data:image/') && (
                      <div className="mb-3">
                        <img 
                          src={order.billUrl} 
                          alt="Bill" 
                          className="max-w-full h-20 object-contain rounded border bg-white"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Dialog open={showBillDialog} onOpenChange={setShowBillDialog}>
                        <DialogTrigger asChild>
                          <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 transition-colors">
                            <Eye className="h-4 w-4" />
                            View Bill
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Bill - Order #{order.id.slice(-8)}</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            {order.billUrl && (
                              <div className="text-center">
                                <img 
                                  src={order.billUrl} 
                                  alt="Bill" 
                                  className="max-w-full h-auto rounded border mx-auto"
                                />
                                <div className="mt-4">
                                  <button 
                                    onClick={() => {
                                      const link = document.createElement('a')
                                      link.href = order.billUrl!
                                      link.download = `bill-${order.id.slice(-8)}.${order.billUrl!.includes('data:image/') ? 'jpg' : 'pdf'}`
                                      document.body.appendChild(link)
                                      link.click()
                                      document.body.removeChild(link)
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center gap-2 mx-auto transition-colors"
                                  >
                                    <Download className="h-4 w-4" />
                                    Download Bill
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <button 
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = order.billUrl!
                          link.download = `bill-${order.id.slice(-8)}.${order.billUrl!.includes('data:image/') ? 'jpg' : 'pdf'}`
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center gap-2 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          e.target.value = ''
                          handleBillUpload(file)
                        }
                      }}
                      disabled={uploadingBill}
                      className="hidden"
                      id="bill-upload"
                    />
                    <label
                      htmlFor="bill-upload"
                      className={`cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium ${
                        uploadingBill ? 'pointer-events-none opacity-50' : ''
                      }`}
                    >
                      {uploadingBill ? 'Uploading...' : 'Upload Bill'}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}