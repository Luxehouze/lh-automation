import { exec, spawn } from "child_process";
import dotenv from "dotenv";
import path from "path";

// tentukan environment dari NODE_ENV, default ke "production"
const ENV_NAME = process.env.NODE_ENV || "production";

// load env/.env.production atau env/.env.staging, dst
dotenv.config({
  path: path.join(process.cwd(), `env/.env.${ENV_NAME}`),
});

// (opsional) kalau mau juga load env/.env sebagai default:
dotenv.config({
  path: path.join(process.cwd(), "env/.env"),
});

// sekarang BASE_URL dari .env.production harus kebaca
console.log("BASE_URL loaded =", process.env.BASE_URL);

//setting retry value from environment variables or defaulting to 0 if not set
const parallelValue = process.env.PARALLEL || '1';

//Define a common command string for running cucumber tests
const common = `./src/features/*.feature \
  --require-module ts-node/register \
  --require ./src/step-definitions/**/**/*.ts \
  --require ./src/utils/cucumber-timeout.ts \
  -f json:./reports/report.json \
  --format progress \
  --format html:./reports/report1.html \
  --parallel ${parallelValue} \
  --tags "not @ignore"`;

//Define an interface for the profiles object
//It defines an interface where each key is a string and its value is also a string
interface ProfileCommands {
    [key: string]: string;
}

//Define a command strings for different test profiles
const profiles: ProfileCommands = {
    smoke: `${common} --tags "@smoke"`,
    regression: `${common} --tags "@regression"`,
    regressionWebkit: `UI_AUTOMATION_BROWSER=webkit ${common} --tags "@regression"`,
    home: `${common} --tags "@home"`,
    beauty: `${common} --tags "@beauty"`,
    watch: `${common} --tags "@watch"`,
    fashion: `${common} --tags "@fashion"`,
}

//Get the third command-line argument and assign it to the profile
//i.e. smoke, regression etc
const profile = process.argv[2];

//Construct the command string based on the selected profile
//command is the full command to run the tests for the selected profile
let command = `npx cucumber-js ${profiles[profile as 'smoke' | 'regression' | 'login' | 'contact-us']}`;

//Print the constructed command
//console.log(command);

//Execute the command
exec(command, { encoding: 'utf-8'}, (error: Error | null, stdout: string) =>{
  //Log the output of the command
  console.log(stdout);

  if (error instanceof Error) {
    throw new Error(`⚠️ 💥 ${error.message} ⚠️ 💥`);
  } else if (typeof error === 'string') {
    throw new Error(`⚠️ 💥 ${error} ⚠️ 💥`);
  } else if (error) {
    throw new Error('⚠️ 💥 An unknown error occurred during test execution. ⚠️ 💥');
  }
});