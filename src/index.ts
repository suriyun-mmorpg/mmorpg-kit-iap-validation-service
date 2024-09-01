import fastify, { FastifyListenOptions } from 'fastify'
import authPlugin from '@fastify/auth'
import { PrismaClient as IapValidationClient } from '../prisma/generated/iap-validation-client'
import { IAPValidationForm } from './interfaces'
import { IAPValidationService } from './functions'

const secretKeys: string = process.env.SECRET_KEYS ? process.env.SECRET_KEYS : "[\"secret\"]"
const iapValidationClient = new IapValidationClient()

const validateAppAccess = async(request: any, reply: any, done: (err?: Error) => void) =>
{
    const header = request.headers['x-api-key']!
    if (!header) {
        done(new Error('No secret key'))
        return
    }
    const keys = JSON.parse(secretKeys)
    if (keys.indexOf(header) < 0) {
        done(new Error('Invalid secret key'))
        return
    }
}

const functions = new IAPValidationService(iapValidationClient)
const server = fastify({ logger: true })
    .register(authPlugin)
    .after(() => {
        server.get('/iap-validation-history/:userId', functions.getListApi)

        server.post<{ Body: IAPValidationForm }>('/internal/iap-validate', {
            preHandler: server.auth([
                validateAppAccess
            ]),
        }, functions.postIapValidationApi)
    })


const options: FastifyListenOptions = {
    host: String(process.env.ADDRESS ? process.env.ADDRESS : "0.0.0.0"),
    port: Number(process.env.PORT ? process.env.PORT : 80),
}
server.listen(options, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})