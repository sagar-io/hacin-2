"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Copy, Star, Share2, Loader2 } from "lucide-react"
import { ExperienceCard } from "@/components/affiliate/experience-card"
import { ProfileHeader } from "@/components/affiliate/profile-header"

// Mock data structure that would come from the API
interface AffiliateData {
  influencer: {
    name: string
    username: string
    bio: string
    avatar: string
    followers: string
    experiences: number
    countries: number
    socialLinks: {
      instagram: string
      youtube: string
      website: string
    }
  }
  experiences: Array<{
    id: string
    title: string
    location: string
    price: string
    rating: number
    reviews: number
    duration: string
    category: string
    image: string
    description: string
  }>
}

// Mock API response
const getMockAffiliateData = (affiliateId: string): AffiliateData => ({
  influencer: {
    name: "Sarah Johnson",
    username: "@sarahtravels",
    bio: "Travel enthusiast & adventure seeker 🌍 Sharing amazing experiences from around the globe ✈️ Partnered with Headout for the best travel deals!",
    avatar: "/placeholder.svg?height=120&width=120",
    followers: "125K",
    experiences: 47,
    countries: 23,
    socialLinks: {
      instagram: "https://instagram.com/sarahtravels",
      youtube: "https://youtube.com/sarahtravels",
      website: "https://sarahtravels.com",
    },
  },
  experiences: [
    {
      id: "exp-001",
      title: "Dubai Desert Safari with BBQ Dinner",
      location: "Dubai, UAE",
      price: "$45",
      rating: 4.8,
      reviews: 2847,
      duration: "6 hours",
      category: "Adventure",
      image: "/placeholder.svg?height=200&width=300",
      description: "Experience the thrill of dune bashing and enjoy a traditional BBQ dinner under the stars.",
    },
    {
      id: "exp-002",
      title: "Burj Khalifa At The Top Experience",
      location: "Dubai, UAE",
      price: "$35",
      rating: 4.9,
      reviews: 5632,
      duration: "2 hours",
      category: "Sightseeing",
      image: "/placeholder.svg?height=200&width=300",
      description: "Visit the world's tallest building and enjoy breathtaking views from the observation deck.",
    },
    // ... (keep other experiences)
  ],
})

// Add this after the AffiliateData interface
const HARDCODED_EXPERIENCES = [
  {
    id: "3586",
    title: "Museo del Prado Tickets with Optional Audio Guide",
    location: "Madrid, MADRID",
    price: "EUR 22.5",
    rating: 4.5,
    reviews: 5649,
    duration: "Explore at your pace",
    category: "Activity",
    image: "https://cdn-imgix.headout.com/media/images/50bae31b370027fe4798b664858fa80a-3586-10.jpg",
    description: "Experience description will be fetched from the API."
  },
  {
    id: "8541",
    title: "Dubai Frame Skip-the-Line Tickets",
    location: "Dubai, UAE",
    price: "AED 48",
    rating: 4.4,
    reviews: 13119,
    duration: "Choose your entry time",
    category: "Landmarks",
    image: "https://cdn-imgix.headout.com/media/images/6c6519b8db7ddab3f5381d54ee30032a-Frame-banner.jpg",
    description: "Get stunning views of old and new Dubai from the world's largest frame structure."
  },
  {
    id: "7123",
    title: "Louvre Museum Skip-the-Line Guided Tour",
    location: "Paris, FRANCE",
    price: "EUR 65",
    rating: 4.7,
    reviews: 8234,
    duration: "2.5 hours",
    category: "Museums",
    image: "https://cdn-imgix.headout.com/media/images/6c6519b8db7ddab3f5381d54ee30032a-Frame-banner.jpg",
    description: "Explore the world's most visited museum with an expert guide."
  },
  {
    id: "5492",
    title: "Universal Studios Singapore™ One-Day Ticket",
    location: "Singapore, SINGAPORE",
    price: "SGD 98",
    rating: 4.6,
    reviews: 15678,
    duration: "Full day access",
    category: "Theme Parks",
    image: "https://cdn-imgix.headout.com/media/images/6c6519b8db7ddab3f5381d54ee30032a-Frame-banner.jpg",
    description: "Experience Southeast Asia's first Hollywood movie theme park."
  },
  {
    id: "9234",
    title: "Burj Khalifa: At the Top (Level 124 & 125)",
    location: "Dubai, UAE",
    price: "AED 169",
    rating: 4.8,
    reviews: 21543,
    duration: "1.5 hours",
    category: "Landmarks",
    image: "https://cdn-imgix.headout.com/media/images/6c6519b8db7ddab3f5381d54ee30032a-Frame-banner.jpg",
    description: "Visit the world's tallest building for breathtaking views of Dubai."
  },
  {
    id: "6378",
    title: "Tokyo Disneyland 1-Day Passport",
    location: "Tokyo, JAPAN",
    price: "JPY 8,400",
    rating: 4.9,
    reviews: 18965,
    duration: "Full day access",
    category: "Theme Parks",
    image: "https://cdn-imgix.headout.com/media/images/6c6519b8db7ddab3f5381d54ee30032a-Frame-banner.jpg",
    description: "Experience the magic of Disney in Tokyo."
  },
];

