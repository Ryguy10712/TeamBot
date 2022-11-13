import { PCLTeam } from "./PCLTeam";
export default interface PCLPlayer {
    team: PCLTeam | undefined;
    oculusId: string;
    discordID: string;
    isCaptain: boolean | undefined;
    isCoCap: boolean | undefined;
    isBotAdmin: boolean | undefined;
}
