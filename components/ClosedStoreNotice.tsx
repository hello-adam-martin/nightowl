import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { checkStoreStatus, StoreStatus } from '@/utils/storeStatus'
import { formatTime24to12 } from '@/utils/timeFormatting' // Add this import

const ClosedStoreNotice: React.FC = () => {
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({
    isOpen: false,
    nextOpeningDay: '',
    nextOpeningTime: '',
    timeUntilOpen: '',
    secondsUntilOpen: 0
  })

  const [countdown, setCountdown] = useState(0);

  const formatTimeUntilOpen = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  useEffect(() => {
    const updateStoreStatus = () => {
      const newStatus = checkStoreStatus();
      setStoreStatus(newStatus);
      setCountdown(newStatus.secondsUntilOpen);
    };

    updateStoreStatus();
    const statusInterval = setInterval(updateStoreStatus, 60000); // Update every minute

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <Card className="border-2 border-yellow-500 shadow-lg p-4 sm:p-6">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-yellow-600">
          {storeStatus.isOpen ? 'Store is Open' : 'Store is Currently Closed'}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-700">
          {storeStatus.isOpen 
            ? "We're accepting orders now!"
            : "We're sorry, but we're not accepting orders at this time."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!storeStatus.isOpen && (
          <>
            <div className="flex items-center text-yellow-600 mb-4">
              <Clock className="mr-2 h-5 w-5" />
              <span className="font-medium">Open again in: {formatTimeUntilOpen(countdown)}</span>
            </div>
            <p className="text-sm text-gray-600">
              We will open at <strong>{formatTime24to12(storeStatus.nextOpeningTime)}</strong> {storeStatus.nextOpeningDay}.
            </p>
            <p className="mt-4 text-sm text-gray-600">
              Please check back during our operating hours to place an order. We appreciate your patience!
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default ClosedStoreNotice