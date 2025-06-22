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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    name: "Sarah Adventures",
    username: "@welcomearound",
    bio: "Travel enthusiast & adventure seeker 🌍 Sharing amazing experiences from around the globe ✈️ Partnered with Headout for the best travel deals!",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      id: "10479",
      title: "St. Peter's Basilica Dome: Guided Tour",
      location: "Rome, Italy",
      price: "€40.00",
      rating: 4.8,
      reviews: 5200,
      duration: "2 hours",
      category: "Religious",
      image: "https://cdn-imgix.headout.com/media/images/55ea0fc4c24549de8666d4a0f484fa28-10479-rome-st.-peter-s-basilica-dome-guided-tour-with-optional-breakfast-11.jpg",
      description: "Ascend to the top of St. Peter's Basilica Dome with a guide and enjoy breathtaking views of Rome. Includes optional breakfast."
    },
    {
      id: "2819",
      title: "Tower Bridge Tickets",
      location: "London, UK",
      price: "£12.00",
      rating: 4.6,
      reviews: 8000,
      duration: "1 hour",
      category: "Landmarks",
      image: "https://cdn-imgix.headout.com/media/images/251a132693d618b23f691880422ef6ae-2891-london-tower-bridge-and-engine-room-entry-tickets-02.jpg",
      description: "Visit the iconic Tower Bridge in London and explore its high-level walkways and Victorian engine rooms."
    },
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
      description: "Explore the largest church in the world and discover what makes St. Peter's Basilica one of the most popular architectural works from the Renaissance. Go on a guided tour of basilica in the company of an official Vatican guide and learn all you need to learn about the holiest of Catholic shrines.",
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
  },
  {
    id: "10479",
    title: "St. Peter's Basilica Dome: Guided Tour",
    location: "Rome, Italy",
    price: "€40.00",
    rating: 4.8,
    reviews: 5200,
    duration: "2 hours",
    category: "Religious",
    image: "https://cdn-imgix.headout.com/media/images/55ea0fc4c24549de8666d4a0f484fa28-10479-rome-st.-peter-s-basilica-dome-guided-tour-with-optional-breakfast-11.jpg",
    description: "Ascend to the top of St. Peter's Basilica Dome with a guide and enjoy breathtaking views of Rome. Includes optional breakfast."
  },
  {
    id: "2819",
    title: "Tower Bridge Tickets",
    location: "London, UK",
    price: "£12.00",
    rating: 4.6,
    reviews: 8000,
    duration: "1 hour",
    category: "Landmarks",
    image: "https://cdn-imgix.headout.com/media/images/251a132693d618b23f691880422ef6ae-2891-london-tower-bridge-and-engine-room-entry-tickets-02.jpg",
    description: "Visit the iconic Tower Bridge in London and explore its high-level walkways and Victorian engine rooms."
  }
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
  const [portfolioName, setPortfolioName] = useState<string>("")
  const [experienceText, setExperienceText] = useState<string>("")

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
          portfolioName: portfolioName,
          experienceText: experienceText
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
    } else {
      // Reset form fields when modal is closed
      // setPortfolioName("My European Adventure")
      // setExperienceText("Here are my favorite tours in Europe!")
    }
  }, [isModalOpen, selectedExperiences])

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
        <TooltipProvider>
          <Tabs defaultValue="experiences" className="mb-8" onValueChange={setActiveTab}>
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-50 rounded-full h-12 blur-md opacity-50"></div>
              <TabsList className="relative grid w-full grid-cols-2 h-12 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-purple-100 transition-all duration-300 ease-in-out">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-50/50 to-blue-50/50 opacity-70 pointer-events-none"></div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger 
                      value="experiences" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8000FF] data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-full transition-all duration-300 data-[state=active]:shadow-md flex items-center justify-center gap-2 relative overflow-hidden group tab-trigger-hover"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-blue-500/20 opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-0 transition-opacity"></span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
                      <span className="relative z-10">My Headout Experiences</span>
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-10 rounded-t-full bg-[#8000FF] opacity-0 data-[state=active]:opacity-100 transition-opacity duration-300"></span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs bg-white text-gray-700 p-3 shadow-lg border border-purple-100 z-[100]">
                    This section will automatically showcase all the experiences you've added through Headout — no manual updates needed!
                  </TooltipContent>
                </Tooltip>
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
            </TabsContent>
          </Tabs>
        </TooltipProvider>

        {/* Experience Selection Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select Experiences for Your Landing Page</DialogTitle>
              <DialogDescription>
                Choose the experiences you want to feature on your landing page.
              </DialogDescription>
            </DialogHeader>

            {/* Landing Page Details Form */}
            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
              <div>
                <label htmlFor="portfolioName" className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio Name
                </label>
                <Input
                  id="portfolioName"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="My European Adventure"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="experienceText" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="experienceText"
                  value={experienceText}
                  onChange={(e) => setExperienceText(e.target.value)}
                  placeholder="Here are my favorite tours in Europe!"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Describe your collection of experiences to help visitors understand what makes them special.
                </p>
              </div>
            </div>

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
                disabled={
                  isCreatingLandingPage || 
                  selectedModalExperiences.length === 0 || 
                  !portfolioName.trim() || 
                  !experienceText.trim()
                }
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
              <div className="text-center">
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {portfolioName}
                  </h3>
                  <p className="text-gray-600 text-sm italic">
                    "{experienceText}"
                  </p>
                  <div className="mt-3 pt-3 border-t border-purple-100 flex items-center justify-center text-sm text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
                    {selectedModalExperiences.length} {selectedModalExperiences.length === 1 ? 'experience' : 'experiences'} included
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Your landing page has been created successfully. Here's your unique link:
                </p>
              </div>
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
            <DialogFooter className="sm:justify-center flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.open(`/recommendations/${landingPageId}`, "_blank");
                  setIsSuccessModalOpen(false);
                }}
                className="bg-[#8000FF] hover:bg-purple-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Page
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 
