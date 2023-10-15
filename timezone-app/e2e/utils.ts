import {registerTSXLegacyModuleInterop} from "sucrase/dist/types/register";

export function formatTime(dateString: string) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
}

 export function convertStringTimeToDate(times: string[]): Date[] {
     // Convert time strings to Date objects
      return times.map(time => {
         // Today's date is used to ensure the Date object represents today's time.
         const today = new Date();
         return new Date(`${today.toDateString()} ${time}`);
     });
 }

export function isTimeSorted(timeObjects: Date[]) {
    for (let i = 1; i < timeObjects.length; i++) {
        if (timeObjects[i].getTime() < timeObjects[i - 1].getTime()) {
            return false; // Found an item out of order
        }
    }
    return true; // List is sorted
}

