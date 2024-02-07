import { Request, Response, NextFunction, Application } from "express";
import { RequestWithUser } from "../models/user";
import { dataSources } from "../graphql/datasources";

const jwt = require('jsonwebtoken');

export const generateAccessToken = (userEmail: string, userId: number) => {
    return jwt.sign({ userEmail, userId} , process.env.TOKEN_SECRET);
}
  
export const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction)  => {
    
    // console.log(req)

    const authHeader = req.headers['authorization']
    const { TOKEN_SECRET } = process.env
    
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
        return next()
    }

    jwt.verify(token, TOKEN_SECRET, (err: any, user: any) => {

        req.user = user

        return user
    })

    next()
   
  }

// export const getTokenUser = (req ?: Request) => {
//     // const authHeader = req.headers['authorization']
//     const { TOKEN_SECRET } = process.env
    
//     const token = 'eyJhbGciOiJIUzI1NiJ9.ZGFuaUBmb28uY29t.2giCvupR-bP1rYwJCgeuYIahNtledbcPDVna7Kg4hEE'//authHeader && authHeader.split(' ')[1]
    
//     jwt.verify(token, TOKEN_SECRET, (err: any, user: any) => {
//         console.log(err, user)
//         return user
//     })

//     // next()
//     // if (token !== null) {
//     //     // return res.sendStatus(401)
//     //     jwt.verify(token, TOKEN_SECRET, (err: any, user: any) => {

//     //     })
//     // }
// }

export const appUseLogin = (app: Application) => {
    app.post(
        "/auth/login",
        async (req, res) => {

            try {

                const user = await dataSources.userService.pgGetUserByEmail(req.body.email)

                if (user?.rows?.length) {

                    const u = user.rows[0]

                    return res.send({
                        status: 200,
                        user: {
                            user_email: u.user_email,
                            user_id: u.user_id,
                            token: generateAccessToken(u.user_email, u.user_id)
                        }
                    })
                }

                return res.send({
                    status: 404,
                })

            } catch (err) {
                console.log(err)

                return res.send({
                    status: 500,
                    err
                })
            }

        }
    )
}