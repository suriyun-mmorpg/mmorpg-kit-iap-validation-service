export interface IAPValidationForm {
    userId: string,
    characterId: string,
    platform: string,
    transactionID: string,
    receipt: string,
    appleJwsRepresentation?: string,
}