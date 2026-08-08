/** @type {import('@cucumber/cucumber/lib/configuration').IConfiguration} */
module.exports = {
  default: {
    paths: ["e2e/features/**/*.feature"],
    requireModule: ["tsx/cjs"],
    require: ["e2e/support/**/*.ts", "e2e/steps/**/*.ts"],
    format: ["progress"],
    publishQuiet: true,
    timeout: 60_000,
  },
};
