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
} from "lucide-react"
import Image from "next/image"

interface OnboardingFlowProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  onComplete: () => void
}

export function OnboardingFlow({ currentStep, setCurrentStep, onComplete }: OnboardingFlowProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    showPassword: false,
    skillLevel: "",
    location: "",
    interests: [] as string[],
  })

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
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
                <h1 className="text-xl sm:text-2xl font-bold text-white">Create Your Callsign</h1>
                <p className="text-gray-400 text-sm sm:text-base">Join 1,247 players nationwide</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Gaming Username (Callsign)</label>
                  <Input
                    placeholder="ShadowSniper"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                  />
                  {formData.username && <p className="text-xs text-[#00FF41] mt-1">✓ Username available</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Phone Number</label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="player@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Password</label>
                  <div className="relative">
                    <Input
                      type={formData.showPassword ? "text" : "password"}
                      placeholder="Create secure password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-[#404040] border-gray-500 text-white placeholder-gray-500 rounded-2xl py-3 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {formData.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-[#404040] rounded-xl">
                  <Shield className="w-5 h-5 text-[#00FF41]" />
                  <span className="text-sm">Bank-level security encryption</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-[#404040] rounded-xl">
                  <CreditCard className="w-5 h-5 text-[#00FF41]" />
                  <span className="text-sm">Multiple payment methods supported</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-[#404040] rounded-xl">
                  <DollarSign className="w-5 h-5 text-[#00FF41]" />
                  <span className="text-sm">Instant transfers and withdrawals</span>
                </div>
              </div>

              <Button
                onClick={nextStep}
                className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold rounded-2xl py-3 shadow-glow-green transition-all duration-300"
              >
                Activate Wallet
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
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
                      123 Main St
                      <br />
                      City, ST 12345
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
                    <input type="checkbox" className="w-4 h-4 text-[#00FF41] bg-[#404040] border-gray-600 rounded" />
                    <span className="text-sm">I agree to the Terms and Conditions</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-[#00FF41] bg-[#404040] border-gray-600 rounded" />
                    <span className="text-sm">Allow location access for nearby games</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={nextStep}
                className="w-full bg-[#00FF41] text-black hover:bg-[#00FF41]/90 font-semibold rounded-2xl py-3 shadow-glow-green transition-all duration-300"
              >
                Complete Setup
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
