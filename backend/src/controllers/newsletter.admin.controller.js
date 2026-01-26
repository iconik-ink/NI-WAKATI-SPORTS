import { Newsletter } from "../models/newsletter.model.js";
import { Parser } from "json2csv";

export const exportSubscribersCSV = async (req, res) => {
  const subscribers = await Newsletter.find().select("email createdAt");
  const parser = new Parser({ fields: ["email", "createdAt"] });
  const csv = parser.parse(subscribers);

  res.header("Content-Type", "text/csv");
  res.attachment("subscribers.csv");
  res.send(csv);
};
