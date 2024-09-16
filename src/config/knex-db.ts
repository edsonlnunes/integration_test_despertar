import { type Knex, knex as setupKnex } from "knex";
import appEnvs from "./env";

// typeORM, Prisma, Sequelize, knex
export const config: { [key: string]: Knex.Config } = {
  test: {
    client: "pg",
    connection: {
      connectionString: appEnvs.TEST_DATABASE_URL,
      ssl: false
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: './migrations'
    }
  },

  production: {
    client: "pg",
    connection: {
      connectionString: appEnvs.DATABASE_URL,
      ssl: false,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: './migrations'
    }
  }

};

const env = process.env.NODE_ENV === 'production' ? 'production' : 'test'

export default config
export const knexClient = setupKnex(config[env])
