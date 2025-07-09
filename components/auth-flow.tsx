"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle, User, Shield } from "lucide-react"
import Image from "next/image"

interface AuthFlowProps {
  onAuthSuccess: (userType: "player" | "referee") => void
  onBack: () => void
}

export function AuthFlow({ onAuthSuccess, onBack }: AuthFlowProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<"player" | "referee">("player")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (isLogin) {
      // Fake authentication - check for specific credentials
      if (formData.username === "1234" && formData.password === "12345678") {
        onAuthSuccess("player")
      } else if (formData.username === "ref1" && formData.password === "referee123") {
        onAuthSuccess("referee")
      } else {
        setError("Invalid credentials. Try: 1234/12345678 (Player) or ref1/referee123 (Referee)")
      }
    } else {
      // Fake signup - just validate fields
      if (!formData.username || !formData.email || !formData.password) {
        setError("Please fill in all fields")
      } else if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match")
      } else if (formData.password.length < 8) {
        setError("Password must be at least 8 characters")
      } else {
        onAuthSuccess(selectedRole)
      }
    }

    setIsLoading(false)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
    })
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

            {/* Demo Credentials */}
            {isLogin && (
              <div className="bg-[#00FF41]/10 border border-[#00FF41]/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-[#00FF41]" />
                  <span className="text-sm font-medium text-[#00FF41]">Demo Credentials</span>
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>
                    Player: <span className="text-[#00FF41] font-mono">1234</span> /{" "}
                    <span className="text-[#00FF41] font-mono">12345678</span>
                  </div>
                  <div>
                    Referee: <span className="text-[#FF6B35] font-mono">ref1</span> /{" "}
                    <span className="text-[#FF6B35] font-mono">referee123</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
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
                {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-gray-400 hover:text-[#00FF41] transition-colors"
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
