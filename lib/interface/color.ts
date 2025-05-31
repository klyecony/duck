const getContrastColor = (hex: string): "#ffffff" | "#000000" => {
  hex = hex.replace(/^#/, "");
  const num = Number.parseInt(
    hex.length === 3
      ? hex
          .split("")
          .map(c => c + c)
          .join("")
      : hex,
    16,
  );
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 128 ? "#000000" : "#ffffff";
};
export { getContrastColor };
