<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# DEV

1. Clone project
2. Copy el `env.template` and rename to `.env`
3. Install dependencies

```
npm install
```

4. Initialize database (Docker)

```
docker-compose up -d
```

5. Initialize server

```
npm run start:dev
```

6. The application will start on

```
http://localhost:3000
```

7. Execute __mutation__ ```executeSeed```, to load the seeders
