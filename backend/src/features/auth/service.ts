import bcrypt from "bcryptjs";

import { createUser, findUserByEmail } from "./userRepository";

const SALT_ROUNDS = 10;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function registerUser(input: { email: string; password: string; displayName: string }) {
  const email = normalizeEmail(input.email);
  const displayName = input.displayName.trim();

  const existing = await findUserByEmail(email);
  if (existing) {
    return { ok: false as const, code: "EMAIL_TAKEN" };
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await createUser({
    email,
    passwordHash,
    displayName,
    createdAt: new Date().toISOString()
  });

  return { ok: true as const, user };
}

export async function authenticateUser(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const user = await findUserByEmail(email);

  if (!user) {
    return { ok: false as const };
  }

  const passwordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordValid) {
    return { ok: false as const };
  }

  return { ok: true as const, user };
}
