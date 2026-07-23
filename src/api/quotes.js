import client from "./client";

export const getQuotes = async () => {
  const res = await client.get("/quotes");
  return res.data;
};

export const getRandomQuote = async () => {
  const res = await client.get("/quotes/random");
  return res.data;
};
