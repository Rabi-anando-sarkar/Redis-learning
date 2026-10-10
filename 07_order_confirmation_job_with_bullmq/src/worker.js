import { Worker } from "bullmq";
import { connection } from "./queue.js";

const emailWorker = new Worker(
    'emails',
    async (Job) => {
        console.log(`Processing email job... 
        jobId : ${Job.id} :: 
        jobName : ${Job.name} ::
        jobDate : ${Job.data} ::
        `)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log(`Email job completed... 
        jobId : ${Job.id} :: 
        jobName : ${Job.name} ::
        jobDate : ${Job.data} ::
        `)
    },
    {
        connection
    }
)

emailWorker.on("completed", (Job) => {
    console.log(`Email job completed... 
        jobId : ${Job.id} :: 
        jobName : ${Job.name} ::
        jobDate : ${Job.data} ::
        `)
})

emailWorker.on("failed", (Job) => {
    console.log(`Email job completed... 
        jobId : ${Job.id} :: 
        jobName : ${Job.name} ::
        jobDate : ${Job.data} ::
        `)
})