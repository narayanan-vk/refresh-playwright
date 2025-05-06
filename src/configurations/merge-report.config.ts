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
        trend: "./monocart-report/index.json",
      },
    ],
  ],
};
