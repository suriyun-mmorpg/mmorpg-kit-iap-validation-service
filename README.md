# mmorpg-kit-iap-validation-service
IAP validation service for MMORPG KIT

## Requirement
- You have to install Node.js (I hope I won't have to tell you how)

## Install
- Clone this repo
- `npm i`

## Generate Prisma Clients
- `npx prisma generate --schema "./prisma/iapValidationSchema.prisma"`

## Configs
- Copy `.env.example`
- Rename copied file to `.env`
- Open `.env` and changes configs

## Database Connection Configs
IAP validation database's provider is MySQL, so you have to prepare MySQL server, also have to create empty database which will be filled with tables later, then set connection string config `DATABASE_URL`, you can see info about connection string from [this link](https://www.prisma.io/docs/concepts/database-connectors/mysql).
- `DATABASE_URL` is connection string to connect to IAP validation database.

## IAP Validation Database Creation
After you set `DATABASE_URL` properly, then you have to push tables by uses command `npx prisma db push --schema "./prisma/iapValidationSchema.prisma"`

## Build and Start
```
npm run build
npm run start
```

## Want to use SQLite?
Try change schema.prisma -> datasource db to use SQLite, learn about it [here](https://www.prisma.io/docs/concepts/database-connectors/sqlite)
