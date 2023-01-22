import { PrismaClient } from "@prisma/client";
import { TeamBot } from "../Bot";
import { availability, DayOfWeek, time } from "../interfaces/PCLTeam";

export class SlowQuery {
    protected prisma: PrismaClient;
    public items : {status: boolean, day: DayOfWeek, time: time, playerId: string}[]
    protected handle: NodeJS.Timer | null
    private ready: Boolean

    constructor(teamBot: TeamBot) {
        this.items = []
        this.prisma = teamBot.prisma
        this.handle = null
        this.ready = true

        this.handle = setInterval(() => {
            if(this.items.length == 0 || !this.ready){
                return;
            }
            this.ready = false;
            this.prisma.teamPlayer.findFirst({where: {playerId: this.items[0].playerId}}).then((player) => {
                let currentAvail = player![this.items[0].day]?.valueOf() as availability
                currentAvail[this.items[0].time] = this.items[0].status;
                let args = {where: {playerId: this.items[0].playerId}, data: {[this.items[0].day]: currentAvail}}
                this.prisma.teamPlayer.update(args).then(() => {
                    this.prisma.$disconnect().then(() => {this.ready = true})
                    this.items.splice(0, 1)
                })
            })
           
        })
    }

    

    enqueue(status: boolean, day: DayOfWeek, time: time, playerId: string){
       if(this.items.length ==0) {
        this.items = [{status: status, time: time, playerId: playerId, day: day}]
       } else {
        this.items = this.items.concat({status: status, day: day, time: time, playerId: playerId})
       }
    }

    

   

}