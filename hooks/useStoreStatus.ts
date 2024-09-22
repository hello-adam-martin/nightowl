import { useState, useEffect } from 'react';
import { storeConfig } from '@/config/config';
import { format, addDays, isSameDay, isAfter } from 'date-fns';

export function useStoreStatus() {
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [nextOpeningInfo, setNextOpeningInfo] = useState({ day: '', time: '' });

  useEffect(() => {
    const checkStoreStatus = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof storeConfig.hours;
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const { open, close } = storeConfig.hours[currentDay];
      
      const [openHour, openMinute] = open.split(':').map(Number);
      const [closeHour, closeMinute] = close.split(':').map(Number);
      
      const isOpen = (openHour < closeHour || (openHour === closeHour && openMinute < closeMinute)) 
        ? (currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute)) &&
          (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute))
        : (currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute)) ||
          (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute));
      
      setIsStoreOpen(isOpen);

      if (!isOpen) {
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
        let nextOpeningDate = new Date(now);
        let foundNextOpening = false;

        for (let i = 0; i < 7; i++) {
          const checkDay = daysOfWeek[(now.getDay() + i) % 7] as keyof typeof storeConfig.hours;
          const { open } = storeConfig.hours[checkDay];
          
          if (open !== '00:00') {
            const [openHour, openMinute] = open.split(':').map(Number);
            nextOpeningDate.setHours(openHour, openMinute, 0, 0);

            if (i === 0) {
              // If it's today, check if the opening time hasn't passed yet
              if (isAfter(nextOpeningDate, now)) {
                foundNextOpening = true;
                break;
              }
            } else {
              // For future days, this is the next opening
              foundNextOpening = true;
              break;
            }
          }

          // Move to the next day
          nextOpeningDate = addDays(nextOpeningDate, 1);
        }

        if (foundNextOpening) {
          const nextOpeningDay = isSameDay(now, nextOpeningDate)
            ? 'Today'
            : isSameDay(addDays(now, 1), nextOpeningDate)
              ? 'Tomorrow'
              : format(nextOpeningDate, 'EEEE');
          const nextOpeningTime = format(nextOpeningDate, 'h:mm a');
          setNextOpeningInfo({ day: nextOpeningDay, time: nextOpeningTime });
        } else {
          setNextOpeningInfo({ day: 'Unknown', time: 'Check store hours' });
        }
      }
    };

    checkStoreStatus(); // Check immediately on mount
    const timer = setInterval(checkStoreStatus, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  return { isStoreOpen, nextOpeningInfo };
}