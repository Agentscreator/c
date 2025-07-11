"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff, AlertCircle, User, Shield } from "lucide-react"
import Image from "next/image"
import { OnboardingFlow } from "./onboarding-flow"

interface AuthFlowProps {
  onAuthSuccess: (userType: "player" | "referee", isNewSignup: boolean) => void
  onBack: () => void
}

export function AuthFlow({ onAuthSuccess, onBack }: AuthFlowProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<"player" | "referee">("player")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreedToTerms: false,
    allowLocation: false,
    showPassword: false,
    showConfirmPassword: false,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.username, // Can be username or email
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // On successful login, go directly to the app without onboarding
        onAuthSuccess("player", false)
      } else {
        setError(data.message || "Invalid credentials")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupStart = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.phone) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    // Only start onboarding flow for signup
    setShowOnboarding(true)
    setOnboardingStep(1)
  }

  const handleOnboardingComplete = async (onboardingData: any) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          tagCode: onboardingData.tagCode,
          skillLevel: onboardingData.skillLevel,
          location: onboardingData.location,
          interests: onboardingData.interests,
          agreedToTerms: onboardingData.agreedToTerms,
          allowLocation: onboardingData.allowLocation,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onAuthSuccess(selectedRole, true)
      } else {
        setError(data.message || "Registration failed")
        setShowOnboarding(false) // Go back to signup form
      }
    } catch (err) {
      setError("Network error. Please try again.")
      setShowOnboarding(false) // Go back to signup form
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    if (isLogin) {
      handleLogin(e)
    } else {
      handleSignupStart(e)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    // Reset onboarding state when switching modes
    setShowOnboarding(false)
    setOnboardingStep(1)
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      agreedToTerms: false,
      allowLocation: false,
      showPassword: false,
      showConfirmPassword: false,
    })
  }

  const handleOnboardingBack = () => {
    setShowOnboarding(false)
    setOnboardingStep(1)
  }

  // Only show onboarding flow if in signup mode AND onboarding has been started
  if (!isLogin && showOnboarding) {
    return (
      <OnboardingFlow
        currentStep={onboardingStep}
        setCurrentStep={setOnboardingStep}
        onComplete={handleOnboardingComplete}
        onBack={handleOnboardingBack}
        userInfo={{
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
        }}
        isLoading={isLoading}
        error={error}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white p-0">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center space-x-3">
            <Image src="/logo-green.png" alt="CrosspointX" width={32} height={32} />
            <span className="text-xl font-bold">CrosspointX</span>
          </div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <Card className="w-full max-w-md bg-[#2D2D2D] border-gray-700 p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Join CrosspointX"}</h1>
              <p className="text-gray-400">{isLogin ? "Sign in to your account" : "Create your account"}</p>
            </div>

            {/* Role Selection (Signup only) */}
            {!isLogin && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">I am a:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("player")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === "player" ? "border-[#00FF41] bg-[#00FF41]/10" : "border-gray-600 bg-[#1A1A1A]"
                    }`}
                  >
                    <User
                      className={`w-6 h-6 mx-auto mb-2 ${selectedRole === "player" ? "text-[#00FF41]" : "text-gray-400"}`}
                    />
                    <div
                      className={`text-sm font-medium ${selectedRole === "player" ? "text-[#00FF41]" : "text-gray-300"}`}
                    >
                      Player
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole("referee")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === "referee" ? "border-[#FF6B35] bg-[#FF6B35]/10" : "border-gray-600 bg-[#1A1A1A]"
                    }`}
                  >
                    <Shield
                      className={`w-6 h-6 mx-auto mb-2 ${selectedRole === "referee" ? "text-[#FF6B35]" : "text-gray-400"}`}
                    />
                    <div
                      className={`text-sm font-medium ${selectedRole === "referee" ? "text-[#FF6B35]" : "text-gray-300"}`}
                    >
                      Referee
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username/Email */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  {isLogin ? "Username or Email" : "Username"}
                </label>
                <Input
                  placeholder={isLogin ? "Enter username or email" : "Choose username"}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-[#1A1A1A] border-gray-600 text-white placeholder-gray-500"
                  required
                />
              </div>

              {/* Email (signup only) */}
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-[#1A1A1A] border-gray-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              )}

              {/* Phone (signup only) */}
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Phone</label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-[#1A1A1A] border-gray-600 text-white placeholder-gray-500"
                    required
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Password</label>
                <div className="relative">
                  <Input
                    type={formData.showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Enter your password" : "Create secure password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-[#1A1A1A] border-gray-600 text-white placeholder-gray-500 pr-10"
                    required
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

              {/* Confirm Password (signup only) */}
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <Input
                      type={formData.showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="bg-[#1A1A1A] border-gray-600 text-white placeholder-gray-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, showConfirmPassword: !formData.showConfirmPassword })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {formData.showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400">{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-3 ${
                  !isLogin && selectedRole === "referee"
                    ? "bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
                    : "bg-[#00FF41] hover:bg-[#00FF41]/90 text-black"
                }`}
              >
                {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Continue to Setup"}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-white hover:text-[#00FF41] transition-colors font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <p className="text-sm text-gray-500">Secure authentication • SSL encrypted • Your data is protected</p>
      </div>
    </div>
  )
}