export default function AffiliateDashboard({ params }: { params: Promise<{ affiliateId: string }> }) {
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null)
  const [filteredExperiences, setFilteredExperiences] = useState(HARDCODED_EXPERIENCES)
  const [copied, setCopied] = useState(false)
  const [isCreatingLanding, setIsCreatingLanding] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedModalExperiences, setSelectedModalExperiences] = useState<string[]>([])
  const [isCreatingLandingPage, setIsCreatingLandingPage] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [landingPageId, setLandingPageId] = useState<string>("")

  // Fetch affiliate data
  useEffect(() => {
    const initializeAffiliate = async () => {
      try {
        // Initialize influencer data
        const influencerResponse = await fetch('https://googlettd.api.dev-headout.com/api/v8/affiliate/influencers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: '13039135',
            socialMediaLinks: "https://instagram.com/travelblogger",
            followerCount: 10
          })
        });

        if (!influencerResponse.ok) {
          console.error('Failed to initialize influencer:', await influencerResponse.text());
        }

        // Use hardcoded experiences
        const mockData = {
          ...getMockAffiliateData(resolvedParams.affiliateId),
          experiences: HARDCODED_EXPERIENCES
        }
        setAffiliateData(mockData)
        setFilteredExperiences(HARDCODED_EXPERIENCES)
      } catch (error) {
        console.error('Error initializing affiliate data:', error);
        // Still set hardcoded data even if API fails
        const mockData = {
          ...getMockAffiliateData(resolvedParams.affiliateId),
          experiences: HARDCODED_EXPERIENCES
        }
        setAffiliateData(mockData)
        setFilteredExperiences(HARDCODED_EXPERIENCES)
      }
    };

    initializeAffiliate();
  }, [resolvedParams.affiliateId])

  // Load selected experiences from URL on mount
  useEffect(() => {
    const experienceIds = searchParams.get("experiences")
    if (experienceIds) {
      const ids = experienceIds.split(",")
      setSelectedExperiences((prev) => {
        if (JSON.stringify(prev.sort()) !== JSON.stringify(ids.sort())) {
          return ids
        }
        return prev
      })
    } else {
      setSelectedExperiences((prev) => (prev.length > 0 ? [] : prev))
    }
  }, [searchParams.get("experiences")])

  const toggleExperience = (experienceId: string) => {
    const newSelected = selectedExperiences.includes(experienceId)
      ? selectedExperiences.filter((id) => id !== experienceId)
      : [...selectedExperiences, experienceId]

    setSelectedExperiences(newSelected)

    setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      if (newSelected.length > 0) {
        params.set("experiences", newSelected.join(","))
      } else {
        params.delete("experiences")
      }
      const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`
      window.history.replaceState({}, "", newUrl)
    }, 0)
  }

  const getShareableUrl = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    return `${baseUrl}/affiliate-recommendations/${resolvedParams.affiliateId}${
      selectedExperiences.length > 0 ? `?experiences=${selectedExperiences.join(",")}` : ""
    }`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareableUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleCreateLandingPage = async () => {
    if (isCreatingLandingPage) return
    
    setIsCreatingLandingPage(true)
    try {
      const selectedExperiences = HARDCODED_EXPERIENCES.filter(exp => 
        selectedModalExperiences.includes(exp.id)
      )
      
      const response = await fetch('https://googlettd.api.dev-headout.com/api/v8/affiliate/landing-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '13039135',
          tourIds: selectedExperiences.map(exp => parseInt(exp.id)),
          status: "PUBLISHED",
          lastVisitedDate: "2023-06-15",
          portfolioName: "My European Adventure",
          experienceText: "Here are my favorite tours in Europe!"
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create landing page')
      }

      const data = await response.json()
      console.log('Landing page created:', data)
      setLandingPageId(data.pageId)
      setIsModalOpen(false)
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error creating landing page:', error)
      // TODO: Show error message
    } finally {
      setIsCreatingLandingPage(false)
    }
  }

  // Add this useEffect to initialize modal selections
  useEffect(() => {
    if (isModalOpen) {
      setSelectedModalExperiences(selectedExperiences)
    }
  }, [isModalOpen])

  // Add this function to handle modal experience selection
  const toggleModalExperience = (experienceId: string) => {
    setSelectedModalExperiences(prev => 
      prev.includes(experienceId) 
        ? prev.filter(id => id !== experienceId)
        : [...prev, experienceId]
    )
  }

  if (!affiliateData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-[#8000FF] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading affiliate data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#8000FF] to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Headout</span>
            </div>
            {selectedExperiences.length > 0 && (
              <Button onClick={copyToClipboard} size="sm" className="bg-[#8000FF] hover:bg-purple-700 text-white">
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Share Portfolio"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <ProfileHeader influencer={affiliateData.influencer} />

      <div className="container mx-auto px-4 py-8">
        {/* Selected Experiences Summary */}
        {selectedExperiences.length > 0 && (
          <div className="mb-6">
            <Card className="border-2 border-[#8000FF] bg-gradient-to-r from-purple-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#8000FF]">
                    <Share2 className="w-5 h-5 mr-2" />
                    <span className="font-semibold">
                      {selectedExperiences.length} experiences selected for your portfolio
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Selected experiences appear at the top</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              variant="grid"
              isSelected={selectedExperiences.includes(experience.id)}
              onSelect={() => toggleExperience(experience.id)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#8000FF] hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-w-[200px]"
          >
            Create Landing Page
          </Button>
        </div>

        {/* Experience Selection Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Experiences for Your Landing Page</DialogTitle>
              <DialogDescription>
                Choose the experiences you want to feature on your landing page.
              </DialogDescription>
            </DialogHeader>

            {/* Experience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {HARDCODED_EXPERIENCES.map((experience) => (
                <div
                  key={experience.id}
                  className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedModalExperiences.includes(experience.id)
                      ? 'border-[#8000FF] bg-purple-50'
                      : 'border-gray-200 hover:border-[#8000FF] hover:bg-purple-50/50'
                  }`}
                  onClick={() => toggleModalExperience(experience.id)}
                >
                  {/* Selected Indicator */}
                  {selectedModalExperiences.includes(experience.id) && (
                    <div className="absolute -top-2 -right-2 bg-[#8000FF] text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <div className="p-3">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                      {experience.title}
                    </h3>
                    <div className="text-sm text-gray-500 mb-2">
                      {experience.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#8000FF] font-semibold">
                        {experience.price}
                      </div>
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {experience.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isCreatingLandingPage}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateLandingPage}
                disabled={isCreatingLandingPage || selectedModalExperiences.length === 0}
                className="bg-[#8000FF] hover:bg-purple-700 text-white"
              >
                {isCreatingLandingPage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Landing Page'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Landing Page Created!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-center text-gray-600">
                Your landing page has been created successfully. Here's your unique link:
              </p>
              <div className="flex items-center w-full max-w-sm space-x-2">
                <Input 
                  readOnly 
                  value={`localhost:3000/recommendations/${landingPageId}`}
                  className="flex-1 px-2 py-1 text-sm border rounded bg-gray-50"
                />
                <Button
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(`localhost:3000/recommendations/${landingPageId}`)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="bg-[#8000FF] hover:bg-purple-700 text-white"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button
                variant="outline"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 
