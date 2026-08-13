// Pure validation for the early-access capture — kept out of the route so
// it's unit-testable.
export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const s = email.trim();
  return s.length >= 5 && s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}
