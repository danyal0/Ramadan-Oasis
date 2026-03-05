import assert from "node:assert/strict";
import test from "node:test";
import { POST as register } from "../../src/app/api/register/route";
import { GET as getCommunityPosts } from "../../src/app/api/community/posts/route";
import { createSessionCookieValue } from "../../src/lib/auth";

test("registration route accepts valid payload", async () => {
  const response = await register(
    new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: "Test Participant",
        email: "participant@example.com",
        timezone: "UTC",
        contributionAmount: 75,
        intention: "Integration test flow",
      }),
    }),
  );

  assert.equal(response.status, 200);
});

test("registration route rejects invalid payload", async () => {
  const response = await register(
    new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: "A",
        email: "bad-email",
      }),
    }),
  );

  assert.equal(response.status, 400);
});

test("community route requires authentication", async () => {
  const response = await getCommunityPosts(
    new Request("http://localhost:3000/api/community/posts?offeringSlug=ramadan-oasis", {
      method: "GET",
    }),
  );

  assert.equal(response.status, 401);
});

test("community route allows enrolled authenticated participant", async () => {
  const cookie = `oumnur_session=${createSessionCookieValue({
    email: "participant@example.com",
    name: "Participant User",
    role: "participant",
  })}`;

  const response = await getCommunityPosts(
    new Request("http://localhost:3000/api/community/posts?offeringSlug=ramadan-oasis", {
      method: "GET",
      headers: {
        cookie,
      },
    }),
  );

  assert.equal(response.status, 200);
});
