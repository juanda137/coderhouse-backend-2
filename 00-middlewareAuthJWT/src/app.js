import express from 'express';
import passport from "passport"
import local from "passport-local"
import passportJWT from "passport-jwt"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { passportCall } from './utils.js';
import { heroes } from './data/heroes.js';
import { auth } from './middleware/auth.js';

const PORT=3000;

const app=express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize())

let usuarios=[
    {id:1, nombre:"Luciana", email:"luciana@test.com", password:"123", rol:"user"},
    {id:2, nombre:"Juan", email:"juan@test.com", password:"123", rol:"user"},
    {id:3, nombre:"Romina", email:"romina@test.com", password:"123", rol:"admin"},
]

passport.use("login", new local.Strategy(
    {usernameField:"email"},
    async(username, password, done)=>{
        try {
            let usuario=usuarios.find(u=>u.email===username)
            if(!usuario){
                return done(null, false, {message:`No existe el usuario ${username}`})
            }
            if(usuario.password!==password){
                return done(null, false, {message:`Credenciales invalidas`})
            }

            usuario={...usuario}
            delete usuario.password

            return done(null, usuario)
        } catch (error) {
            return done(error)
        }
    }
))

const buscarToken=(req)=>{
    let token=null

    if(req.cookies.CoderCookie){
        token=req.cookies.CoderCookie
    }

    return token
}

passport.use("current", new passportJWT.Strategy(
    {
        secretOrKey:"CoderCoder123",
        jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscarToken])
    },
    async(usuario, done)=>{
        try {
            return done(null, usuario)
        } catch (error) {
            return done(error)
        }
    }
))

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

app.post("/login1", passport.authenticate("login", {session:false}), (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"login exitoso", usuario:req.user});
})

app.post("/login2", 
(req, res, next)=>{
    passport.authenticate("login", (error, usuario, info)=>{
        if(error) {return next(error)}  // contempla salidas return done(error) de la estrategia

        if(!usuario){  // contempla salidas return done(null, false) de la estrategia
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`${info.message?info.message:info.toString()}`})
        }

        req.user=usuario // contempla salidas return done(null, usuario) de la estrategia
        next()

    })(req, res, next)
}, 
(req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"login exitoso", usuario:req.user});
})

app.post("/login3", 
    (req, res, next)=>{
        passport.authenticate("login", (error, usuario, info)=>{
            if(error) {return next(error)}  // contempla salidas return done(error) de la estrategia
    
            if(!usuario){  // contempla salidas return done(null, false) de la estrategia
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`${info.message?info.message:info.toString()}`})
            }
    
            // req.user=usuario // contempla salidas return done(null, usuario) de la estrategia
            // next()
            let token=jwt.sign(usuario, "CoderCoder123", {expiresIn:1800})
            res.cookie("CoderCookie", token)
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:"login exitoso", usuario});
    
        })(req, res, next)
    }, 
    // (req, res)=>{
    
    //     res.setHeader('Content-Type','application/json');
    //     return res.status(200).json({payload:"login exitoso", usuario:req.user});
    // }
)

app.post("/login", 
    passportCall("login"), 
    (req, res)=>{
    
        let token=jwt.sign(req.user, "CoderCoder123", {expiresIn:1800})
        res.cookie("CoderCookie", token)

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"login exitoso", usuario:req.user});
    })

// app.get("/datos", passport.authenticate("current", {session:false}),(req, res)=>{
app.get("/datos", passportCall("current"), auth("user"),(req, res)=>{


    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"Datos", usuario:req.user});
})

app.get("/heroes", passportCall("current"), auth("admin"),(req, res)=>{


    res.setHeader('Content-Type','application/json');
    return res.status(200).json({heroes});
})

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});
