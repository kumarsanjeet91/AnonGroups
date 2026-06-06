const palette = [
  { bg: "#7C3AED", soft: "rgba(124, 58, 237, 0.14)", text: "#A78BFA" },
  { bg: "#059669", soft: "rgba(5, 150, 105, 0.14)", text: "#34D399" },
  { bg: "#2563EB", soft: "rgba(37, 99, 235, 0.14)", text: "#60A5FA" },
  { bg: "#DB2777", soft: "rgba(219, 39, 119, 0.14)", text: "#F472B6" },
  { bg: "#EA580C", soft: "rgba(234, 88, 12, 0.14)", text: "#FB923C" },
  { bg: "#0891B2", soft: "rgba(8, 145, 178, 0.14)", text: "#22D3EE" },
  { bg: "#4F46E5", soft: "rgba(79, 70, 229, 0.14)", text: "#818CF8" },
  { bg: "#16A34A", soft: "rgba(22, 163, 74, 0.14)", text: "#4ADE80" }
];

export function getUserColor(username: string) {
  let hash = 0;
  for (let index = 0; index < username.length; index += 1) {
    hash = (hash * 31 + username.charCodeAt(index)) % palette.length;
  }
  return palette[Math.abs(hash)];
}
