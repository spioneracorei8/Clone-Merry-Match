import { v4 as uuidv4 } from "uuid";

function GenerateUUID() {
  return uuidv4();
}
export const NewUUID = GenerateUUID;

export function ConvertToThaiTime(params) {
  const thaiTimeOffset = 7 * 60 * 60 * 1000;

  const utcTime = params.getTime();

  const thaiTime = new Date(utcTime + thaiTimeOffset);

  return thaiTime;
}
