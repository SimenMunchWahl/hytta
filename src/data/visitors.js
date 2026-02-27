// Legg til flere besok i listen under.
export const VISITORS = [
  {
    guests: ["Tove", "Bård"],
    isDefault: true,
  },
  {
    guests: ["David", "Johan"],
    startDate: "2026-03-04",
    endDate: "2026-03-08",
    note: "Johan og David skal pa besok 3-8 mars.",
  },
];

function toLocalIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatGuestNames(names) {
  if (names.length <= 1) return names[0] || "gjest";
  if (names.length === 2) return `${names[0]} & ${names[1]}`;

  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

function toDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(isoDate, days) {
  const next = toDate(isoDate);
  next.setDate(next.getDate() + days);
  return toLocalIsoDate(next);
}

function findRelevantVisitor(isoToday) {
  return VISITORS.find((visitor) => {
    if (!visitor.startDate || !visitor.endDate) return false;

    const twoDaysBefore = addDays(visitor.startDate, -2);
    return isoToday >= twoDaysBefore && isoToday <= visitor.endDate;
  });
}

const MONTH_NAMES = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

function formatShortDate(isoDate) {
  const date = toDate(isoDate);
  return `${date.getDate()}.${MONTH_NAMES[date.getMonth()]}`;
}

function getActiveGuestNames(today = new Date()) {
  const isoToday = toLocalIsoDate(today);
  const datedVisitor = findRelevantVisitor(isoToday);

  if (datedVisitor) {
    return datedVisitor.guests;
  }

  const defaultVisitor = VISITORS.find((visitor) => visitor.isDefault);
  return defaultVisitor?.guests || ["gjest"];
}

export function getWelcomeMessage(today = new Date()) {
  return `Velkommen, ${formatGuestNames(getActiveGuestNames(today))}`;
}

export function getVisitPhaseCta(today = new Date()) {
  const isoToday = toLocalIsoDate(today);
  const visitor = findRelevantVisitor(isoToday);

  if (!visitor?.startDate || !visitor?.endDate) return null;

  const twoDaysBefore = addDays(visitor.startDate, -2);

  if (isoToday === visitor.endDate) {
    return { label: "Før dere drar", targetId: "for-dere-drar" };
  }

  if (isoToday >= visitor.startDate && isoToday < visitor.endDate) {
    return { label: "Under oppholdet", targetId: "under-oppholdet" };
  }

  if (isoToday >= twoDaysBefore && isoToday < visitor.startDate) {
    return { label: "Før dere kommer", targetId: "for-dere-kommer" };
  }

  return null;
}

export function getHeaderVisitInfo(today = new Date()) {
  const isoToday = toLocalIsoDate(today);
  const relevantVisitor = findRelevantVisitor(isoToday);

  if (relevantVisitor) {
    return {
      guestsLabel: formatGuestNames(relevantVisitor.guests),
      stayLabel: `Opphold: ${formatShortDate(relevantVisitor.startDate)} - ${formatShortDate(relevantVisitor.endDate)}`,
    };
  }

  const defaultVisitor = VISITORS.find((visitor) => visitor.isDefault);
  if (!defaultVisitor) return null;

  return {
    guestsLabel: formatGuestNames(defaultVisitor.guests),
    stayLabel: null,
  };
}
