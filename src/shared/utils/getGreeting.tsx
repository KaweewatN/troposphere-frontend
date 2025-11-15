// Get time-based greeting
const getGreeting = () => {
  const date = new Date();
  const hour = Number(
    date
      .toLocaleString("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: "Asia/Bangkok",
      })
      .split(":")[0]
  );
  if (isNaN(hour)) return "Hello";
  if (hour < 6 || hour >= 20) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export default getGreeting;
