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
    name: "Anita Pinter",
    username: "@welcomearound",
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
  experiences: [
    {
      id: "3075",
      title: "Guided Tour with Skip the Line Access to Colosseum, Roman Forum & Palatine",
      location: "Rome, Italy",
      price: "€45.50",
      rating: 4.7,
      reviews: 8923,
      duration: "3 hours",
      category: "Sightseeing",
      image: "https://cdn-imgix.headout.com/media/images/d34641f1b3d154908f855826330ba16d-colosseumtourguide.jpg",
      description: "Enjoy an in-depth tour of the Colosseum, Palatine Hill and Roman Forum as your professional guide takes you through each of these fascinating archeological sites.",
    },
    {
      id: "3097",
      title: "The Official Angels & Demons Tour",
      location: "Rome, Italy",
      price: "€38.00",
      rating: 4.5,
      reviews: 6541,
      duration: "4 hours",
      category: "Cultural",
      image: "https://cdn-imgix.headout.com/tour/4840/TOUR-IMAGE/78de6bac-f2d1-487c-a2f5-831526c3866b-11474-rome-guided-walking-tour-with-trevi-fountain---piazza-navona-04.jpg",
      description: "Let life imitate art by embarking on this unique and exclusive tour inspired by author Dan Brown's best selling novel that celebrates the beauty of Rome and the Vatican simultaneously.",
    },
    {
      id: "3105",
      title: "Half-Day Tour of Borghese Gallery & Gardens",
      location: "Rome, Italy",
      price: "€52.00",
      rating: 4.8,
      reviews: 7234,
      duration: "4 hours",
      category: "Museums",
      image: "https://cdn-imgix.headout.com/tour/4850/TOUR-IMAGE/c0a28550-5018-4379-b882-1bc6c07d3b6b-3105-rome-skip-the-line-borghese-gallery-and-gardens-half-day-tour-03.jpg",
      description: "Enjoy comfortable transport to the Borghese Gallery and discover one of Rome's most exquisite art collections with exclusive skip-the-line entry.",
    },
    {
      id: "3118",
      title: "I Love Rome: Panoramic Bus Tour with Audio Guide + Optional Hop-On Hop-Off",
      location: "Rome, Italy",
      price: "€28.50",
      rating: 4.3,
      reviews: 4567,
      duration: "24 hours",
      category: "Transportation",
      image: "https://cdn-imgix.headout.com/tour/4865/TOUR-IMAGE/579fdd25-605c-4360-8326-74ce1abc49cb-3118-rome-hop-on-hop-off-panoramic-tour-of-rome-03.jpg",
      description: "Soak up Rome at your own pace as you explore the city's remarkable architecture, art, and must-see attractions.",
    },
    {
      id: "3137",
      title: "Escorted Exclusive Skip The Line Tickets to Vatican Museum & Sistine Chapel",
      location: "Rome, Italy",
      price: "€65.00",
      rating: 4.9,
      reviews: 12345,
      duration: "3 hours",
      category: "Museums",
      image: "https://cdn-imgix.headout.com/tour/4888/TOUR-IMAGE/528087e8-dd67-4296-a798-7f26d98238a6-3137-rome-vatican-museum-and-sistine-chapel-skip-the-line-tickets-00.jpg",
      description: "Skip the ticketing lines at the Vatican Museums and Sistine Chapel by heading into the priority entrance with a dedicated escort.",
    },
    {
      id: "3163",
      title: "Roman Basilicas and Underground Catacombs on the Appian way",
      location: "Rome, Italy",
      price: "€42.00",
      rating: 4.4,
      reviews: 3891,
      duration: "3.5 hours",
      category: "Historical",
      image: "https://cdn-imgix.headout.com/media/images/0458ae665d04e8c7d0309522de4fd5de-3163-rome-guided-tour-of-roman-basilicas---underground-catacombs-on-the-appian-way-02.jpg",
      description: "Explore the ancient side of Rome on this visit that guides you through various Basilicas, ancient streets and, finally, the Roman Catacombs.",
    },
    {
      id: "3219",
      title: "Guided Day Tour of Pompeii, Amalfi & Positano from Rome",
      location: "Rome, Italy",
      price: "€89.00",
      rating: 4.6,
      reviews: 5678,
      duration: "12 hours",
      category: "Day Trips",
      image: "https://cdn-imgix.headout.com/media/images/4a3e8596aeea8732d9486b315a618e7f-3219-rome-pompeii-full-day-tour-with-amalfi-coast-drive-04.jpg",
      description: "Embark on a comfortable full day tour of the ancient city of Pompeii and take in the stunning views of the Amalfi coast.",
    },
    {
      id: "3235",
      title: "Rome Crypts and Catacombs Tour - With Capuchin \"Bone Chapel\" Visit",
      location: "Rome, Italy",
      price: "€35.00",
      rating: 4.2,
      reviews: 2987,
      duration: "3 hours",
      category: "Historical",
      image: "https://cdn-imgix.headout.com/media/images/1aa673226f332635f76f8ee45d6d954e-3235-rome-rome-crypts-and-catacombs-tour---with-capuchin-bone-chapel-visit-06.jpg",
      description: "Peel off the many layers of Rome as you go underground to discover the ancient city.",
    },
    {
      id: "3241",
      title: "Rome in a Day: Guided Tour of Vatican Museums & Colosseum with Sistine Chapel",
      location: "Rome, Italy",
      price: "€95.00",
      rating: 4.8,
      reviews: 9876,
      duration: "8 hours",
      category: "Combo Tours",
      image: "https://cdn-imgix.headout.com/media/images/000bd87572e5d639ae4ae574023036e8-3361-rome-guided-tour-of-saint-peter-s-basilica-cupola-01.jpg",
      description: "Experience the best of Rome with this full-day guided combo tour of the Vatican Museums, Sistine Chapel, St. Peter's Basilica, Colosseum, Palatine Hill and Roman Forum.",
    },
    {
      id: "3361",
      title: "St. Peter's Basilica and Papal Tombs Guided Tour",
      location: "Rome, Italy",
      price: "€48.00",
      rating: 4.7,
      reviews: 7456,
      duration: "2.5 hours",
      category: "Religious",
      image: "https://cdn-imgix.headout.com/media/images/86dc52bfded0c4e9be76783326ddcb48-3361-Rome-St.Peter-sBasilicaGuidedTour-12.jpg",
      description: "Explore the largest church in the world and discover what makes St. Peter's Basilica one of the most popular architectural works from the Renaissance.",
    },
    {
      id: "3728",
      title: "Pompeii and Naples Archeological Full Day Trip from Rome",
      location: "Rome, Italy",
      price: "€78.00",
      rating: 4.5,
      reviews: 4321,
      duration: "10 hours",
      category: "Day Trips",
      image: "https://cdn-imgix.headout.com/media/images/8ef6554926c78f94d3aa975b72b421cb-8952-Half-DayGuidedTourofPompeiiwithTransfersfromNaples-----002.jpg",
      description: "Embark on a full day adventure from Rome to explore the beautiful city of Naples, known the world over for it's art, culture and, of course, food.",
    },
    {
      id: "3779",
      title: "Borghese Gallery Small Group Guided Tour",
      location: "Rome, Italy",
      price: "€55.00",
      rating: 4.6,
      reviews: 6123,
      duration: "3 hours",
      category: "Museums",
      image: "https://cdn-imgix.headout.com/tour/5803/image/borghesegallery02.jpg",
      description: "Discover one of Rome's most exquisite art collections on a guided tour of the Borghese Gallery.",
    }
    // ... (keep other experiences)
  ],
})

