// Run with: node --experimental-strip-types --test test/helpers/parseCoachResponse.test.ts
import test from "node:test";
import assert from "node:assert/strict";

import { parseCoachResponse } from "../../src/utils/parseCoachResponse.ts";

test("parses the canonical five-section coach reply (stock market academy example)", () => {
  const reply = [
    "What I said:",
    "I work in stock market academy",
    "",
    "Better English:",
    "I work at a stock market academy.",
    "",
    "More natural:",
    "I work at a financial markets training academy.",
    "",
    "Explanation in Hebrew:",
    'אומרים "work at" עבור מקום עבודה, וצריך את המילית "a" לפני שם המוסד.',
    "",
    "Continue the conversation:",
    "That sounds interesting! What do you teach there?",
  ].join("\n");

  const r = parseCoachResponse(reply);
  assert.equal(r.whatISaid, "I work in stock market academy");
  assert.equal(r.betterEnglish, "I work at a stock market academy.");
  assert.equal(r.moreNatural, "I work at a financial markets training academy.");
  assert.match(r.explanationHe, /work at/);
  assert.equal(r.continue, "That sounds interesting! What do you teach there?");
});

test("handles an already-correct sentence (repeated unchanged)", () => {
  const reply = [
    "What I said: I went to the park yesterday.",
    "Better English: I went to the park yesterday.",
    "More natural: I went to the park yesterday.",
    "Explanation in Hebrew: המשפט כבר נכון וטבעי, כל הכבוד!",
    "Continue the conversation: Nice! What did you do at the park?",
  ].join("\n");

  const r = parseCoachResponse(reply);
  assert.equal(r.betterEnglish, "I went to the park yesterday.");
  assert.equal(r.moreNatural, "I went to the park yesterday.");
  assert.match(r.explanationHe, /כל הכבוד/);
  assert.equal(r.continue, "Nice! What did you do at the park?");
});

test("is case-insensitive and tolerates missing colons and markdown markers", () => {
  const reply = [
    "**What I said** I like coffee",
    "## better english: I like coffee",
    "More Natural - I love coffee",
    "Continue the conversation: Me too! How do you take it?",
  ].join("\n");

  const r = parseCoachResponse(reply);
  assert.equal(r.whatISaid, "I like coffee");
  assert.equal(r.betterEnglish, "I like coffee");
  assert.equal(r.moreNatural, "I love coffee");
  // Missing section yields empty string, not a crash.
  assert.equal(r.explanationHe, "");
  assert.equal(r.continue, "Me too! How do you take it?");
});

test("tolerates a missing middle section without bleeding content across labels", () => {
  const reply = [
    "What I said: hello",
    "Better English: Hello.",
    "Continue the conversation: Hi there, how are you?",
  ].join("\n");

  const r = parseCoachResponse(reply);
  assert.equal(r.whatISaid, "hello");
  assert.equal(r.betterEnglish, "Hello.");
  assert.equal(r.moreNatural, "");
  assert.equal(r.explanationHe, "");
  assert.equal(r.continue, "Hi there, how are you?");
});

test("falls back to raw text when no labels are present", () => {
  const r = parseCoachResponse("Sorry, I didn't catch that.");
  assert.equal(r.whatISaid, "");
  assert.equal(r.betterEnglish, "");
  assert.equal(r.raw, "Sorry, I didn't catch that.");
});

test("handles empty input safely", () => {
  const r = parseCoachResponse("");
  assert.equal(r.raw, "");
  assert.equal(r.continue, "");
});
