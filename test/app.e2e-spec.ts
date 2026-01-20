// biome-ignore lint:useImportType: <explanation>
import { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../src/users/enums/user-role.enum';


describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();

  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('Hello World!');
  });

  it('/users/me (GET) avec Bearer token', async () => {
    // Générer un token JWT pour les tests
    const payload = {
      sub: 1,
      email: 'test@example.com',
      role: UserRole.MEMBER,
    };
    const token = jwtService.sign(payload);

    // Tester l'endpoint /users/me avec le Bearer token
    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('role');
        expect(res.body.email).toBe(payload.email);
      });
  });
  // Commentaire: Ce test vérifie que l'endpoint /users/me fonctionne correctement avec un Bearer token valide.
  // Il génère un token JWT avec JwtService et l'utilise dans l'en-tête Authorization pour authentifier la requête.

});