// Add this after the AffiliateData interface
const HARDCODED_EXPERIENCES = [
  {
    id: "3075",
    title: "Guided Tour with Skip the Line Access to Colosseum, Roman Forum & Palatine",
    location: "Rome, Italy",
    price: "€45.00",
    rating: 4.8,
    reviews: 2847,
    duration: "3 hours",
    category: "Guided Tours",
    image: "https://cdn-imgix.headout.com/media/images/d34641f1b3d154908f855826330ba16d-colosseumtourguide.jpg",
    description: "Enjoy an in-depth tour of the Colosseum, Palatine Hill and Roman Forum as your professional guide takes you through each of these fascinating archeological sites. Choose from a morning or afternoon tour and enjoy skip-the-line priority access, saving you the hassle of tedious lines so that you can make the most of your time in Rome."
  },
  {
    id: "3097",
    title: "The Official Angels & Demons Tour",
    location: "Rome, Italy",
    price: "€65.00",
    rating: 4.7,
    reviews: 1923,
    duration: "4 hours",
    category: "Themed Tours",
    image: "https://cdn-imgix.headout.com/tour/4840/TOUR-IMAGE/78de6bac-f2d1-487c-a2f5-831526c3866b-11474-rome-guided-walking-tour-with-trevi-fountain---piazza-navona-04.jpg",
    description: "Let life imitate art by embarking on this unique and exclusive tour inspired by author Dan Brown's best selling novel that celebrates the beauty of Rome and the Vatican simultaneously, Angels & Demons. Trace the footsteps of your favourite fictional Harvard symbologist on this tour that will take you through the sites that inspired an entire generation of readers!"
  },
  {
    id: "3105",
    title: "Half-Day Tour of Borghese Gallery & Gardens",
    location: "Rome, Italy",
    price: "€55.00",
    rating: 4.6,
    reviews: 6123,
    duration: "3 hours",
    category: "Museums",
    image: "https://cdn-imgix.headout.com/tour/4850/TOUR-IMAGE/c0a28550-5018-4379-b882-1bc6c07d3b6b-3105-rome-skip-the-line-borghese-gallery-and-gardens-half-day-tour-03.jpg",
    description: "Enjoy comfortable transport to the Borghese Gallery and discover one of Rome's most exquisite art collections with exclusive skip-the-line entry. Led by an expert guide, view famous works from artists like Caravaggio, Raphael, Bernini, and many more. Afterward, stroll around the beautiful gardens surrounding Villa Borghese. Top off your experience with stunning views from Pincian Hill."
  },
  {
    id: "3118",
    title: "I Love Rome: Panoramic Bus Tour with Audio Guide + Optional Hop-On Hop-Off",
    location: "Rome, Italy",
    price: "€35.00",
    rating: 4.5,
    reviews: 4321,
    duration: "24 hours",
    category: "Sightseeing",
    image: "https://cdn-imgix.headout.com/tour/4865/TOUR-IMAGE/579fdd25-605c-4360-8326-74ce1abc49cb-3118-rome-hop-on-hop-off-panoramic-tour-of-rome-03.jpg",
    description: "Soak up Rome at your own pace as you explore the city's remarkable architecture, art, and must-see attractions. With your panoramic tour, board one of the open top double-decker pink buses from any stop and hop on and off at your leisure. From the Colosseum and Vatican City, to charming cafes and piazzas, make the most of your time in the Eternal City!"
  },
  {
    id: "3137",
    title: "Escorted Exclusive Skip The Line Tickets to Vatican Museum & Sistine Chapel",
    location: "Rome, Italy",
    price: "€42.00",
    rating: 4.9,
    reviews: 7456,
    duration: "2 hours",
    category: "Religious",
    image: "https://cdn-imgix.headout.com/tour/4888/TOUR-IMAGE/528087e8-dd67-4296-a798-7f26d98238a6-3137-rome-vatican-museum-and-sistine-chapel-skip-the-line-tickets-00.jpg",
    description: "Skip the ticketing lines at the Vatican Museums and Sistine Chapel by heading into the priority entrance with a dedicated escort before exploring the famous Raphael Rooms, Gallery of Maps, Michelangelo's frescoes, and much more historical art during your visit!"
  },
  {
    id: "3163",
    title: "Roman Basilicas and Underground Catacombs on the Appian way",
    location: "Rome, Italy",
    price: "€38.00",
    rating: 4.4,
    reviews: 2156,
    duration: "3.5 hours",
    category: "Historical",
    image: "https://cdn-imgix.headout.com/media/images/0458ae665d04e8c7d0309522de4fd5de-3163-rome-guided-tour-of-roman-basilicas---underground-catacombs-on-the-appian-way-02.jpg",
    description: "Explore the ancient side of Rome on this visit that guides you through various Basilicas, ancient streets and, finally, the Roman Catacombs, the former hiding places and now resting places of Early Christians from that era."
  },
  {
    id: "3219",
    title: "Guided Day Tour of Pompeii, Amalfi & Positano from Rome",
    location: "Rome, Italy",
    price: "€95.00",
    rating: 4.6,
    reviews: 3876,
    duration: "12 hours",
    category: "Day Trips",
    image: "https://cdn-imgix.headout.com/media/images/4a3e8596aeea8732d9486b315a618e7f-3219-rome-pompeii-full-day-tour-with-amalfi-coast-drive-04.jpg",
    description: "Embark on a comfortable full day tour of the ancient city of Pompeii and take in the stunning views of the Amalfi coast before quick stop in the luxurious resort town of Positano so you can secure some souvenirs of your trip to southern Italy."
  },
  {
    id: "3235",
    title: "Rome Crypts and Catacombs Tour - With Capuchin \"Bone Chapel\" Visit",
    location: "Rome, Italy",
    price: "€45.00",
    rating: 4.3,
    reviews: 2987,
    duration: "3 hours",
    category: "Historical",
    image: "https://cdn-imgix.headout.com/media/images/1aa673226f332635f76f8ee45d6d954e-3235-rome-rome-crypts-and-catacombs-tour---with-capuchin-bone-chapel-visit-06.jpg",
    description: "Peel off the many layers of Rome as you go underground to discover the ancient city. This unique tour showcases how Rome developed through the ages and how many historic sites can be found below the foundations of the Eternal City."
  },
  {
    id: "3241",
    title: "Rome in a Day: Guided Tour of Vatican Museums & Colosseum with Sistine Chapel",
    location: "Rome, Italy",
    price: "€95.00",
    rating: 4.8,
    reviews: 9876,
    duration: "8 hours",
    category: "Combo Tours",
    image: "https://cdn-imgix.headout.com/media/images/000bd87572e5d639ae4ae574023036e8-3361-rome-guided-tour-of-saint-peter-s-basilica-cupola-01.jpg",
    description: "Experience the best of Rome with this full-day guided combo tour of the Vatican Museums, Sistine Chapel, St. Peter's Basilica, Colosseum, Palatine Hill and Roman Forum. With your priority access ticket, skip the long entry lines at these popular sites and make the most of your time in this fascinating city."
  },
  {
    id: "3361",
    title: "St. Peter's Basilica and Papal Tombs Guided Tour",
    location: "Rome, Italy",
    price: "€48.00",
    rating: 4.7,
    reviews: 7456,
    duration: "2.5 hours",
    category: "Religious",
    image: "https://cdn-imgix.headout.com/media/images/86dc52bfded0c4e9be76783326ddcb48-3361-Rome-St.Peter-sBasilicaGuidedTour-12.jpg",
    description: "Explore the largest church in the world and discover what makes St. Peter's Basilica one of the most popular architectural works from the Renaissance. Go on a guided tour of basilica in the company of an official Vatican guide and learn all you need to learn about the holiest of Catholic shrines."
  }
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
