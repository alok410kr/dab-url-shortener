import express from 'express'
import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import { nanoid } from 'nanoid';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';
import { createCode } from '../services/url.service.js';

const router = express.Router();

router.post('/shorten', ensureAuthenticated, async (req,res)=>{

const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body)

if(validationResult.error){
    return res
    .status(400)
    .json({error: validationResult.error});
}

const {url, code} = validationResult.data;

const shortCode = code ?? nanoid(6);

const result = await createCode(shortCode, url, req.user.id);

return res
    .status(201)
    .json({
        id: result.id,
        shortCode: result.shortCode, 
        targetUrl:result.targetURL})

})

export default router;