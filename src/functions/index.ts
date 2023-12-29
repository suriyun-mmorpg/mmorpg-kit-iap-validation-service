import { FastifyRequest, FastifyReply } from 'fastify'
import { DateTime } from 'luxon'
import * as iap from 'in-app-purchase'
import { PrismaClient as IapValidationClient } from '../../prisma/generated/iap-validation-client'
import { IAPValidationForm } from '../interfaces'

const VALIDATION = {
	SUCCESS: 0,
	FAILURE: 1,
	POSSIBLE_HACK: 2
}

export class IAPValidationService {
    iapValidation: IapValidationClient


    constructor(iapValidation: IapValidationClient) {
        this.iapValidation = iapValidation;
        (BigInt.prototype as any).toJSON = function () {
            return this.toString()
        }
    }

    public getListApi = async (request: FastifyRequest, reply: FastifyReply) => {
        const query: any = request.query
        const params: any = request.params
        const limit = Number(query.limit ? query.limit : 20)
        const page = Number(query.page ? query.page : 1)
        const userId = String(params.userId)
        const list: any[] = await this.iapValidation.iap_validation_logs.findMany({
            where: {
                userId: userId,
            },
            skip: (page - 1) * limit,
            take: limit,
        })
        const count = await this.iapValidation.iap_validation_logs.count({
            where: {
                userId: userId,
            }
        })
        const totalPage = Math.ceil(count / limit)
        reply.code(200).send({
            list,
            limit,
            page,
            totalPage,
        })
    }

    public postIapValidationApi = async (request: FastifyRequest, reply: FastifyReply) => {
        const form: IAPValidationForm = request.body as IAPValidationForm
        if (iap.getService(form.receipt) != iap.UNITY) {
            reply.code(400).send()
            return reply
        }
        iap.config({
            googlePublicKeyStrLive: process.env.IAP_GOOGLE_PUBLIC_KEY,
            googlePublicKeyStrSandBox: process.env.IAP_GOOGLE_PUBLIC_KEY_SANDBOX,
            test: Boolean(process.env.IAP_TEST || true),
            verbose: Boolean(process.env.IAP_VERBOSE || true),
        })
        iap.setup()
        .then(() => {
            iap.validate(form.receipt)
            .then(async (response) => {
                await this.iapValidation.iap_validation_logs.create({
                    data: {
                        userId: form.userId,
                        characterId: form.characterId,
                        receipt: form.receipt,
                        status: response.status,
                        createdAt: DateTime.local().toJSDate(),
                    }
                })
                switch (response.status) {
                    case VALIDATION.SUCCESS:
                        reply.code(200).send()
                        return reply
                    case VALIDATION.FAILURE:
                        reply.code(500).send({"message": "Validation status is `FAILURE`"})
                        return reply
                    case VALIDATION.POSSIBLE_HACK:
                        reply.code(500).send({"message": "Validation status is `POSSIBLE_HACK`"})
                        return reply
                }
            })
            .catch((error) => {
                console.error(error)
                reply.code(500).send({"message": "Unable to validate"})
                return reply
            })
        })
        .catch((error) => {
            console.error(error)
            reply.code(500).send({"message": "Unable to setup"})
            return reply
        })
    }
}