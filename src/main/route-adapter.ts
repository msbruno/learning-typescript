import { Request, Response, Router } from "express"
import { Controller, HttpRequest } from "../presentation/protocols"

export const adaptRoute = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpRequest : HttpRequest = {
            body: req.body
        }

        const httpResponse = await controller.handle(httpRequest)
        return res.status(httpResponse.statusCode).json(httpResponse.body)
    }
}