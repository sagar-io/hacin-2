import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the default creator dashboard
  redirect("/creator-dashboard/@welcomearound")
}
