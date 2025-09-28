// lib/date.ts
export const toLocalInput = (iso?: string | Date | null) => {
  if (!iso) return "";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return t.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
};

export const formatID = (d?: string | Date | null) => {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hh}:${mm}`;
};
