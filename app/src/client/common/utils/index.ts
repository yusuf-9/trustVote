import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import RetryError from "../models/retry-error";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function retryPromiseIfFails<T>(
  promiseFn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let attempt = 1;

  while (attempt <= retries) {
    try {
      return await promiseFn();
    } catch (error) {
      attempt++;
      if (attempt > retries) {
        throw new RetryError(
          error instanceof Error ? error.message : `Failed to perform action after ${retries} attempts`
        );
      }
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
    }
  }

  // This line is never reached, but TypeScript demands a return.
  throw new RetryError("Unreachable code");
}
