"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Share2,
  MapPin,
  Star,
  Clock,
  Copy,
  Check,
  Instagram,
  Youtube,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { use } from "react"

// Mock data structure that would come from the API
interface AffiliateData {
  influencer: {
    name: string
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
    name: "Anita Pinter",
    bio: "Travel enthusiast & adventure seeker 🌍 Sharing amazing experiences from around the globe ✈️ Partnered with Headout for the best travel deals!",
    avatar: "/placeholder.svg?height=120&width=120",
    followers: "125K",
    experiences: 47,
    countries: 23,
    socialLinks: {
      instagram: "https://instagram.com/welcomearound",
      youtube: "https://youtube.com/welcomearound",
      website: "https://welcomearound.com",
    },
  },
  experiences: []
})

export default function AffiliateRecommendations({ params }: { params: Promise<{ affiliateId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null)
  const [filteredExperiences, setFilteredExperiences] = useState(affiliateData?.experiences || [])
  const [copied, setCopied] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Fetch affiliate data
  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(`/api/affiliate/${resolvedParams.affiliateId}`);
    //     const data = await response.json();
    //     setAffiliateData(data);
    //     setFilteredExperiences(data.experiences);
    //   } catch (error) {
    //     console.error('Error fetching affiliate data:', error);
    //   }
    // };
    // fetchData();

    // Using mock data for now
    const mockData = getMockAffiliateData(resolvedParams.affiliateId)
    setAffiliateData(mockData)
    setFilteredExperiences(mockData.experiences)
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

  // Filter experiences based on search query
  useEffect(() => {
    if (!affiliateData) return

    let filtered = affiliateData.experiences

    if (searchQuery.trim() !== "") {
      filtered = affiliateData.experiences.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredExperiences(filtered)
  }, [searchQuery, affiliateData])

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
    const baseUrl = typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""
    const params = new URLSearchParams()
    if (selectedExperiences.length > 0) {
      params.set("experiences", selectedExperiences.join(","))
    }
    return `${baseUrl}?${params.toString()}`
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

  // Separate selected and unselected experiences
  const selectedExperienceData = filteredExperiences.filter((exp) => selectedExperiences.includes(exp.id))
  const unselectedExperienceData = filteredExperiences.filter((exp) => !selectedExperiences.includes(exp.id))

  // Carousel navigation
  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, unselectedExperienceData.length - 2))
  }

  const prevSlide = () => {
    setCarouselIndex(
      (prev) =>
        (prev - 1 + Math.max(1, unselectedExperienceData.length - 2)) %
        Math.max(1, unselectedExperienceData.length - 2),
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

      {/* Influencer Profile Section */}
      <div className="bg-gradient-to-r from-[#8000FF] to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={affiliateData.influencer.avatar} alt={affiliateData.influencer.name} />
              <AvatarFallback className="text-2xl bg-white text-[#8000FF]">
                {affiliateData.influencer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{affiliateData.influencer.name}</h1>
              <p className="text-purple-50 mb-6 max-w-2xl leading-relaxed">{affiliateData.influencer.bio}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                <div className="text-center">
                  {/* <div className="text-2xl font-bold">{affiliateData.influencer.followers}</div> */}
                  <div className="text-purple-200 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{affiliateData.influencer.experiences}</div>
                  <div className="text-purple-200 text-sm">Experiences</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{affiliateData.influencer.countries}</div>
                  <div className="text-purple-200 text-sm">Countries</div>
                </div>
              </div>

              <div className="flex justify-center md:justify-start space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  YouTube
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search experiences, destinations, or activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border-2 border-purple-200 focus:border-[#8000FF] rounded-xl bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating URL Preview Bar */}
      {selectedExperiences.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-20 md:left-auto md:right-4 md:w-96">
          <Card className="border-2 border-[#8000FF] bg-white/95 backdrop-blur-sm shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-[#8000FF]">
                  <Share2 className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-sm">Portfolio URL</span>
                </div>
                <Badge className="bg-[#8000FF] text-white text-xs">{selectedExperiences.length} selected</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-50 rounded px-2 py-1 border">
                  <code className="text-xs text-gray-700 break-all line-clamp-1">{getShareableUrl()}</code>
                </div>
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  className="bg-[#8000FF] hover:bg-purple-700 text-white px-3 py-1 h-8"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              {copied && (
                <div className="text-xs text-green-600 mt-1 flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  URL copied to clipboard!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

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

        {/* Selected Experiences List */}
        {selectedExperienceData.length > 0 && (
          <div className="space-y-4 mb-8">
            {selectedExperienceData.map((experience) => (
              <Card
                key={experience.id}
                className="ring-2 ring-[#8000FF] bg-purple-50 border-[#8000FF] shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md"
                onClick={() => toggleExperience(experience.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Experience Image */}
                    <div className="relative flex-shrink-0">
                      <Image
                        src={experience.image}
                        alt={experience.title}
                        width={120}
                        height={80}
                        className="w-20 h-16 md:w-28 md:h-20 object-cover rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-[#8000FF] text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Experience Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{experience.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{experience.description}</p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#8000FF] mb-1">{experience.price}</div>
                            <Button
                              size="sm"
                              className="bg-[#8000FF] hover:bg-purple-700 text-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExperience(experience.id)
                              }}
                            >
                              Selected
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {experience.location}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                            {experience.rating} ({experience.reviews})
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {experience.duration}
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          {experience.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Other Experiences Carousel */}
        {unselectedExperienceData.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="px-4">
                <h2 className="text-lg font-semibold text-gray-700 bg-white">Other Experiences</h2>
              </div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="relative">
              {/* Carousel Navigation Buttons */}
              {unselectedExperienceData.length > 3 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border-gray-300 hover:bg-gray-50"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border-gray-300 hover:bg-gray-50"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Carousel Container */}
              <div className="overflow-hidden px-8">
                <div
                  className="flex transition-transform duration-300 ease-in-out gap-6"
                  style={{
                    transform: `translateX(-${carouselIndex * (100 / 3)}%)`,
                  }}
                >
                  {unselectedExperienceData.map((experience) => (
                    <div key={experience.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3">
                      <Card
                        className="cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-200 bg-white h-full"
                        onClick={() => toggleExperience(experience.id)}
                      >
                        <div className="relative">
                          <Image
                            src={experience.image}
                            alt={experience.title}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-2 left-2 bg-white text-gray-800 hover:bg-white">
                            {experience.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1">{experience.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{experience.description}</p>

                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {experience.location}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                              {experience.rating} ({experience.reviews})
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {experience.duration}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-[#8000FF]">{experience.price}</span>
                            {/* <Button
                              size="sm"
                              variant="outline"
                              className="border-[#8000FF] text-[#8000FF] hover:bg-[#8000FF] hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleExperience(experience.id)
                              }}
                            >
                              Select
                            </Button> */}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredExperiences.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No experiences found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all experiences.</p>
          </div>
        )}
      </div>
    </div>
  )
} 