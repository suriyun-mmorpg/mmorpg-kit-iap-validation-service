import fastify, { FastifyListenOptions } from 'fastify'
import authPlugin from '@fastify/auth'
import bearerAuthPlugin from '@fastify/bearer-auth'
import { PrismaClient as IapValidationClient } from '../prisma/generated/iap-validation-client'
import { IAPValidationForm } from './interfaces'
import { IAPValidationService } from './functions'

const secretKeys: string = process.env.SECRET_KEYS ? process.env.SECRET_KEYS : "[\"secret\"]"
const iapValidationClient = new IapValidationClient()

const functions = new IAPValidationService(iapValidationClient)
const server = fastify({ logger: true })
    .register(authPlugin)
    .register(bearerAuthPlugin, {
        keys: JSON.parse(secretKeys),
        addHook: false,
    })
    .after(() => {
        server.get('/iap-validation-history/:userId', functions.getListApi)

        server.post<{ Body: IAPValidationForm }>('/internal/iap-validate', {
            preHandler: server.auth([
                server.verifyBearerAuth!
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