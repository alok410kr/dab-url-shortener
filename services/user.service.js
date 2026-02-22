import { eq } from "drizzle-orm";
import { usersTable } from "../models/user.model.js";
import {db} from "../db/index.js"


export const getUserByEmail = async (email)=>{
    const [existingUser] = await db
                                .select({
                                    id: usersTable.id,
                                    firstname: usersTable.firstname,
                                    lastname: usersTable.lastname,
                                    email: usersTable.email
})
                                .from(usersTable)
                                .where(eq(email,usersTable.email));

    return existingUser;
}


export const createUser = async (firstname,
                        lastname,
                        email,
                        salt,
                         hashedPswrd)=>{
                            const [user] = await db  
                                                .insert(usersTable)
                                                .values({
                                                    firstname,
                                                    lastname,
                                                    email,
                                                    salt,
                                                    password: hashedPswrd
                                                }).returning({id: usersTable.id})
        return user;

}