import { setDefaultTimeout } from "@cucumber/cucumber";

//Load env variables from .env file
import { config as loadEnv } from "dotenv"
const env = loadEnv({ path: './env/.env' });

const customTimeout = parseInt(env.parsed?.CUCUMBER_CUSTOM_TIMEOUT || '60000');
// 60 detik, silakan naikkan/kurangi sesuai kebutuhan
setDefaultTimeout(11 * 1000);
