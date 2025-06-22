import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to a sample affiliate dashboard
  redirect("/affiliate-dashboard/sample-affiliate")
}
