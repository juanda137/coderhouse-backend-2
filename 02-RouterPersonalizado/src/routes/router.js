import {Router} from "express"

export class CustomRouter{
    #router
    constructor(){
        this.#router=Router()
        this.init()
    }

    init(){}

    getRouter(){
        return this.#router
    }

    get(ruta, ...funciones){   // los ... son el operador rest
        this.#router.get(ruta, this.misRespuestas, funciones)
    }

    misRespuestas=(req, res, next)=>{
        res.success=datoRespuesta=>res.status(200).json({
            status:"OK", 
            fecha:new Date().toLocaleDateString(),
            payload:datoRespuesta
        })

        res.badrequest=error=>res.status(400).json({
            status:"Bad Request", error,
            fecha:new Date().toLocaleDateString(),
        })

        res.unauthorized=error=>res.status(401).json({
            status:"unauthorized", error
        })

        res.internalerror=error=>res.status(500).json({
            status:"Internal server error", error
        })

        next()
    }

}