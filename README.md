# SuperBowl LX.

Dashboard interactivo desarrollado en **Next.js** conectado a una base de datos **PostgreSQL** mediante **Docker Compose**. Visualiza reportes de ventas, fans VIP e inventario utilizando Vistas SQL, CTEs y Window Functions.

## Intrucciones para la ejecución.

El proyecto está dockerizado para funcionar con un solo comando.

1. Clonar el repositorio.
2. Ejecutar Docker Compose:
   ```bash
   docker compose up --build
3. Abrir el navegador en: http://localhost:3000

Estructura del proyecto.

/db: Scripts SQL (Schema, Seeds, Views, Roles, Indexes).
/web: Aplicación Next.js (App Router, Tailwind CSS, Lucide Icons).
docker-compose.yml: Orquestación de servicios.

Justificación.

Se crearon índices específicos en el archivo db/indexes.sql para optimizar el rendimiento de las Vistas:
idx_orders_user_id:
Justificación: Acelera drásticamente el JOIN entre la tabla users y orders. Es fundamental para la vista Ranking de Fans, ya que evita que la base de datos escanee toda la tabla secuencialmente para sumar los gastos de cada usuario.

idx_products_category_id:
Justificación: Optimiza la agrupación por categorías en el Reporte de Ventas y el Reporte Premium. Al tener un índice en la llave foránea, el cálculo de AVG y COUNT por categoría es mucho más rápido.

idx_users_team:
Justificación: Permite filtrar rápidamente a los fans por su equipo favorito. Aunque actualmente se usa para mostrar el dato, prepara el sistema para futuros filtros de dashboard por equipo.

Seguridad.

Se implementó un rol dedicado app_user con permisos restringidos.
Solo tiene permiso SELECT sobre las tablas y vistas del esquema public.
La aplicación NO se conecta como superusuario postgres.
