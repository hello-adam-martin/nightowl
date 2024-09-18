import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock } from 'lucide-react'

type ClosedStoreNoticeProps = {
  timeUntilOpen: string;
  nextOpeningTime: string;
}

const ClosedStoreNotice: React.FC<ClosedStoreNoticeProps> = ({ timeUntilOpen, nextOpeningTime }) => {
  const currentTime = new Date();
  const [nextOpeningHour, nextOpeningPeriod] = nextOpeningTime.split(' ');
  const [hour, minute] = nextOpeningHour.split(':').map(Number);
  
  const nextOpeningDate = new Date(currentTime);
  nextOpeningDate.setHours(nextOpeningPeriod === 'PM' && hour !== 12 ? hour + 12 : hour, minute, 0, 0);
  
  if (nextOpeningDate < currentTime) {
    nextOpeningDate.setDate(nextOpeningDate.getDate() + 1);
  }

  const opensToday = nextOpeningDate.getDate() === currentTime.getDate();

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