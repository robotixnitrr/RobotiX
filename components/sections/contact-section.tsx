"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Mail, Phone, MapPin, Calendar, Send, Sparkles, Globe, Users2, Zap } from "lucide-react"
import { ROUTES } from "@/lib/constants"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setFormData({ name: "", email: "", message: "" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "robotixclub@nitrr.ac.in",
      description: "Drop us a line anytime",
      color: "from-blue-500 via-blue-600 to-blue-700",
      glowColor: "shadow-blue-500/25"
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Engineering Building, Room 301",
      subtitle: "University Campus",
      description: "Visit our innovation hub",
      color: "from-emerald-500 via-emerald-600 to-emerald-700",
      glowColor: "shadow-emerald-500/25"
    },
    {
      icon: Calendar,
      title: "Meeting Times",
      content: "Fridays 6:00 PM - 8:00 PM",
      description: "Join our weekly sessions",
      color: "from-purple-500 via-purple-600 to-purple-700",
      glowColor: "shadow-purple-500/25"
    },
  ]

  const stats = [
    { icon: Users2, value: "200+", label: "Active Members" },
    { icon: Zap, value: "50+", label: "Projects Completed" },
    { icon: Globe, value: "15+", label: "Industry Partners" },
  ]

  return (
    <section id="contact" className="relative py-16 sm:py-24 md:py-32 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header with floating elements */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 relative">
          <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full animate-pulse"></div>
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full mb-4 sm:mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-primary">Let's Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent px-4">
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Ready to join our community of innovators or collaborate on 
            <span className="text-primary font-semibold"> groundbreaking projects</span>?
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 text-center hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8 mb-8 lg:mb-0">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-3">
                <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-primary to-purple-600 rounded-full"></div>
                Connect With Us
              </h3>
              
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className={`group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:${info.glowColor} hover:-translate-y-1`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 flex items-start gap-3 sm:gap-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <info.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg sm:text-xl font-bold mb-1">{info.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{info.description}</p>
                      <p className="font-semibold text-foreground">{info.content}</p>
                      {info.subtitle && (
                        <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div className="relative">
            <Card className="relative bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-lg"></div>
              <CardHeader className="relative z-10 text-center pb-4 sm:pb-6 p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                  <Send className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold">Send us a Message</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Let's discuss your ideas and bring them to life together
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative group">
                      <Input
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-10 sm:h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-primary/50"
                      />
                    </div>
                    <div className="relative group">
                      <Input
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-10 sm:h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-primary/50"
                      />
                    </div>
                    <div className="relative group">
                      <Textarea
                        name="message"
                        placeholder="Tell us about your project ideas or questions..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="bg-background/50 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 group-hover:border-primary/50 resize-none"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Send Message
                        <Send className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-4 text-muted-foreground">or</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Link href={ROUTES.register} className="w-full">
                    <Button variant="outline" className="w-full h-12 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center gap-2">
                        <Users2 className="w-4 h-4" />
                        Join Club
                      </div>
                    </Button>
                  </Link>
                  <Link href={ROUTES.login} className="w-full">
                    <Button variant="outline" className="w-full h-12 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Member Login
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}