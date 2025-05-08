export default {
  testDir: "./tests/e2e",
  reporter: [
    ["github"],
    ["html"],
    [
      "monocart-reporter",
      {
        name: "Refresh Playwright Test Execution Report",
        outputFile: "./monocart-report/index.html",
        trend: process.env.TREND_FILE_PATH ?? "./monocart-report/index.json",
      },
    ],
  ],
};
