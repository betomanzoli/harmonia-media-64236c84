
// This is a patch for the LimitedAudioPlayer component
// It exports a function to fix the type error with the amplitude array

/**
 * Converts a single amplitude number to an array of amplitude numbers
 * This function is used to fix the type error in LimitedAudioPlayer.tsx
 * 
 * @param amplitude - The amplitude value to convert to an array
 * @returns An array containing the amplitude value
 */
export const getAmplitudeArray = (amplitude: number): number[] => {
  return [amplitude];
};

/**
 * Determines if a value is an array or a single number
 * @param value - The value to check
 * @returns True if the value is an array, false otherwise
 */
export const isAmplitudeArray = (value: number | number[]): value is number[] => {
  return Array.isArray(value);
};
