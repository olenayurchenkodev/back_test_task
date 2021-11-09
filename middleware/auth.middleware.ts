const jwt = require('jsonwebtoken')
import express = require('express')

declare module "express" {
    export interface Request {
        user: any
    }
}

module.exports = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {

        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Нет авторизации' })
        }
        const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

        const decoded = jwt.verify(token, 'some secret string')
        req.user = decoded
        next()

    } catch (e) {
        res.status(401).json({ message: 'Нет авторизации' })
    }
}