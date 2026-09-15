function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`missing required env var: ${name}`);
  }
  return value;
}

export const config = {
  discordClientId: () => requireEnv("DISCORD_CLIENT_ID"),
  discordClientSecret: () => requireEnv("DISCORD_CLIENT_SECRET"),
  discordRedirectUri: () => requireEnv("DISCORD_REDIRECT_URI"),

  vasyncGuildId: () => requireEnv("VASYNC_GUILD_ID"),
  entityRoleId: () => requireEnv("ENTITY_ROLE_ID"),
  researcherRoleId: () => requireEnv("RESEARCHER_ROLE_ID"),
  staffRoleId: () => requireEnv("STAFF_ROLE_ID"),

  vasyncServiceToken: () => requireEnv("VASYNC_SERVICE_TOKEN"),
  vasyncApiBaseUrl: () => requireEnv("VASYNC_API_BASE_URL"),

  sessionSecret: () => requireEnv("SESSION_SECRET"),
};
