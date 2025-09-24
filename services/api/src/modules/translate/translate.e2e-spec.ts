import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../../app.module'

describe('Translate & Signs (e2e)', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
		app = moduleRef.createNestApplication()
		await app.init()
	})

	afterAll(async () => {
		await app.close()
	})

	it('/translate returns glosses', async () => {
		const res = await request(app.getHttpServer()).post('/translate').send({ text: 'Bom dia' })
		expect(res.status).toBe(200)
		expect(Array.isArray(res.body.glosses)).toBe(true)
		expect(res.body.caption).toContain('BOM_DIA')
	})

	it('/sign/generate returns timeline', async () => {
		const res = await request(app.getHttpServer()).post('/sign/generate').send({ glosses: ['BOM_DIA'] })
		expect(res.status).toBe(200)
		expect(res.body.fps).toBeDefined()
		expect(Array.isArray(res.body.keyframes)).toBe(true)
	})
})