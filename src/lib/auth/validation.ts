export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  const email = normalizeEmail(raw);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 120;
}

export function passwordIssues(password: string): string | null {
  if (password.length < 8) return 'Use at least 8 characters.';
  if (password.length > 128) return 'That password is too long.';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Use a letter and a number.';
  }
  return null;
}

export function displayNameIssues(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (trimmed.length > 40) return 'Keep the name under 40 characters.';
  return null;
}
