// spec => teste de unidade
// test => teste de integração
import { describe, it } from 'node:test'
import supertest from 'supertest'
import app from '../../src/app'
import { deepStrictEqual, ok, strictEqual } from 'node:assert'
import { knexClient } from '../../src/config/knex-db'
import { randomUUID } from 'node:crypto'

describe('HTTP - /api/register', () => {
    it('Deve retornar status 400 quando email não for enviado', async () => {
        const input = {
            email: '',
            name: 'any name',
            password: 'any password'
        }

        const response = await supertest(app).post('/api/register').send(input)

        strictEqual(response.status, 400)
        deepStrictEqual(response.body, { message: 'Requisição inválida' })
    })

    it('Deve retornar status 400 quando name não for enviado', async () => {
        const input = {
            email: 'any@test.com',
            name: '',
            password: 'any password'
        }

        const response = await supertest(app).post('/api/register').send(input)

        strictEqual(response.status, 400)
        deepStrictEqual(response.body, { message: 'Requisição inválida' })
    })

    it('Deve retornar status 400 quando password não for enviado', async () => {
        const input = {
            email: 'any@test.com',
            name: 'any name',
            password: ''
        }

        const response = await supertest(app).post('/api/register').send(input)

        strictEqual(response.status, 400)
        deepStrictEqual(response.body, { message: 'Requisição inválida' })
    })

    it('Deve retornar status 400 quando o tamanho do password não for atentido', async () => {
        const input = {
            email: 'any@test.com',
            name: 'any name',
            password: '12345'
        }

        const response = await supertest(app).post('/api/register').send(input)

        strictEqual(response.status, 400)
        deepStrictEqual(response.body, { message: 'Senha fraca' })
    })

    it('Deve retornar status 400 quando o usuário já existir', async () => {

        await knexClient.table('users').delete()

        const input = {
            email: 'any@test.com',
            name: 'any name',
            password: '123456'
        }

        await knexClient.table('users').insert({
            email: input.email,
            name: input.name,
            password: input.password,
            id: randomUUID(),
        })

        const response = await supertest(app).post('/api/register').send(input)

        strictEqual(response.status, 400)
        deepStrictEqual(response.body, { message: 'Usuário já existe' })
    })

    it('Deve retornar status 201 quando usuário é criado', async () => {
        await knexClient.table('users').delete()

        const input = {
            email: 'any@test.com',
            name: 'any name',
            password: '123456'
        }

        const response = await supertest(app).post('/api/register').send(input)

        const userDB = await knexClient.table('users').where('email', input.email).first()

        ok(userDB)
        // Não valido: '', 0, null, undefined, {} (falsy)
        // Válido: truthy

        strictEqual(response.status, 201)
        deepStrictEqual(response.body, {
            message: 'Usuário criado',
            data: { id: userDB.id, name: input.name, email: input.email, enable: true }
        })
    })
})