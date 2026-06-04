import Banner2 from "@/components/banner2/banner2";
import { Rochester } from "next/font/google";

const rochester = Rochester({
    subsets: ["latin"],
    weight: ["400"],
});


export default function MainGift() {
  return (
    <Banner2 
     title="Send a Gift"
     subtitle="Choose a thoughtful gift for the person you booked for."
     backgroundImage="/home/send-gift.jpg"
     bgPosition="50% 30%"
    />
  )
}