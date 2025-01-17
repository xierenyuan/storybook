import type { Task } from '../task';
import { exec } from '../utils/exec';
import { PORT } from './serve';

export const testRunner: Task = {
  description: 'Run the test runner against a sandbox',
  junit: true,
  dependsOn: ['run-registry', 'serve'],
  async ready() {
    return false;
  },
  async run({ sandboxDir, junitFilename }, { dryRun, debug }) {
    const execOptions = { cwd: sandboxDir };

    await exec(`yarn add --dev @storybook/test-runner`, execOptions);

    await exec(
      `yarn test-storybook --url http://localhost:${PORT} --junit`,
      {
        ...execOptions,
        env: {
          JEST_JUNIT_OUTPUT_FILE: junitFilename,
        },
      },
      { dryRun, debug }
    );
  },
};
