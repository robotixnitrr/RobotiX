"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Sparkles, Zap } from "lucide-react"
import { ROUTES } from "@/lib/constants"
import dynamic from "next/dynamic"

// Dynamically import the 3D scene to avoid SSR issues
const JetsonNanoScene = dynamic(
  () => import("@/components/3d/jetson-nano-scene"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl flex items-center justify-center">
        <div className="text-primary animate-pulse">Loading 3D Scene...</div>
      </div>
    )
  }
)

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 sm:mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Welcome to the Future of Robotics</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 sm:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-primary to-primary/70 bg-clip-text text-transparent animate-gradient bg-[size:200%_auto]">
                ROBOTiX
              </span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-muted-foreground">
                Innovation Hub
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed font-light">
              Pioneering the next generation of robotics through 
              <span className="text-primary font-medium"> artificial intelligence</span>, 
              <span className="text-primary font-medium"> cutting-edge engineering</span>, and 
              <span className="text-primary font-medium"> collaborative innovation</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start items-center mb-8 sm:mb-12">
              <Link href={ROUTES.projects} className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-8 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  Explore Innovation
                  <ArrowRight className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={ROUTES.team} className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-8 rounded-full border-2 hover:bg-primary/5 transform hover:scale-105 transition-all duration-300 group backdrop-blur-sm"
                >
                  Meet Visionaries
                  <Users className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0">
              {[
                { number: "50+", label: "Active Members" },
                { number: "25+", label: "Projects Completed" },
                { number: "15+", label: "Awards Won" },
                { number: "100%", label: "Innovation Rate" }
              ].slice(0, 2).map((stat, index) => (
                <div key={index} className="text-center lg:text-left group">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - 3D Scene Integrated */}
          <div className="order-1 lg:order-2 h-[400px] sm:h-[500px] lg:h-[600px] w-full relative overflow-hidden">
            {/* 3D Jetson Nano Scene - Absolute positioned, no boundaries */}
            <div className="absolute inset-0 w-full h-full">
              <JetsonNanoScene />
            </div>
            
            {/* Floating Control Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-background/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/20">
                <span className="text-xs font-medium text-muted-foreground">Scroll to Zoom • Drag to Rotate • Click Button to Toggle AI</span>
              </div>
            </div>

            {/* Floating Tech Specs - Positioned to not interfere with 3D model */}
            <div className="absolute top-4 left-4 z-10 hidden lg:block">
              <div className="space-y-2">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
                  <div className="text-xs font-semibold text-primary mb-1">NVIDIA Jetson Nano</div>
                  <div className="text-xs text-muted-foreground">AI Computing Module</div>
                </div>
              </div>
            </div>

            {/* Quick Specs on Right */}
            <div className="absolute top-4 right-4 z-10 hidden lg:block">
              <div className="space-y-2">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-primary/20">
                  <div className="text-xs font-semibold text-primary">472 GFLOPS</div>
                  <div className="text-xs text-muted-foreground">AI Performance</div>
                </div>
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-primary/20">
                  <div className="text-xs font-semibold text-primary">4GB LPDDR4</div>
                  <div className="text-xs text-muted-foreground">Memory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  )
}