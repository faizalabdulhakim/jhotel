// server/api/user.ts
import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
  const { users } = await $fetch<{ users: any[] }>(
    "https://dummyjson.com/users?limit=10"
  );
  return { users };
});
