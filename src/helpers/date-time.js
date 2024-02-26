export const convertDateTimeZone = (value) => {
  return (
    new Date(value).toLocaleDateString("en-EN", {
      weekday: "short",
      timeZone: "UTC",
    }) +
    " " +
    value
  );
};
