import { heroes } from "../data/heroes.js";
import { m1 } from "./normalRouter.js";
import { CustomRouter } from "./router.js";


export class HeroesRouter extends CustomRouter{
    init(){
        this.get("/", m1, (req, res)=>{

            let {nombre}=req.query
            if(nombre==="Juan"){
                return res.badrequest(`Juan no puede acceder a los datos`)
            }

            return res.success(heroes)
            // res.setHeader('Content-Type','application/json');
            // return res.status(200).json({payload:heroes});
        })

        this.get("/:id", (req, res)=>{

            let {id}=req.params

            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:heroes});
        })
        
    }
}