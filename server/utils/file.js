import { HOST } from "../constant/constant.js";

export function getPathFile(params) {
  let endpointURL = "";
  const host = HOST;
  const fileSSL = process.env.FILE_SSL;
  const middlePath = "/file/";
  if (params !== null) {
    if (fileSSL) {
      endpointURL = host;
    } else {
      endpointURL = host;
    }
  } else {
    return null;
  }
  endpointURL += middlePath + params;
  return endpointURL;
}
