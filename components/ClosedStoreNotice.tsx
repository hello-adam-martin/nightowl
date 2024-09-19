import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { storeConfig } from '@/config/config'

const ClosedStoreNotice: React.FC = () => {
  const [nextOpeningDay, setNextOpeningDay] = useState('')
  const [nextOpeningTimeFormatted, setNextOpeningTimeFormatted] = useState('')
  const [timeUntilOpen, setTimeUntilOpen] = useState('')

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const calculateTimeUntilOpen = (openingTime: Date) => {
    const diff = openingTime.getTime() - new Date().getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const updateStoreStatus = () => {
      const currentTime = new Date();
      const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      let daysToAdd = 0;
      let nextDay = currentDay;
      let foundNextOpenDay = false;
      let nextOpeningTime: Date | null = null;

      while (!foundNextOpenDay && daysToAdd < 7) {
        const { open, close } = storeConfig.hours[nextDay];

        const [openHour, openMinute] = open.split(':').map(Number);
        const [closeHour, closeMinute] = close.split(':').map(Number);
        
        const openingTime = new Date(currentTime);
        openingTime.setDate(currentTime.getDate() + daysToAdd);
        openingTime.setHours(openHour, openMinute, 0, 0);

        const closingTime = new Date(currentTime);
        closingTime.setDate(currentTime.getDate() + daysToAdd);
        closingTime.setHours(closeHour, closeMinute, 0, 0);

        if (closeHour < openHour) {
          closingTime.setDate(closingTime.getDate() + 1);
        }

        if (currentTime >= openingTime && currentTime < closingTime) {
          // Store is currently open
          foundNextOpenDay = true;
          setNextOpeningDay('now');
          setNextOpeningTimeFormatted('We are currently open');
        } else if (currentTime < openingTime) {
          // Store will open later today or in the future
          foundNextOpenDay = true;
          setNextOpeningDay(daysToAdd === 0 ? 'today' : daysToAdd === 1 ? 'tomorrow' : nextDay);
          setNextOpeningTimeFormatted(formatTime(open));
          nextOpeningTime = openingTime;
        } else {
          // Move to the next day
          daysToAdd++;
          nextDay = daysOfWeek[(daysOfWeek.indexOf(nextDay) + 1) % 7];
        }
      }

      if (nextOpeningTime) {
        setTimeUntilOpen(calculateTimeUntilOpen(nextOpeningTime));
      }
    };

    updateStoreStatus();
    const intervalId = setInterval(updateStoreStatus, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="border-2 border-yellow-500 shadow-lg p-4 sm:p-6">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-yellow-600">
          {nextOpeningDay === 'now' ? 'Store is Open' : 'Store is Currently Closed'}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-700">
          {nextOpeningDay === 'now' 
            ? "We're accepting orders now!"
            : "We're sorry, but we're not accepting orders at this time."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {nextOpeningDay !== 'now' && (
          <>
            <div className="flex items-center text-yellow-600 mb-4">
              <Clock className="mr-2 h-5 w-5" />
              <span className="font-medium">Opens in: {timeUntilOpen}</span>
            </div>
            <p className="text-sm text-gray-600">
              We will open at <strong>{nextOpeningTimeFormatted}</strong> {nextOpeningDay}.
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