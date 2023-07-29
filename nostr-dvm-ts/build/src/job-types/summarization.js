import { validateJobRequest } from "../validations/index.js";
import { inProgress } from "../jobs/reactions/in-progress.js";
export async function onNewSummarizationJob(event) {
    console.log("New summarization job");
    await validateJobRequest(event);
    inProgress(event);
}
//# sourceMappingURL=summarization.js.map