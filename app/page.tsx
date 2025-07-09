"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { AuthFlow } from "@/components/auth-flow"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { MainApp } from "@/components/main-app"
import { RefereeApp } from "@/components/referee-app"
import Image from "next/image"

type AppState = "landing" | "auth" | "onboarding" | "app"
type UserType = "player" | "referee"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("landing")
  const [userType, setUserType] = useState<UserType>("player")
  const [currentStep, setCurrentStep] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem("crosspointx-auth")
    const savedUserType = localStorage.getItem("crosspointx-user-type") as UserType
    if (authToken === "authenticated" && savedUserType) {
      setIsAuthenticated(true)
      setUserType(savedUserType)
      setAppState("app")
    }
  }, [])

  const handleGetStarted = () => {
    setAppState("auth")
  }

  const handleAuthSuccess = async (type: UserType) => {
    setIsLoading(true)
    setIsAuthenticated(true)
    setUserType(type)
    localStorage.setItem("crosspointx-auth", "authenticated")
    localStorage.setItem("crosspointx-user-type", type)

    // Small delay for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Referees skip onboarding and go straight to their dashboard
    if (type === "referee") {
      setAppState("app")
    } else {
      setAppState("onboarding")
      setCurrentStep(1) // Ensure we start at step 1
    }
    setIsLoading(false)
  }

  const handleOnboardingComplete = () => {
    setAppState("app")
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("crosspointx-auth")
    localStorage.removeItem("crosspointx-user-type")
    setCurrentStep(1)
    setAppState("landing")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Image
            src="/logo-green.png"
            alt="CrosspointX"
            width={64}
            height={64}
            className="mx-auto rounded-2xl animate-pulse"
          />
          <div className="text-white font-semibold">Loading CrosspointX...</div>
        </div>
      </div>
    )
  }

  switch (appState) {
    case "landing":
      return <LandingPage onGetStarted={handleGetStarted} />
    case "auth":
      return <AuthFlow onAuthSuccess={handleAuthSuccess} onBack={() => setAppState("landing")} />
    case "onboarding":
      return (
        <OnboardingFlow
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onComplete={handleOnboardingComplete}
        />
      )
    case "app":
      return userType === "referee" ? <RefereeApp onSignOut={handleSignOut} /> : <MainApp onSignOut={handleSignOut} />
    default:
      return <LandingPage onGetStarted={handleGetStarted} />
  }
}
