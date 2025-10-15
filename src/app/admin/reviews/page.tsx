'use client'

import { useEffect, useState } from 'react'
import { Star, Trash2, MessageSquare, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import LoadingButton from '@/components/ui/loading-button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

type Review = {
  id: string
  productId: string
  userName: string
  rating: number
  comment: string
  adminReply?: string
  createdAt: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [replyLoading, setReplyLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [newReview, setNewReview] = useState({ productId: '', rating: 0, comment: '', userName: '' })
  const [addLoading, setAddLoading] = useState(false)
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products')
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      setReviews(data.reviews)
    } catch (error) {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async () => {
    if (!selectedReview || !replyText.trim()) return
    
    setReplyLoading(true)
    try {
      const res = await fetch(`/api/reviews/${selectedReview.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminReply: replyText })
      })
      
      if (res.ok) {
        toast.success('Reply added successfully')
        setShowReplyDialog(false)
        setReplyText('')
        fetchReviews()
      }
    } catch (error) {
      toast.error('Failed to add reply')
    } finally {
      setReplyLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteReviewId) return
    
    try {
      const res = await fetch(`/api/reviews/${deleteReviewId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Review deleted')
        fetchReviews()
        setDeleteReviewId(null)
      }
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const handleAddReview = async () => {
    if (!newReview.productId || !newReview.rating || !newReview.comment) {
      toast.error('Please fill all fields')
      return
    }
    
    setAddLoading(true)
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      })
      
      if (res.ok) {
        toast.success('Review added successfully')
        setShowAddDialog(false)
        setNewReview({ productId: '', rating: 0, comment: '', userName: '' })
        fetchReviews()
      }
    } catch (error) {
      toast.error('Failed to add review')
    } finally {
      setAddLoading(false)
    }
  }

 if (loading || !reviews)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm sm:text-base">Loading reviews...</p>
      </div>
    </div>
  );


  return (
    <div className="p-6 max-w-6xl ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Reviews</h1>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg "
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>
      
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No reviews yet</div>
        ) : reviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold">{review.userName}</div>
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                  ))}
                <div className="text-xs text-gray-500 ml-1">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
                  
                </div>
                
              </div>
              <div className="flex gap-2">
                {!review.adminReply && (
                  <button
                    onClick={() => {
                      setSelectedReview(review)
                      setReplyText(review.adminReply || '')
                      setShowReplyDialog(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setDeleteReviewId(review.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            
           <p className="text-gray-700 text-sm sm:text-base mb-3 break-words whitespace-pre-wrap">{review.comment}</p>
            
            {review.adminReply && (
              <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                <div className="text-sm font-semibold text-blue-900 mb-1">Admin Reply:</div>
                <div className="text-sm text-gray-700">{review.adminReply}</div>
              </div>
            )}
            
            
          </div>
        ))}
      </div>

      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowReplyDialog(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <LoadingButton
                onClick={handleReply}
                loading={replyLoading}
              >
                Submit Reply
              </LoadingButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Product</label>
              <Select value={newReview.productId} onValueChange={(value) => setNewReview({ ...newReview, productId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Customer Name</label>
              <input
                type="text"
                value={newReview.userName}
                onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                placeholder="Enter customer name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Write the review..."
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowAddDialog(false)
                  setNewReview({ productId: '', rating: 0, comment: '', userName: '' })
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <LoadingButton
                onClick={handleAddReview}
                loading={addLoading}
              >
                Add Review
              </LoadingButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteReviewId} onOpenChange={(open) => !open && setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
