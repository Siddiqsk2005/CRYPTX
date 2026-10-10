import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  joinedAt: string;
  bio: string;
};

type PendingOtpRecord = {
  mode: "login" | "register";
  identifier: string;
  username?: string;
  password?: string;
  code: string;
  expiresAt: string;
};

type AuthContextValue = {
  authReady: boolean;
  user: AuthUser | null;
  users: AuthUser[];
  signIn: (payload: { identifier: string; username?: string; password?: string }) => Promise<AuthUser>;
  requestOtp: (payload: { mode: "login" | "register"; identifier: string; username?: string; password?: string }) => Promise<{ code: string }>;
  verifyOtp: (payload: { mode: "login" | "register"; identifier: string; code: string; username?: string; password?: string }) => Promise<AuthUser>;
  signOut: () => Promise<void>;
};

const USERS_STORAGE_KEY = "sentinel-ai-pro:users";
const SESSION_STORAGE_KEY = "sentinel-ai-pro:session";
const OTP_STORAGE_KEY = "sentinel-ai-pro:otp";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeIdentifier(value: string) {
  return value.trim().toLowerCase();
}

function findUserByIdentifier(users: AuthUser[], identifier: string) {
  const normalized = normalizeIdentifier(identifier);

  return users.find((user) =>
    [user.username, user.email, user.mobile].filter(Boolean).map(normalizeIdentifier).includes(normalized),
  );
}

function buildAuthUser({
  identifier,
  username,
  password,
}: {
  identifier: string;
  username?: string;
  password?: string;
}): AuthUser {
  const cleanIdentifier = identifier.trim();
  const looksLikeEmail = cleanIdentifier.includes("@");
  const looksLikeMobile = cleanIdentifier.startsWith("+") || /^\d+$/.test(cleanIdentifier);

  return {
    id: `auth-user-${crypto.randomUUID()}`,
    username: username?.trim() || (!looksLikeEmail && !looksLikeMobile ? cleanIdentifier : `user_${Math.floor(Math.random() * 9000 + 1000)}`),
    email: looksLikeEmail ? cleanIdentifier : "",
    mobile: looksLikeMobile ? cleanIdentifier : "",
    password: password?.trim() || "secure-password",
    role: "Security Analyst",
    joinedAt: new Date().toISOString(),
    bio: "Sentinel AI Pro access profile for threat monitoring activity.",
  };
}

function upsertAuthUser(
  users: AuthUser[],
  payload: { identifier: string; username?: string; password?: string },
) {
  const existingUser = findUserByIdentifier(users, payload.identifier);

  if (!existingUser) {
    const createdUser = buildAuthUser(payload);
    return {
      user: createdUser,
      users: [...users, createdUser],
    };
  }

  const updatedUser: AuthUser = {
    ...existingUser,
    username: payload.username?.trim() || existingUser.username,
    password: payload.password?.trim() || existingUser.password,
    email: existingUser.email || (payload.identifier.includes("@") ? payload.identifier.trim() : ""),
    mobile:
      existingUser.mobile ||
      (!payload.identifier.includes("@") && (payload.identifier.startsWith("+") || /^\d+$/.test(payload.identifier.trim()))
        ? payload.identifier.trim()
        : ""),
  };

  return {
    user: updatedUser,
    users: users.map((user) => (user.id === existingUser.id ? updatedUser : user)),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const storedUsers = readStorage<AuthUser[]>(USERS_STORAGE_KEY, []);
    const storedSession = readStorage<{ userId: string | null }>(SESSION_STORAGE_KEY, { userId: null });

    setUsers(storedUsers);
    setUser(storedUsers.find((item) => item.id === storedSession.userId) ?? null);
    setAuthReady(true);
  }, []);

  const persistUsers = (nextUsers: AuthUser[]) => {
    setUsers(nextUsers);
    writeStorage(USERS_STORAGE_KEY, nextUsers);
  };

  const persistSession = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    writeStorage(SESSION_STORAGE_KEY, { userId: nextUser?.id ?? null });
  };

  const signIn = async ({ identifier, username, password }: { identifier: string; username?: string; password?: string }) => {
    const result = upsertAuthUser(users, { identifier, username, password });
    persistUsers(result.users);
    persistSession(result.user);
    return result.user;
  };

  const requestOtp = async ({
    mode,
    identifier,
    username,
    password,
  }: {
    mode: "login" | "register";
    identifier: string;
    username?: string;
    password?: string;
  }) => {
    const code = `${Math.floor(100000 + Math.random() * 900000)}`;
    const otpRecord: PendingOtpRecord = {
      mode,
      identifier,
      username,
      password,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };

    writeStorage(OTP_STORAGE_KEY, otpRecord);
    return { code };
  };

  const verifyOtp = async ({
    mode,
    identifier,
    code,
    username,
    password,
  }: {
    mode: "login" | "register";
    identifier: string;
    code: string;
    username?: string;
    password?: string;
  }) => {
    const pendingOtp = readStorage<PendingOtpRecord | null>(OTP_STORAGE_KEY, null);

    if (!pendingOtp || pendingOtp.mode !== mode || normalizeIdentifier(pendingOtp.identifier) !== normalizeIdentifier(identifier)) {
      throw new Error("Request a new OTP first.");
    }

    if (new Date(pendingOtp.expiresAt).getTime() < Date.now()) {
      throw new Error("OTP expired. Request a fresh OTP.");
    }

    if (pendingOtp.code !== code.trim()) {
      throw new Error("Incorrect OTP.");
    }

    const result = upsertAuthUser(users, {
      identifier,
      username: username ?? pendingOtp.username,
      password: password ?? pendingOtp.password,
    });

    persistUsers(result.users);
    persistSession(result.user);
    writeStorage(OTP_STORAGE_KEY, null);
    return result.user;
  };

  const signOut = async () => {
    persistSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authReady,
        user,
        users,
        signIn,
        requestOtp,
        verifyOtp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
