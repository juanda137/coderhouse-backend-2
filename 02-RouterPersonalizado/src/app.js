import express from 'express';
import { router as normalRouter } from './routes/normalRouter.js';
import { HeroesRouter } from './routes/heroesRouter.js';
const PORT=3000;

const app=express();
const heroesRouter=new HeroesRouter()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/normal", normalRouter)
app.use("/api/heroes", heroesRouter.getRouter())

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
