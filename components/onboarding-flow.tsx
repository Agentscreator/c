"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  ArrowRight,
  QrCode,
  Target,
  Eye,
  EyeOff,
  MapPin,
  Users,
  Trophy,
  CheckCircle,
  Wallet,
  Shield,
  CreditCard,
  DollarSign,
  Package,
  Plus,
  X,
  Lock,
} from "lucide-react"
import Image from "next/image"

interface OnboardingFlowProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  onComplete: (onboardingData: {
    tagCode?: string
    skillLevel?: string
    location?: string
    interests: string[]
    agreedToTerms: boolean
    allowLocation: boolean
    paymentMethodAdded?: boolean
  }) => void
  onBack: () => void
  userInfo?: {
    username?: string
    email?: string
    phone?: string
  }
  isLoading?: boolean
  error?: string
}

export function OnboardingFlow({ 
  currentStep, 
  setCurrentStep, 
  onComplete, 
  onBack,
  userInfo = {}, 
  isLoading = false, 
  error = "" 
}: OnboardingFlowProps) {
  const [formData, setFormData] = useState({
    tagCode: "",
    skillLevel: "",
    location: "",
    interests: [] as string[],
    agreedToTerms: false,
    allowLocation: false,
    showPassword: false,
    paymentMethodAdded: false,
  })

  const [walletStep, setWalletStep] = useState<'main' | 'add-payment' | 'processing'>('main')
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    zipCode: ''
  })

  // Provide default values for userInfo
  const safeUserInfo = {
    username: userInfo.username || 'Player',
    email: userInfo.email || 'player@example.com',
    phone: userInfo.phone || '+1 (555) 123-4567'
  }

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding and pass data back
      onComplete({
        tagCode: formData.tagCode,
        skillLevel: formData.skillLevel,
        location: formData.location,
        interests: formData.interests,
        agreedToTerms: formData.agreedToTerms,
        allowLocation: formData.allowLocation,
        paymentMethodAdded: formData.paymentMethodAdded,
      })
    }
  }

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleAddPaymentMethod = async () => {
    setWalletStep('processing')
    
    // Simulate Stripe payment method creation
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setFormData(prev => ({ ...prev, paymentMethodAdded: true }))
      setWalletStep('main')
    } catch (error) {
      console.error('Payment method creation failed:', error)
      setWalletStep('add-payment')
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#2A2A2A] text-white p-4 sm:p-6">
            <div className="w-full max-w-sm space-y-6 sm:space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <Image src="/logo-green.png" alt="CrosspointX" width={48} height={48} className="rounded-2xl" />
                  <span className="ml-3 text-xl sm:text-2xl font-bold text-white">CrosspointX</span>
                </div>
                <Badge className="bg-[#404040] border-[#00FF41] text-[#00FF41] rounded-xl px-4 py-2 shadow-glow-green">
                  Step 1 of 6
                </Badge>
              </div>

              <div className="relative">
                <div className="aspect-square bg-[#404040] rounded-3xl border-2 border-dashed border-[#00FF41] flex items-center justify-center shadow-soft">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <Camera className="w-16 h-16 text-[#00FF41] mx-auto" />
                      <Target className="w-8 h-8 text-[#FF6B35] absolute -top-2 -right-2" />
                    </div>
                    <QrCode className="w-12 h-12 text-gray-400 mx-auto" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-[#00FF41] rounded-2xl opacity-50"></div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Scan your CrosspointX tag to join</h1>
                <p className="text-gray-400 text-sm sm:text-base">Position the QR code within the targeting reticle</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={nextStep}
                  className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold rounded-2xl py-3 shadow-glow-green transition-all duration-300"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera Scan
                </Button>
                <Button
                  variant="outline"
                  onClick={nextStep}
                  className="w-full border-gray-500 text-gray-300 bg-transparent rounded-2xl py-3 hover:bg-gray-600/20"
                >
                  Enter Tag Code Manually
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Or enter tag code:</label>
                <Input
                  placeholder="Enter your tag code"
                  value={formData.tagCode}
                  onChange={(e) => setFormData({ ...formData, tagCode: e.target.value })}
                  className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#2A2A2A] text-white p-4 sm:p-6">
            <div className="w-full max-w-sm space-y-6 sm:space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <Image src="/logo-green.png" alt="CrosspointX" width={48} height={48} className="rounded-2xl" />
                  <span className="ml-3 text-xl sm:text-2xl font-bold text-white">CrosspointX</span>
                </div>
                <Badge className="bg-[#404040] border-[#00FF41] text-[#00FF41] rounded-xl px-4 py-2 shadow-glow-green">
                  Step 2 of 6
                </Badge>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Welcome, {safeUserInfo.username}!</h1>
                <p className="text-gray-400 text-sm sm:text-base">Join 1,247 players nationwide</p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#404040] rounded-2xl p-4">
                  <h3 className="font-semibold mb-2">Your Account Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Username:</span>
                      <span className="text-white">{safeUserInfo.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{safeUserInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white">{safeUserInfo.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Skill Level</label>
                  <select
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                    className="w-full bg-[#404040] border border-gray-500 text-white rounded-2xl py-3 px-4"
                  >
                    <option value="">Select your skill level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Location (City, State)</label>
                  <Input
                    placeholder="Los Angeles, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                  />
                </div>
              </div>

              <Button
                onClick={nextStep}
                className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold rounded-2xl py-3 shadow-glow-green transition-all duration-300"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#2A2A2A] text-white p-4 sm:p-6">
            <div className="w-full max-w-sm space-y-6 sm:space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <Image src="/logo-green.png" alt="CrosspointX" width={48} height={48} className="rounded-2xl" />
                  <span className="ml-3 text-xl sm:text-2xl font-bold text-white">CrosspointX</span>
                </div>
                <Badge className="bg-[#404040] border-[#00FF41] text-[#00FF41] rounded-xl px-4 py-2 shadow-glow-green">
                  Step 3 of 6
                </Badge>
              </div>

              {walletStep === 'main' && (
                <>
                  <div className="text-center space-y-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Activate Your Wallet</h1>
                    <p className="text-gray-400 text-sm sm:text-base">Secure payments for games and tournaments</p>
                  </div>

                  <div className="bg-gradient-to-r from-[#00FF41]/20 to-[#FF6B35]/20 border border-[#00FF41] rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-[#00FF41] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">CrosspointX Wallet</h3>
                    <p className="text-gray-300 text-sm mb-4">Load funds, track earnings, and pay for games seamlessly</p>
                    <div className="text-2xl font-bold text-[#00FF41] mb-2">$0.00</div>
                    <div className="text-xs text-gray-400">Starting Balance</div>
                  </div>

                  {formData.paymentMethodAdded && (
                    <div className="bg-[#404040] rounded-2xl p-4 border border-[#00FF41]/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#00FF41] rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-black" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">•••• •••• •••• 4242</div>
                          <div className="text-xs text-gray-400">Expires 12/28</div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-[#00FF41]" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-[#404040] rounded-xl">
                      <Shield className="w-5 h-5 text-[#00FF41]" />
                      <span className="text-sm">Bank-level security encryption</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-[#404040] rounded-xl">
                      <Lock className="w-5 h-5 text-[#00FF41]" />
                      <span className="text-sm">PCI DSS compliant payments</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-[#404040] rounded-xl">
                      <DollarSign className="w-5 h-5 text-[#00FF41]" />
                      <span className="text-sm">Instant transfers and withdrawals</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!formData.paymentMethodAdded && (
                      <Button
                        onClick={() => setWalletStep('add-payment')}
                        className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold rounded-2xl py-3 shadow-glow-green transition-all duration-300"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment Method
                      </Button>
                    )}
                    <Button
                      onClick={nextStep}
                      variant="outline"
                      className="w-full border-gray-500 text-gray-300 bg-transparent rounded-2xl py-3 hover:bg-gray-600/20"
                    >
                      {formData.paymentMethodAdded ? 'Continue' : 'Skip for Now'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}

              {walletStep === 'add-payment' && (
                <>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setWalletStep('main')}
                      className="p-2 rounded-lg bg-[#404040] hover:bg-[#505050] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h1 className="text-xl font-bold text-white">Add Payment Method</h1>
                    <div className="w-9 h-9"></div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Cardholder Name</label>
                      <Input
                        placeholder="John Doe"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Card Number</label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                        maxLength={19}
                        className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Expiry Date</label>
                        <Input
                          placeholder="MM/YY"
                          value={cardData.expiryDate}
                          onChange={(e) => setCardData({ ...cardData, expiryDate: formatExpiryDate(e.target.value) })}
                          maxLength={5}
                          className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">CVV</label>
                        <Input
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          maxLength={3}
                          className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Billing ZIP Code</label>
                      <Input
                        placeholder="90210"
                        value={cardData.zipCode}
                        onChange={(e) => setCardData({ ...cardData, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                        maxLength={5}
                        className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                      />
                    </div>

                    <div className="bg-[#404040] rounded-xl p-3 flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-[#00FF41]" />
                      <span className="text-xs text-gray-400">
                        Your payment information is encrypted and secure
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddPaymentMethod}
                    disabled={!cardData.name || !cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.zipCode}
                    className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold rounded-2xl py-3 shadow-glow-green transition-all duration-300 disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </>
              )}

              {walletStep === 'processing' && (
                <>
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-[#00FF41] rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <CreditCard className="w-10 h-10 text-black" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white mb-2">Processing Payment Method</h1>
                      <p className="text-gray-400 text-sm">Securely adding your card...</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF41]"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#2A2A2A] text-white p-4 sm:p-6">
            <div className="w-full max-w-sm space-y-6 sm:space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <Image src="/logo-green.png" alt="CrosspointX" width={48} height={48} className="rounded-2xl" />
                  <span className="ml-3 text-xl sm:text-2xl font-bold text-white">CrosspointX</span>
                </div>
                <Badge className="bg-[#404040] border-[#00FF41] text-[#00FF41] rounded-xl px-4 py-2 shadow-glow-green">
                  Step 4 of 6
                </Badge>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">What Interests You?</h1>
                <p className="text-gray-400 text-sm sm:text-base">Select all that apply</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "speedball", label: "Speedball", icon: Target },
                  { id: "woodsball", label: "Woodsball", icon: MapPin },
                  { id: "tournaments", label: "Tournaments", icon: Trophy },
                  { id: "casual", label: "Casual Play", icon: Users },
                ].map((interest) => {
                  const Icon = interest.icon
                  const isSelected = formData.interests.includes(interest.id)
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${
                        isSelected
                          ? "border-[#00FF41] bg-[#00FF41]/10"
                          : "border-gray-600 bg-[#404040] hover:border-gray-500"
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? "text-[#00FF41]" : "text-gray-400"}`} />
                      <div className={`text-sm font-medium ${isSelected ? "text-[#00FF41]" : "text-gray-300"}`}>
                        {interest.label}
                      </div>
                    </button>
                  )
                })}
              </div>

              <Button
                onClick={nextStep}
                disabled={formData.interests.length === 0}
                className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold rounded-2xl py-3 shadow-glow-green transition-all duration-300 disabled:opacity-50"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#2A2A2A] text-white p-4 sm:p-6">
            <div className="w-full max-w-sm space-y-6 sm:space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <Image src="/logo-green.png" alt="CrosspointX" width={48} height={48} className="rounded-2xl" />
                  <span className="ml-3 text-xl sm:text-2xl font-bold text-white">CrosspointX</span>
                </div>
                <Badge className="bg-[#404040] border-[#00FF41] text-[#00FF41] rounded-xl px-4 py-2 shadow-glow-green">
                  Step 5 of 6
                </Badge>
              </div>

              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-[#00FF41] rounded-full flex items-center justify-center mx-auto">
                  <Package className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Viral Kit Confirmed!</h1>
                  <p className="text-[#00FF41] text-sm sm:text-base font-medium">
                    Your 4 physical tags are being shipped
                  </p>
                </div>
              </div>

              <div className="bg-[#404040] rounded-2xl p-4 space-y-3">
                <h3 className="font-semibold text-center mb-3">Shipping Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Shipping to:</span>
                    <div className="text-white mt-1">
                      {formData.location || "Your Address"}
                      <br />
                      (Address will be collected at checkout)
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-600">
                    <span className="text-gray-400">Estimated delivery:</span>
                    <span className="text-[#00FF41]">3-5 business days</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-4">Track your shipment via email confirmation</p>
              </div>
              <Button
                onClick={nextStep}
                className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold rounded-2xl py-3 shadow-glow-green transition-all duration-300"
              >
                Find Your First Game
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#2A2A2A] text-white p-4 sm:p-6">
            <div className="w-full max-w-sm space-y-6 sm:space-y-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <Image src="/logo-green.png" alt="CrosspointX" width={48} height={48} className="rounded-2xl" />
                  <span className="ml-3 text-xl sm:text-2xl font-bold text-white">CrosspointX</span>
                </div>
                <Badge className="bg-[#404040] border-[#00FF41] text-[#00FF41] rounded-xl px-4 py-2 shadow-glow-green">
                  Step 6 of 6

                </Badge>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Terms & Location Access</h1>
                <p className="text-gray-400 text-sm sm:text-base">Final step to complete your account</p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#404040] rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <MapPin className="w-5 h-5 text-[#00FF41]" />
                    <span className="font-medium">Location Access Required</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    We need your location to show nearby games and calculate distances to paintball fields.
                  </p>
                </div>

                <div className="bg-[#404040] rounded-2xl p-4 max-h-32 overflow-y-auto">
                  <h3 className="font-medium mb-2">Terms and Conditions</h3>
                  <div className="text-xs text-gray-400 space-y-2">
                    <p>By using CrosspointX, you agree to our terms of service and privacy policy.</p>
                    <p>• You must be 18+ or have parental consent</p>
                    <p>• Follow all safety guidelines during games</p>
                    <p>• Respect other players and referees</p>
                    <p>• No refunds for missed games without 24hr notice</p>
                    <p>• Location data used only for game matching</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={formData.agreedToTerms}
                      onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                      className="w-4 h-4 text-[#00FF41] bg-[#404040] border-gray-600 rounded" 
                    />
                    <span className="text-sm">I agree to the Terms and Conditions</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      checked={formData.allowLocation}
                      onChange={(e) => setFormData({ ...formData, allowLocation: e.target.checked })}
                      className="w-4 h-4 text-[#00FF41] bg-[#404040] border-gray-600 rounded" 
                    />
                    <span className="text-sm">Allow location access for nearby games</span>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-red-400">{error}</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={nextStep}
                disabled={!formData.agreedToTerms || !formData.allowLocation || isLoading}
                className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold rounded-2xl py-3 shadow-glow-green transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Complete Setup"}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return renderStep()
}