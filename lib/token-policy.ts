export type SingleUseTokenState = {
  expiresAt: Date;
  usedAt?: Date | null;
  revokedAt?: Date | null;
};

export function isSingleUseTokenUsable(
  token: SingleUseTokenState | null | undefined,
  now = new Date(),
) {
  return Boolean(
    token && !token.usedAt && !token.revokedAt && token.expiresAt >= now,
  );
}
