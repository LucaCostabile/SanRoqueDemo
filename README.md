# App San Roque Demo

Demo fullstack para kiosco: gestión de stock, ventas rápidas, ingresos de mercadería por proveedor y dashboard de estadísticas. Pensada para deploy en Vercel/Render y base de datos en Railway (PostgreSQL).

## Stack
- Next.js 14 (App Router) + TypeScript
- Prisma ORM + PostgreSQL (Railway)
- Tailwind CSS

## Variables de entorno
Crea `.env` con:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public
NEXT_PUBLIC_APP_NAME=San Roque Demo
```

## Scripts
- `npm install`
- `npm run dev` – desarrollo
- `npm run build` – build
- `npm start` – producción
- `npx prisma migrate dev` – aplicar migraciones
- `npx prisma studio` – inspeccionar datos

## Deploy
- Vercel: configurar `DATABASE_URL` y `PRISMA_ENGINE_VERSION` opcional.
- Render: servicio Node con `npm run build` y `npm start`.

## Funcionalidades
- Productos: CRUD y stock.
- Ventas: registro rápido, ticket simple.
- Ingresos: seleccionar proveedor, agregar mercadería, actualizar stock.
- Estadísticas: top vendidos, ventas del día, ingresos por período.
