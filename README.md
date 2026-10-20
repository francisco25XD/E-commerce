# Alma de Flor — E-commerce

Next.js 14 (App Router) + Prisma (SQLite) + Tailwind.

## Puesta en marcha

```bash
npm install
npm run db:setup   # crea la base y carga los productos de ejemplo
npm run dev        # http://localhost:3000
```

## Imágenes

Copiá las fotos a `public/products/<slug>.jpg` (por ejemplo `ramo-silvestre-amanecer.jpg`).
Los slugs están en `prisma/seed.ts`. Si falta una imagen se muestra un placeholder.

## Estructura

- `prisma/schema.prisma` — Category, Product, ProductVariant, Order, OrderItem (precios en centavos)
- `src/app/page.tsx` — portada: ofertas flash, recién llegados, favoritos, manifiesto
- `src/app/checkout` — formulario de pedido
- `src/app/api/orders` — crea pedidos recalculando precios en el servidor
- `src/components/CartProvider.tsx` — carrito (localStorage)

## Próximos pasos sugeridos

Pasarela de pago (Mercado Pago/Stripe), panel admin, autenticación, páginas de categoría y de detalle.
