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
  url?: string
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
  url?: string
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
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    followers: "50K+",
    experiences: 120,
    countries: 45,
    socialLinks: {
      instagram: "https://instagram.com/welcomearound",
      youtube: "https://youtube.com/welcomearound",
      website: "https://welcomearound.com",
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
        
        // Only add restricted tour IDs if there are more than one tour
        let apiUrl = `https://api-ho.headout.com/api/v6/tour-groups/${firstTourId}/similar-products/?limit=10`
        
        if (tourDetails.length > 1) {
          const restrictedTourIds = tourDetails
            .slice(1)
            .map(tour => tour.tourId)
            .join(',')
          apiUrl += `&restricted-tgids=${restrictedTourIds}`
          console.log(`Adding restricted tour IDs: ${restrictedTourIds}`)
        } else {
          console.log(`Only one tour found, not adding restricted-tgids parameter`)
        }

        console.log(`Fetching similar tours with URL: ${apiUrl}`)
        
        const similarToursResponse = await fetch(
          apiUrl,
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
              <img 
                src="https://cdn-imgix-open.headout.com/logo/svg/Headout_logo_purps.svg?w=229.5&h=36&fm=svg&crop=faces&auto=compress%2Cformat&fit=min" 
                alt="Headout" 
                width="153"
                height="23"
                style={{ width: "153px", height: "23px" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Profile Header - Now using hardcoded data */}
      <ProfileHeader influencer={profileData} />

      <div className="container mx-auto px-4 py-8">
        {/* Portfolio Name and Description */}
        <div className="mb-8 text-center">
          <h1 className="text-left text-3xl font-bold text-gray-900 mb-4">{pageData.portfolioName}</h1>
          <p className="text-left text-lg text-gray-600">{pageData.experienceText}</p>
        </div>

        {/* Main Recommendations */}
        <div className="mb-12">
          <div className="grid grid-cols-1 gap-6">
            {pageData.tourDetails.map((tour) => (
              <ExperienceCard 
                key={tour.tourId} 
                experience={{
                  id: tour.tourId?.toString() ?? "",
                  title: tour.tourName ?? "",
                  description: tour.summary ?? "",
                  image: tour.mediaUrls ?? "/placeholder.jpg",
                  location: tour.location ?? "Rome",
                  price: tour.price ?? `$${Math.floor(Math.random() * 100) + 1}`,
                  rating: tour.rating ?? 4.3,
                  reviews: tour.reviews ?? 10700,
                  duration: tour.duration ?? "2 Hours",
                  category: tour.category ?? "Tour",
                  url: tour.url || "https://www.headout.com/colosseum-tickets/priority-tickets-to-colosseum-roman-forum-palatine-hill-fast-track-entry-tickets-e-7148/"
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
          
          {/* Similar tours grid with clickable cards that redirect to tour URLs */}
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
                    description: tour.shortSummary || tour.summary || "No description available",
                    url: `https://www.headout.com/roman-catacombs-tour/the-original-rome-capuchin-crypts-and-catacombs-tour-e-${tour.id.toString()}/`
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