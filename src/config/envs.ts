import 'dotenv/config'
import * as joi from 'joi'
import * as process from 'node:process';

interface EnvVars {
  PORT: number
  DATABASE_URL: string
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  DATABASE_URL: joi.string().required(),
})
.unknown(true) // por otras variables que andan flotando o vienen por defecto

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value

export const envs = {
  port: envVars.PORT,
  databaseURL: envVars.DATABASE_URL,
}