export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

export function capitalizeStart(value) {
  if (typeof value !== "string") return "";
  if (!value) return "";

  const firstVisibleIndex = value.search(/\S/);
  if (firstVisibleIndex === -1) return value;

  return (
    value.slice(0, firstVisibleIndex) +
    value.charAt(firstVisibleIndex).toLocaleUpperCase() +
    value.slice(firstVisibleIndex + 1)
  );
}
