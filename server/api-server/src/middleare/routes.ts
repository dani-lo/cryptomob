import { Application } from "express"
import prisma from "../db/prisma"

export const populteRoutes = (app: Application) => {

    app.get("/articles", async (req, res) => {

        const articles = await prisma.articles.findMany()
        
        res.json(articles)
    })
}