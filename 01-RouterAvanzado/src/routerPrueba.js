import { Router } from 'express';
export const router = Router()

router.get("/productos/:id([0-9]+)/:color([a-zA-Z%20]+)", (req, res)=>{
    let {id, color}=req.params
    if(color!="rojo"){

    }

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:{id, color}});
})

router.get('/palabra/:palabra([a-zA-Z]+)', (req, res) => {

    let { palabra } = req.params

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ palabra })
})

router.get('/nombre/:nombre([a-zA-Z%20]+)', (req, res) => {

    let { nombre } = req.params

    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ nombre })
})

router.get('/numero/:numero([0-9]+)', (req, res) => {

    let { numero } = req.params
    let tipo = typeof numero


    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({ numero, tipo })
})

router.get('/ab+cd', (req, res) => {
    res.send('ab+cd')
})

router.get("*", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(404).json({ error: `page not found | 404` })
})