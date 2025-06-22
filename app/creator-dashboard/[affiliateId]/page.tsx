"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Copy, Star, Share2, Loader2, Calendar, MapPin, ChevronRight, Eye, DollarSign, ExternalLink, Users } from "lucide-react"
import { ExperienceCard } from "@/components/affiliate/experience-card"
import { ProfileHeader } from "@/components/affiliate/profile-header"

// Custom styles for tab animations
const tabAnimationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); }
    to { transform: scale(1); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  
  .tab-content-animate {
    animation: fadeIn 0.4s ease-out, scaleIn 0.3s ease-out;
  }
  
  .tab-item-animate {
    animation: slideIn 0.3s ease-out forwards;
    opacity: 0;
  }
  
  .tab-item-animate:nth-child(1) { animation-delay: 0.05s; }
  .tab-item-animate:nth-child(2) { animation-delay: 0.1s; }
  .tab-item-animate:nth-child(3) { animation-delay: 0.15s; }
  .tab-item-animate:nth-child(4) { animation-delay: 0.2s; }
  .tab-item-animate:nth-child(5) { animation-delay: 0.25s; }
  .tab-item-animate:nth-child(6) { animation-delay: 0.3s; }
  
  .tab-trigger-hover:hover {
    animation: pulse 0.5s ease-in-out;
    box-shadow: 0 0 0 2px rgba(128, 0, 255, 0.1);
  }
`;

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
    avatar: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
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

// Interface for landing pages from the API
interface UserLandingPage {
  pageId: string
  status: "DRAFT" | "PUBLISHED"
  influencerId: string
  lastVisitedDate: string
  portfolioName: string
  experienceText: string
  tourDetails: any[]
  // Additional analytics data (hardcoded)
  viewers?: number
  revenue?: number
  conversions?: number
  thumbnail?: string
}

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
  const [activeTab, setActiveTab] = useState("experiences")
  const [landingPages, setLandingPages] = useState<UserLandingPage[]>([])
  const [isLandingPagesLoading, setIsLandingPagesLoading] = useState(false)
  const [landingPagesError, setLandingPagesError] = useState<string | null>(null)

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

  // Fetch user landing pages for the second tab
  useEffect(() => {
    if (activeTab !== "landing") return;
    
    const fetchUserLandingPages = async () => {
      setIsLandingPagesLoading(true);
      setLandingPagesError(null);
      
      try {
        const response = await fetch(`https://googlettd.api.dev-headout.com/api/v8/affiliate/users/2960031/landing-pages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch landing pages: ${response.status}`);
        }
        
        const data: UserLandingPage[] = await response.json();
        
        // Add hardcoded analytics data to each landing page
        const enhancedData = data.map((page, index) => ({
          ...page,
          viewers: 5000 + Math.floor(Math.random() * 8000),
          revenue: 2000 + Math.floor(Math.random() * 7000),
          conversions: 10 + Math.floor(Math.random() * 20),
          thumbnail: [
            "https://cdn-imgix.headout.com/media/images/50bae31b370027fe4798b664858fa80a-3586-10.jpg",
            "https://cdn-imgix.headout.com/media/images/6c6519b8db7ddab3f5381d54ee30032a-Frame-banner.jpg",
            "/placeholder.jpg"
          ][index % 3]
        }));
        
        setLandingPages(enhancedData);
      } catch (err) {
        console.error('Error fetching landing pages:', err);
        setLandingPagesError(err instanceof Error ? err.message : 'Failed to load landing pages');
      } finally {
        setIsLandingPagesLoading(false);
      }
    };
    
    fetchUserLandingPages();
  }, [activeTab]);

  // Handle sharing landing page URL
  const handleShareLandingPage = (pageId: string) => {
    const url = `${window.location.origin}/recommendations/${pageId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {/* Inject custom animation styles */}
      <style dangerouslySetInnerHTML={{ __html: tabAnimationStyles }} />
      
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
            {selectedExperiences.length > 0 && activeTab === "experiences" && (
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
        {/* Tabs Navigation */}
        <Tabs defaultValue="experiences" className="mb-8" onValueChange={setActiveTab}>
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-50 rounded-full h-12 blur-md opacity-50"></div>
            <TabsList className="relative grid w-full grid-cols-2 h-12 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-purple-100 transition-all duration-300 ease-in-out">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-50/50 to-blue-50/50 opacity-70 pointer-events-none"></div>
              <TabsTrigger 
                value="experiences" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8000FF] data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-full transition-all duration-300 data-[state=active]:shadow-md flex items-center justify-center gap-2 relative overflow-hidden group tab-trigger-hover"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-blue-500/20 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity"></span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
                <span className="relative z-10">Experiences</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-10 rounded-t-full bg-[#8000FF] opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"></span>
              </TabsTrigger>
              <TabsTrigger 
                value="landing" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8000FF] data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-full transition-all duration-300 data-[state=active]:shadow-md flex items-center justify-center gap-2 relative overflow-hidden group tab-trigger-hover"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-blue-500/20 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity"></span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
                <span className="relative z-10">Your Landing Pages</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-10 rounded-t-full bg-[#8000FF] opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"></span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Tab 1: Experiences */}
          <TabsContent value="experiences" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500 tab-content-animate">
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
              {filteredExperiences.map((experience, index) => (
                <div key={experience.id} className="tab-item-animate">
                  <ExperienceCard
                    experience={experience}
                    variant="grid"
                    isSelected={selectedExperiences.includes(experience.id)}
                    onSelect={() => toggleExperience(experience.id)}
                  />
                </div>
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
          </TabsContent>
          
          {/* Tab 2: Your Landing Pages */}
          <TabsContent value="landing" className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500 tab-content-animate">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Landing Pages Analytics
            </h2>
            
            {isLandingPagesLoading && (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-2 border-t-2 border-[#8000FF] rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500">Loading landing pages...</p>
              </div>
            )}
            
            {landingPagesError && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{landingPagesError}</p>
              </div>
            )}
            
            {!isLandingPagesLoading && !landingPagesError && landingPages.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-4">You haven't created any landing pages yet</p>
                <Button 
                  className="bg-[#8000FF] hover:bg-purple-700 text-white"
                  onClick={() => {
                    setActiveTab("experiences");
                    setTimeout(() => setIsModalOpen(true), 100);
                  }}
                >
                  Create Your First Landing Page
                </Button>
              </div>
            )}
            
            {!isLandingPagesLoading && landingPages.length > 0 && (
              <div className="grid gap-6">
                {landingPages.map((page, index) => (
                  <div key={page.pageId} className="tab-item-animate" style={{animationDelay: `${0.05 * (index + 1)}s`}}>
                    <Card className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <img
                          src={page.thumbnail || "/placeholder.jpg"}
                          alt={page.portfolioName}
                          className="w-28 h-20 rounded-lg object-cover border"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{page.portfolioName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Calendar className="w-4 h-4" />
                            Created: {new Date(page.lastVisitedDate).toLocaleDateString()}
                            <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {page.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Eye className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-lg">{page.viewers?.toLocaleString() || "0"}</div>
                                <div className="text-sm text-gray-500">Viewers</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-50 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-lg">${page.revenue?.toLocaleString() || "0"}</div>
                                <div className="text-sm text-gray-500">Revenue</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-lg">{page.conversions || 0} sales</div>
                                <div className="text-sm text-gray-500">
                                  {page.viewers && page.conversions 
                                    ? ((page.conversions / page.viewers) * 100).toFixed(1) 
                                    : "0"}% conversion
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareLandingPage(page.pageId)}
                              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                            >
                              <Share2 className="w-4 h-4" />
                              {copied ? "Copied!" : "Share URL"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-gray-50"
                              onClick={() => window.open(`/recommendations/${page.pageId}`, "_blank")}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Page
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
            
            {!isLandingPagesLoading && landingPages.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={() => {
                    setActiveTab("experiences");
                    setTimeout(() => setIsModalOpen(true), 100);
                  }}
                  className="bg-[#8000FF] hover:bg-purple-700 text-white"
                >
                  Create New Landing Page
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
