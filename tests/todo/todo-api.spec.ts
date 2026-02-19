import { test, expect } from '@playwright/test';

/**
 * todo-api.spec.ts — API Testing with Playwright
 *
 * ─── WHAT IS API TESTING? ────────────────────────────────────────────────────
 * UI tests drive a real browser and interact with the page visually.
 * API tests skip the browser entirely and talk directly to the server
 * over HTTP — making them much faster and less flaky.
 *
 * Both types complement each other:
 *   - API tests: fast, reliable, great for backend logic
 *   - UI tests: slower, but verify what the user actually sees
 *
 * ─── THE `request` FIXTURE ───────────────────────────────────────────────────
 * In UI tests you use `{ page }` to control a browser.
 * In API tests you use `{ request }` to send HTTP requests.
 *
 *   test('example', async ({ request }) => { ... })
 *
 * ─── THE API WE'RE USING ─────────────────────────────────────────────────────
 * TodoMVC (demo.playwright.dev/todomvc) is frontend-only — no real API.
 * Instead we use JSONPlaceholder (jsonplaceholder.typicode.com), a free
 * public fake REST API used for learning and prototyping.
 *
 * Every todo object looks like this:
 *   {
 *     "id":        1,
 *     "userId":    1,
 *     "title":     "delectus aut autem",
 *     "completed": false
 *   }
 *
 * IMPORTANT: JSONPlaceholder simulates a real API but does NOT actually
 * persist data. A POST will return a 201 with a fake new ID, but no record
 * is really saved. This is perfect for learning without side effects.
 */

const BASE = 'https://jsonplaceholder.typicode.com';

// ─── GET: Fetch a single todo ─────────────────────────────────────────────────
//
// Equivalent to: opening the app and checking a todo is visible.
// Here we ask the server for one specific todo by its ID and verify
// the response has the shape and values we expect.

test('fetch a single todo by ID', async ({ request }) => {
  // request.get() sends an HTTP GET request to the given URL.
  // It returns a Response object — not the data itself yet.
  const response = await request.get(`${BASE}/todos/1`);

  // Every HTTP response has a status code.
  // 200 means "OK" — the request succeeded and data was returned.
  expect(response.status()).toBe(200);

  // response.json() parses the response body as JSON.
  // We cast it so TypeScript knows the shape.
  const todo = await response.json() as {
    id: number;
    title: string;
    completed: boolean;
  };

  // Assert the data has the structure we expect
  expect(todo.id).toBe(1);
  expect(typeof todo.title).toBe('string');
  expect(todo.title.length).toBeGreaterThan(0);
  expect(typeof todo.completed).toBe('boolean');
});

// ─── POST: Create a new todo ──────────────────────────────────────────────────
//
// Equivalent to: typing in the input and pressing Enter to add a todo.
// We send the new todo's data in the request body; the server returns
// the created object with a new ID assigned.

test('create a new todo', async ({ request }) => {
  // request.post() sends an HTTP POST request.
  // The `data` option sets the request body (sent as JSON automatically).
  const response = await request.post(`${BASE}/todos`, {
    data: {
      title: 'Buy milk',
      completed: false,
      userId: 1,
    },
  });

  // 201 means "Created" — the server successfully created a new resource.
  // This is different from 200: use 200 for reads, 201 for creates.
  expect(response.status()).toBe(201);

  const todo = await response.json() as {
    id: number;
    title: string;
    completed: boolean;
  };

  // The server echoes back the data we sent, plus a new `id`
  expect(todo.title).toBe('Buy milk');
  expect(todo.completed).toBe(false);

  // JSONPlaceholder assigns ID 201 to any new fake resource
  expect(todo.id).toBeDefined();
});

// ─── PUT: Mark a todo as complete ────────────────────────────────────────────
//
// Equivalent to: clicking the checkbox to mark a todo as done.
// PUT replaces the entire resource. We send the full object back
// with `completed` changed to true.

test('mark a todo as complete', async ({ request }) => {
  // First, fetch the existing todo so we have its current data
  const getResponse = await request.get(`${BASE}/todos/1`);
  const existing = await getResponse.json() as {
    id: number;
    title: string;
    completed: boolean;
    userId: number;
  };

  // request.put() sends an HTTP PUT request.
  // We spread the existing object and override only `completed`.
  const response = await request.put(`${BASE}/todos/${existing.id}`, {
    data: {
      ...existing,
      completed: true,
    },
  });

  // 200 means the update succeeded
  expect(response.status()).toBe(200);

  const updated = await response.json() as { completed: boolean };

  // The server returns the updated object — verify completed is now true
  expect(updated.completed).toBe(true);
});

// ─── DELETE: Remove a todo ────────────────────────────────────────────────────
//
// Equivalent to: hovering a todo and clicking the delete button.
// We tell the server to delete a resource by its ID.
// On success the server returns an empty body — there's nothing to read back.

test('delete a todo', async ({ request }) => {
  // request.delete() sends an HTTP DELETE request
  const response = await request.delete(`${BASE}/todos/1`);

  // 200 means the deletion was accepted
  expect(response.status()).toBe(200);

  // The response body for a DELETE is typically empty — just confirm that
  const body = await response.json();
  expect(body).toEqual({});
});

// ─── GET with filter: Active todos only ───────────────────────────────────────
//
// Equivalent to: clicking the "Active" filter to see incomplete todos.
// REST APIs often support query parameters for filtering.
// ?completed=false tells the server to only return active todos.

test('fetch only active (incomplete) todos', async ({ request }) => {
  // Query parameters are appended to the URL after a `?`
  // This is how REST APIs filter data without a separate endpoint
  const response = await request.get(`${BASE}/todos?completed=false`);

  expect(response.status()).toBe(200);

  const todos = await response.json() as { completed: boolean }[];

  // We should get back an array of todos
  expect(Array.isArray(todos)).toBe(true);
  expect(todos.length).toBeGreaterThan(0);

  // Every item in the result must have completed === false
  for (const todo of todos) {
    expect(todo.completed).toBe(false);
  }
});

// ─── BONUS: Response headers ──────────────────────────────────────────────────
//
// HTTP responses include headers — metadata about the response.
// The most important one for APIs is `Content-Type`, which tells
// us the format of the data being returned.

test('response includes correct content-type header', async ({ request }) => {
  const response = await request.get(`${BASE}/todos/1`);

  // headers() returns all response headers as a key-value object
  const headers = response.headers();

  // APIs that return JSON must set Content-Type to application/json
  expect(headers['content-type']).toContain('application/json');
});
