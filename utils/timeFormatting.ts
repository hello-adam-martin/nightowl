export function formatTime24to12(time24: string): string {
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    const result = `${hour}:${minutes} ${ampm}`;
    return result;
}