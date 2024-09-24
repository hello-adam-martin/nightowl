import { storeConfig } from '@/config/config';

export interface StoreStatus {
  isOpen: boolean;
  nextOpeningDay: string;
  nextOpeningTime: string;
  closingTime: string; // Add this line
  timeUntilOpen: string;
  secondsUntilOpen: number;
}

export function checkStoreStatus(): StoreStatus {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof storeConfig.hours;
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  let daysToAdd = 0;
  let nextDay = currentDay;
  let isOpen = false;
  let nextOpeningDay = '';
  let nextOpeningTime = '';
  let timeUntilOpen = '';
  let openTime = 0;
  let closingTime = '';

  while (daysToAdd < 7) {
    const hours = storeConfig.hours[nextDay as keyof typeof storeConfig.hours];
    if (hours) {
      const [openHour, openMinute] = hours.open.split(':').map(Number);
      openTime = openHour * 60 + openMinute;
      const [closeHour, closeMinute] = hours.close.split(':').map(Number);
      
      let closeTime = closeHour * 60 + closeMinute;
      
      if (closeTime <= openTime) {
        closeTime += 24 * 60;
      }

      if (daysToAdd === 0 && currentTime >= openTime && currentTime < closeTime) {
        isOpen = true;
        closingTime = hours.close; // Change this line
        break;
      } else if (daysToAdd === 0 && currentTime < openTime) {
        nextOpeningDay = 'today';
        nextOpeningTime = hours.open;
        const minutesUntilOpen = openTime - currentTime;
        timeUntilOpen = `${Math.floor(minutesUntilOpen / 60)}h ${minutesUntilOpen % 60}m`;
        break;
      } else if (daysToAdd > 0) {
        nextOpeningDay = daysToAdd === 1 ? 'tomorrow' : nextDay;
        nextOpeningTime = hours.open;
        const minutesUntilOpen = (daysToAdd * 24 * 60) + openTime - currentTime;
        timeUntilOpen = `${Math.floor(minutesUntilOpen / 60)}h ${minutesUntilOpen % 60}m`;
        break;
      }
    }

    daysToAdd++;
    nextDay = daysOfWeek[(daysOfWeek.indexOf(nextDay) + 1) % 7] as keyof typeof storeConfig.hours;
  }

  const secondsUntilOpen = Math.floor((daysToAdd * 24 * 60 * 60) + (openTime - currentTime) * 60);

  return { 
    isOpen, 
    nextOpeningDay, 
    nextOpeningTime, // Remove formatting here
    closingTime,
    timeUntilOpen, 
    secondsUntilOpen
  };
}
