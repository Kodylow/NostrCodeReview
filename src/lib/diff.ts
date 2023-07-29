import { exec } from "@replit/extensions";
import * as Diff2HTML from "diff2html";

export async function checkDiffs() {
  const { output } = await exec.exec(`git diff`);

  const diffJson = Diff2HTML.parse(output);

  return diffJson;
}
