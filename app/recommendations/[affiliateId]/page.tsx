"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { ExperienceCard } from "@/components/affiliate/experience-card"
import { ProfileHeader } from "@/components/affiliate/profile-header"

// API Response data structures
interface TourDetail {
  tourId: number
  tourName: string
  summary: string | null
  mediaUrls: string | null
  location: string
  price: string
  rating: number
  reviews: number
  duration: string
  category: string
}

interface LandingPageResponse {
  pageId: string
  status: "DRAFT" | "PUBLISHED"
  influencerId: string
  lastVisitedDate: string
  portfolioName: string
  experienceText: string
  tourDetails: TourDetail[]
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
}

interface SimilarTourDetail {
  id: number
  name: string
  summary?: string
  shortSummary?: string
  cityDisplayName?: string
  cityCode?: string
  averageRating: number
  reviewCount: number
  duration?: {
    value: number
    unit: string
  }
  category?: string
  imageUrl: string
  listingPrice?: {
    currencyCode: string
    finalPrice: number
  }
}

interface SimilarToursResponse {
  items: SimilarTourDetail[]
  total: number
  nextUrl: string | null
  prevUrl: string | null
}

export default function AffiliateRecommendations({ params }: { params: Promise<{ affiliateId: string }> }) {
  const resolvedParams = use(params)
  const [pageData, setPageData] = useState<LandingPageResponse | null>(null)
  const [similarTours, setSimilarTours] = useState<SimilarTourDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSimilarToursLoading, setIsSimilarToursLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [similarToursError, setSimilarToursError] = useState<string | null>(null)

  // Hardcoded profile data
  const profileData = {
    name: "Sarah Adventures",
    username: "@sarahadventures",
    bio: "Professional travel blogger and adventure seeker. Exploring the world one destination at a time. Sharing authentic travel experiences and hidden gems from around the globe.",
    avatar: "/placeholder-user.jpg",
    followers: "50K+",
    experiences: 120,
    countries: 45,
    socialLinks: {
      instagram: "https://instagram.com/sarahadventures",
      youtube: "https://youtube.com/@sarahadventures",
      website: "https://sarahadventures.com"
    }
  }

  // Fetch landing page data
  useEffect(() => {
    const fetchLandingPageData = async () => {
      try {
        // First API call - Get landing page data
        const landingPageResponse = await fetch(
          `https://googlettd.api.dev-headout.com/api/v8/affiliate/landing-pages/${resolvedParams.affiliateId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (!landingPageResponse.ok) {
          throw new Error('Failed to fetch landing page data')
        }

        const landingPageData: LandingPageResponse = await landingPageResponse.json()
        setPageData(landingPageData)
        
        // Fetch similar tours if we have tour details
        if (landingPageData.tourDetails && landingPageData.tourDetails.length > 0) {
          fetchSimilarTours(landingPageData.tourDetails)
        }
      } catch (err) {
        console.error('Error fetching landing page data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load page data')
      } finally {
        setIsLoading(false)
      }
    }

    // Separate function to fetch similar tours
    const fetchSimilarTours = async (tourDetails: TourDetail[]) => {
      setIsSimilarToursLoading(true)
      setSimilarToursError(null)
      
      try {
        const firstTourId = tourDetails[0].tourId
        const restrictedTourIds = tourDetails
          .slice(1)
          .map(tour => tour.tourId)
          .join(',')

        console.log(`Fetching similar tours for tour ID: ${firstTourId}`)
        
        const similarToursResponse = await fetch(
          `https://api-ho.headout.com/api/v6/tour-groups/${firstTourId}/similar-products/?limit=10&restricted-tgids=${restrictedTourIds}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (!similarToursResponse.ok) {
          throw new Error(`Failed to fetch similar tours: ${similarToursResponse.status}`)
        }

        const similarToursData: SimilarToursResponse = await similarToursResponse.json()
        console.log(`Received ${similarToursData.items?.length || 0} similar tours`)
        setSimilarTours(similarToursData.items || [])
      } catch (err) {
        console.error('Error fetching similar tours:', err)
        setSimilarToursError(err instanceof Error ? err.message : 'Failed to load similar tours')
      } finally {
        setIsSimilarToursLoading(false)
      }
    }

    fetchLandingPageData()
  }, [resolvedParams.affiliateId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-[#8000FF] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page data...</p>
        </div>
      </div>
    )
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error: {error || 'Failed to load page data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-[#8000FF] hover:underline"
          >
            Try again
          </button>
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
          </div>
        </div>
      </header>

      {/* Profile Header - Now using hardcoded data */}
      <ProfileHeader influencer={profileData} />

      <div className="container mx-auto px-4 py-8">
        {/* Portfolio Name and Description */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pageData.portfolioName}</h1>
          <p className="text-lg text-gray-600">{pageData.experienceText}</p>
        </div>

        {/* Main Recommendations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recommended Experiences
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {pageData.tourDetails.map((tour) => (
              <ExperienceCard 
                key={tour.tourId} 
                experience={{
                  id: tour.tourId?.toString() ?? "",
                  title: tour.tourName ?? "",
                  description: tour.summary ?? "",
                  image: tour.mediaUrls ?? "/placeholder.jpg",
                  location: tour.location ?? "",
                  price: tour.price ?? "",
                  rating: tour.rating ?? 0,
                  reviews: tour.reviews ?? 0,
                  duration: tour.duration ?? "",
                  category: tour.category ?? ""
                }}
                variant="featured" 
                showBookButton={true}
              />
            ))}
          </div>
        </div>

        {/* Similar Experiences Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Similar experiences you might like
          </h2>
          
          {isSimilarToursLoading && (
            <div className="text-center py-8">
              <div className="w-10 h-10 border-2 border-t-2 border-[#8000FF] rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">Loading similar experiences...</p>
            </div>
          )}
          
          {similarToursError && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{similarToursError}</p>
            </div>
          )}
          
          {!isSimilarToursLoading && !similarToursError && similarTours.length === 0 && (
            <p className="text-gray-500 text-center py-6">No similar experiences found</p>
          )}
          
          {!isSimilarToursLoading && similarTours.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarTours.map((tour) => (
                <ExperienceCard 
                  key={tour.id} 
                  experience={{
                    id: tour.id.toString(),
                    title: tour.name,
                    location: tour.cityDisplayName || "Dubai",
                    price: tour.listingPrice ? `${tour.listingPrice.currencyCode} ${tour.listingPrice.finalPrice}` : "Contact for price",
                    rating: tour.averageRating,
                    reviews: tour.reviewCount,
                    duration: tour.duration ? `${tour.duration.value} ${tour.duration.unit}` : "Flexible",
                    category: tour.category || "Tour",
                    image: tour.imageUrl || "/placeholder.jpg",
                    description: tour.shortSummary || tour.summary || "No description available"
                  }}
                  variant="grid" 
                  showBookButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 