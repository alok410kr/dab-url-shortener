import express from 'express'
import { postRequestBodySchema, loginPostRequestBodySchema } from '../validation/request.validation.js';
import { hashPasswordWithSalt } from '../utils/hash.js';
import { createUser, getUserByEmail } from '../services/user.service.js';
import { createUserToken } from '../utils/token.js';

const router = express.Router();


router.post('/signup',async (req,res)=>{
    const validationResult = await postRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
        return res.status(400).json({error: validationResult.error.format()});
    }

    const {firstname, lastname, email, password} = validationResult.data;


    const existingUser = await getUserByEmail(email);

    if(existingUser) return res.status(400).json({error: `User with email: ${email} already exists`});

    const {salt, password: hashedPswrd} = hashPasswordWithSalt(password);

    const user = await createUser(firstname, lastname, email, salt, hashedPswrd);

    return res.status(201).json({data:{ userId: user.id}})

})

router.post('/login', async (req,res)=>{
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error)
        return res.status(400).json({error: validationResult.error});

    const {email, password} = validationResult.data;

    const user = await getUserByEmail(email);

    if(!user) return res.status(404).json({error: `user with email: ${email} doesn't exist`});

    const {password: hashedPswrd} = hashPasswordWithSalt(password,user.salt)

    if(user.password !== hashedPswrd){
        return res
                .status(400)
                .json({error: `Invalid Password`})
    }

  const token = await createUserToken({id: user.id})

    return res.json({token})

})

export default router;