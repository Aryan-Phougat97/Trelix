import { useMediaQuery } from './useMediaQuery';

/**
 * Custom hook to detect if user prefers reduced motion
 * Respects system accessibility settings
 * @returns boolean indicating if reduced motion is preferred
 */
export const useReducedMotion = (): boolean => {
    return useMediaQuery('(prefers-reduced-motion: reduce)');
};
