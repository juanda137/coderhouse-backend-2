import { Router } from 'express';
export const router=Router()
export const m1=(req, res, next)=>{
    console.log(`m1...!!!`);
    next()
}

const m2=(req, res, next)=>{
    console.log(`m2...!!!`);
    next()
}

const controller=(req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"prueba...!!!"});
}

const funciones=[m1, m2, controller]

router.get('/', m1, (req,res)=>{

    

    res.setHeader('Content-Type','application/json')
    res.status(200).json({message:"get...!!! normal"})
})

router.get('/prueba', funciones)

router.post('/',(req,res)=>{

    

    res.setHeader('Content-Type','application/json')
    res.status(201).json({})
})
