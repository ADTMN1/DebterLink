import { test, expect } from "@playwright/test";

test.describe("Assignment Workflow", () => {
  test("should create assignment", async ({ page }) => {
    await page.goto("/dashboard/assignments");

    await page.click('button:has-text("Create Assignment")');
    await page.fill('input[name="title"]', "Math Homework");
    await page.fill('textarea[name="description"]', "Complete exercises 1-10");
    await page.fill('input[name="dueDate"]', "2024-12-31");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Math Homework")).toBeVisible();
  });

  test("should view assignment details", async ({ page }) => {
    await page.goto("/dashboard/assignments");

    await page.click("text=Math Homework");

    await expect(page.locator("h1")).toContainText("Math Homework");
    await expect(page.locator("text=Complete exercises 1-10")).toBeVisible();
  });
});
