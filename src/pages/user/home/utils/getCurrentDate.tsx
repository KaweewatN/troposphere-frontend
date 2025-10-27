/**
 * Get the current date formatted as "Monday, 23 October 2025"
 * @returns Formatted date string
 */
export function getCurrentDate(): string {
  const date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
}

// Format date helper
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};
