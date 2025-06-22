import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Instagram, Youtube, Globe } from "lucide-react"

interface ProfileHeaderProps {
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
}

export function ProfileHeader({ influencer }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#8000FF] to-purple-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src={influencer.avatar} alt={influencer.name} />
            <AvatarFallback className="text-2xl bg-white text-[#8000FF]">
              {influencer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{influencer.name}</h1>
            <p className="text-purple-50 mb-6 max-w-2xl leading-relaxed">{influencer.bio}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
              
              <div className="text-center">
                <div className="text-2xl font-bold">{influencer.experiences}</div>
                <div className="text-purple-200 text-sm">Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{influencer.countries}</div>
                <div className="text-purple-200 text-sm">Countries</div>
              </div>
            </div>

            <div className="flex justify-center md:justify-start space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => window.open(influencer.socialLinks.instagram, "_blank")}
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => window.open(influencer.socialLinks.youtube, "_blank")}
              >
                <Youtube className="w-4 h-4 mr-2" />
                YouTube
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => window.open(influencer.socialLinks.website, "_blank")}
              >
                <Globe className="w-4 h-4 mr-2" />
                Website
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 