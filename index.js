import mongoose from "mongoose";
import chalk from "chalk";
import { createServer } from "./server.js";
import { config } from "./Config.js";

const log = (msg) => console.log(chalk.cyan(msg));

const bootstrap = async (config) => {
  await mongoose.connect(config.MONGODB_URI);
  const server = createServer(config);

  const port = config.PORT;

  return server.listen(port, () => {
    const timestamp = new Date().toISOString();
    log(`[${timestamp}] Server listening on port ${port}...`);
    log(`[${timestamp}] http://localhost:${port}`);
  });
};

bootstrap(config).catch((error) => {
  console.error(chalk.red(error));
  process.exit(1);
});
