'use client'

import { useState } from 'react'
import { X, Mail, User, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  email: string
}

interface FormErrors {
  name?: string
  email?: string
  submit?: string
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // For demo purposes, simulate API call
      // In production, this would call your backend service or use a form service like Netlify Forms
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Log the submission (in production, send to your backend)
      console.log('Waitlist submission:', formData)
      
      setIsSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '' })
        setIsSuccess(false)
        onClose()
      }, 2000)

    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleClose = () => {
    if (isSubmitting) return // Prevent closing during submission
    setFormData({ name: '', email: '' })
    setErrors({})
    setIsSuccess(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            {isSuccess ? (
              <CheckCircle2 className="h-8 w-8 text-white" />
            ) : (
              <Sparkles className="h-8 w-8 text-white" />
            )}
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {isSuccess ? 'Welcome to the Future!' : 'Join the Waitlist'}
          </DialogTitle>
          <p className="text-slate-600 leading-relaxed">
            {isSuccess 
              ? "You're all set! We'll notify you as soon as USD Financial launches."
              : "Be among the first to experience the future of stablecoin finance. Get early access and exclusive benefits."
            }
          </p>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  className={`pl-10 h-12 border-2 rounded-lg transition-all duration-200 ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={`pl-10 h-12 border-2 rounded-lg transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <X className="h-4 w-4" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Joining Waitlist...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Join Waitlist
                </>
              )}
            </Button>

            {/* Benefits */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 text-center">
                By joining, you'll get early access, exclusive rates, and be first to try new features.
              </p>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="space-y-4">
              <div className="text-emerald-600 font-medium">
                ✨ You're on the list! ✨
              </div>
              <p className="text-sm text-slate-600">
                We'll send you updates and early access information to{' '}
                <span className="font-medium text-slate-900">{formData.email}</span>
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}