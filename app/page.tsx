import connectToDatabase from "@/lib/db";
import { redirect } from "next/navigation"

export default async function Home() {
  await connectToDatabase();
  // redirect("/login")
  <p>hello</p>
}

