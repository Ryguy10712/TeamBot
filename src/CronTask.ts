import cron from "node-cron"
import { TeamBot } from "./Bot"
export abstract class CronTask {
    public function: Function
    public date: Date

    constructor(date: Date, func: Function, teamBot: TeamBot){
        this.date = date
        this.function = func
        
        cron.schedule("* * * * *", this.execute)
    }

    abstract execute(): void
}