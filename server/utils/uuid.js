import { v4 as uuidv4 } from "uuid";

function GeneratePKUUID() {
    return uuidv4();
}

export { GeneratePKUUID as newUUID };