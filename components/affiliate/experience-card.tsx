import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, Check } from "lucide-react"
import Image from "next/image"

interface ExperienceCardProps {
  experience: {
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
    url?: string
  }
  isSelected?: boolean
  showSelectButton?: boolean
  showBookButton?: boolean
  onSelect?: (id: string) => void
  variant?: "list" | "grid" | "featured"
}

export function ExperienceCard({
  experience,
  isSelected,
  showSelectButton = false,
  showBookButton = false,
  onSelect,
  variant = "list",
}: ExperienceCardProps) {
  const handleSelect = (e: React.MouseEvent) => {
    if (onSelect) {
      e.stopPropagation()
      onSelect(experience.id)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (showSelectButton) return
    if (experience.url) {
      window.open(experience.url, '_blank')
    }
  }

  console.log("experience", experience)

  if (variant === "list") {
    return (
      <Card
        className={`${
          isSelected
            ? "ring-2 ring-[#8000FF] bg-purple-50 border-[#8000FF]"
            : "border-gray-200 bg-white"
        } shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md`}
        onClick={showSelectButton ? handleSelect : handleCardClick}
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
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-[#8000FF] text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
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
                    {showSelectButton && (
                      <Button
                        size="sm"
                        className={isSelected ? "bg-[#8000FF] hover:bg-purple-700 text-white" : "border-[#8000FF] text-[#8000FF] hover:bg-[#8000FF] hover:text-white"}
                        variant={isSelected ? "default" : "outline"}
                        onClick={handleSelect}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    )}
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
    )
  }

  if (variant === "featured") {
    return (
      <Card
        className="cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-200 bg-white overflow-hidden"
        onClick={showSelectButton ? handleSelect : handleCardClick}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/2">
            <Image
              src={experience.image}
              alt={experience.title}
              width={600}
              height={400}
              className="w-full h-48 md:h-[280px] object-cover"
            />
            <Badge className="absolute top-2 left-2 bg-white text-gray-800 hover:bg-white">
              {experience.category}
            </Badge>
          </div>
          <CardContent className="p-6 md:w-1/2">
            <h3 className="font-bold text-2xl mb-3 text-gray-900">{experience.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{experience.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{experience.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2" />
                <span>{experience.duration}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" />
                <span className="text-gray-600">
                  {experience.rating} ({experience.reviews})
                </span>
              </div>
              <div className="text-2xl font-bold text-[#8000FF]">{experience.price}</div>
            </div>

            <div className="flex gap-3">
              {showSelectButton && (
                <Button
                  size="lg"
                  variant={isSelected ? "default" : "outline"}
                  className={
                    isSelected
                      ? "bg-[#8000FF] hover:bg-purple-700 text-white flex-1"
                      : "border-[#8000FF] text-[#8000FF] hover:bg-[#8000FF] hover:text-white flex-1"
                  }
                  onClick={handleSelect}
                >
                  {isSelected ? "Selected" : "Select Experience"}
                </Button>
              )}
              {showBookButton && (
                <Button
                  size="lg"
                  className="bg-[#8000FF] hover:bg-purple-700 text-white flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`https://headout.com/book/1866`, '_blank')
                  }}
                >
                  Book Now
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-200 bg-white h-full"
      onClick={showSelectButton ? handleSelect : handleCardClick}
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

        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-[#8000FF]">{experience.price}</span>
          <div className="flex gap-2">
            {showSelectButton && (
              <Button
                size="sm"
                variant={isSelected ? "default" : "outline"}
                className={
                  isSelected
                    ? "bg-[#8000FF] hover:bg-purple-700 text-white"
                    : "border-[#8000FF] text-[#8000FF] hover:bg-[#8000FF] hover:text-white"
                }
                onClick={handleSelect}
              >
                {isSelected ? "Selected" : "Select"}
              </Button>
            )}
                          {showBookButton && (
                <Button
                  size="sm"
                  className="bg-[#8000FF] hover:bg-purple-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`https://headout.com/book/${experience.id}`, '_blank')
                  }}
                >
                  Book Now
                </Button>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 