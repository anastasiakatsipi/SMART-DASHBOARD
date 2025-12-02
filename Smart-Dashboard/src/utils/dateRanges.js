export function createRange(rangeKey) {
  const now = new Date();
  let start = new Date();

  if (rangeKey === "24h") start.setDate(now.getDate() - 1);
  if (rangeKey === "7d")  start.setDate(now.getDate() - 7);
  if (rangeKey === "1m")  start.setMonth(now.getMonth() - 1);
  if (rangeKey === "3m")  start.setMonth(now.getMonth() - 3);

  return {
    from: start.toISOString().slice(0, 19),
    to: now.toISOString().slice(0, 19),
  };
}
