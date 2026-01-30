import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { GCS } from "@/interfaces/interfaces"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateRTS = (gcs: GCS, systolicBP: number, RR: number): number => {
    const gcsTotal = (gcs.eyeOpening ?? 0) + (gcs.verbal ?? 0) + (gcs.motor ?? 0);
    
    // Helper to map values to the 0-4 point scale
    const getGcsScore = (n: number) => {
        if (n >= 13) return 4;
        if (n >= 9)  return 3;
        if (n >= 6)  return 2;
        if (n >= 4)  return 1;
        return 0;
    };

    const getBpScore = (n: number) => {
        if (n > 89)  return 4;
        if (n >= 76) return 3;
        if (n >= 50) return 2;
        if (n >= 1)  return 1;
        return 0;
    };

    const getRrScore = (n: number) => {
        if (n >= 10 && n <= 29) return 4;
        if (n > 29)             return 3;
        if (n >= 6 && n <= 9)   return 2;
        if (n >= 1 && n <= 5)   return 1;
        return 0;
    };

    const score = (0.9368 * getGcsScore(gcsTotal)) + 
                  (0.7326 * getBpScore(systolicBP)) + 
                  (0.2908 * getRrScore(RR));

    return Math.round(score);
};

export const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');   // 0-23
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 0-59
    return `${hours}:${minutes}`; // "HH:MM" format
};

export const getGCSSum = (gcs?: GCS): number | undefined => {
    if (!gcs) return undefined; // Minimum GCS is 3
    return (gcs.eyeOpening ?? 0) + (gcs.verbal ?? 0) + (gcs.motor ?? 0);
};
