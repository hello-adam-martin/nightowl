import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

type ClosedStoreNoticeProps = {
  timeUntilOpen: string;
  nextOpeningTime: string;
}

const ClosedStoreNotice: React.FC<ClosedStoreNoticeProps> = ({ timeUntilOpen, nextOpeningTime }) => {
  const [opensToday, setOpensToday] = useState(true)

  useEffect(() => {
    const currentTime = new Date();
    const [hours, minutes] = nextOpeningTime.split(':').map(Number);
    
    const nextOpeningDate = new Date(currentTime);
    nextOpeningDate.setHours(hours, minutes, 0, 0);
    
    // If the next opening time is earlier than the current time, it must be tomorrow
    if (nextOpeningDate <= currentTime) {
      nextOpeningDate.setDate(nextOpeningDate.getDate() + 1);
      setOpensToday(false);
    } else {
      setOpensToday(true);
    }
  }, [nextOpeningTime]);

  return (
    <Card className="border-2 border-yellow-500 shadow-lg p-4 sm:p-6">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-yellow-600">Store is Currently Closed</CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-700">
          We&apos;re sorry, but we&apos;re not accepting orders at this time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-yellow-600 mb-4">
          <Clock className="mr-2 h-5 w-5" />
          <span className="font-medium">Opens in: {timeUntilOpen}</span>
        </div>
        <p className="text-sm text-gray-600">
          We will open at <strong>{nextOpeningTime}</strong> {opensToday ? 'today' : 'tomorrow'}.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Please check back during our operating hours to place an order. We appreciate your patience!
        </p>
      </CardContent>
    </Card>
  )
}

export default ClosedStoreNotice