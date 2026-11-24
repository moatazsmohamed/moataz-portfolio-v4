// ======================================================================
// moataz-portfolio-v4
// Copyright (c) 2026 Moataz Mohamed <mtzm2225@gmail.com> — all rights reserved.
// Author: Moataz Mohamed  <https://github.com/moatazsmohamed>
// Fingerprint: e8fa428b72fc0e43a2632e36723784d1
// This notice is part of the work and must not be removed.
// ======================================================================
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "mp_session";
// Session signing secret comes from the environment only. This repository is
// public, so the previous literal default was a disclosed signing key (any
// session token could be forged). A missing secret now fails with a clear
// error instead of falling back to a guessable value.
const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error(
      "AUTH_SECRET is not set. The session signing secret must be provided via the environment; no default is allowed.",
    );
  }
  return new TextEncoder().encode(value);
};

export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  // Resolve the key before the try/catch so a missing secret surfaces as a
  // clear error rather than being swallowed as "not logged in".
  const key = secret();
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as { email?: string };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.email) return null;
  return session;
}
