import { createHmac, randomBytes } from "node:crypto";


export const hashPasswordWithSalt = (password) =>{
 const salt = randomBytes(256).toString('hex');

    const hashedPswrd = createHmac('sha256',salt).update(password).digest('hex');

    return {salt,password: hashedPswrd};
}