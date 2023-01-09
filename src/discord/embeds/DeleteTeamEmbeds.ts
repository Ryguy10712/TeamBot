import { EmbedBuilder } from "discord.js";

export const NotCaptainError = new EmbedBuilder().setColor("Red").setTitle("What...").setFields({
  name: "Failed:",
  value: "You are not the captain of a team."
})

export const Success = new EmbedBuilder().setColor("Green").setTitle("Gone...").setFields({
  name: "Success:",
  value: "Your team has been deleted."
})