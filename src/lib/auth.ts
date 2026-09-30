export function isAdminEmail(email?: string | null) {
  const admin = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  return !!admin && !!email && email.trim().toLowerCase() === admin;
}
