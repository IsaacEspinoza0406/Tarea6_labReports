# Super Bowl LX Analytics Dashboard

Dashboard interactivo de inteligencia de negocios para la NFL, desarrollado con **Next.js 20 (App Router)** y **PostgreSQL**. El sistema visualiza reportes financieros, inventario y comportamiento de fans utilizando Vistas SQL (CTEs, Window Functions) y está totalmente contenerizado con **Docker**.

---

## Ejecución (One Command Run)

Este proyecto cumple con el estándar de reproducibilidad. Para iniciarlo desde cero:

1. Asegúrese de tener Docker Desktop corriendo.
2. Ejecute el siguiente comando en la raíz:
   ```bash
   docker compose up --build
3. Acceda al dashboard en: http://localhost:3000

# Modelo de Amenazas y Seguridad (Threat Model).

Para cumplir con los requisitos de seguridad empresarial, se implementaron las siguientes medidas:

Principio de Menor Privilegio: La aplicación NO se conecta como postgres. Se creó un rol dedicado app_user que tiene permisos restringidos (GRANT SELECT) únicamente sobre las Vistas necesarias, sin acceso directo de escritura ni lectura a las tablas crudas.

Prevención de SQL Injection: No se concatena texto en las consultas. Se utilizan consultas parametrizadas ($1, $2) nativas del driver pg para todos los filtros de búsqueda (Reporte 2) y paginación (Reporte 3).

Gestión de Secretos: Las credenciales de base de datos no están hardcodeadas en el repositorio. Se utilizan variables de entorno (.env) inyectadas por Docker Compose. (Se incluye .env.example como referencia).

# Decisiones Técnicas (Trade-offs).

Se priorizó el rendimiento de la base de datos sobre el procesamiento en el cliente:
SQL vs JavaScript Processing:
Decisión: Mover la lógica de agregación (SUM, COUNT, AVG) y clasificación (CASE) a Vistas Materializadas o Vistas SQL.

Justificación: PostgreSQL es exponencialmente más rápido agrupando y filtrando datos indexados que JavaScript iterando arrays en memoria. Esto mantiene al servidor de Next.js ligero ("Thin Server").

Server Components vs API Routes:
Decisión: Utilizar React Server Components para el fetching de datos directo a la DB.

Justificación: Elimina la latencia de una llamada HTTP extra (API REST) y asegura que las credenciales de la base de datos nunca viajen ni se expongan al cliente (navegador).

CTE vs Subqueries:
Decisión: Uso de Common Table Expressions (WITH) en el reporte de Precios.

Justificación: Mejora la legibilidad del código y permite calcular el promedio global una sola vez, reutilizándolo para comparar contra cada producto.

# Justificación de Índices y Performance.

Se crearon índices estratégicos en db/indexes.sql basándose en el análisis de los JOIN y WHERE:

1. idx_orders_status:
Justificación: 3 de las 5 vistas filtran por WHERE status = 'pagado'. Sin este índice, la base de datos haría un Full Table Scan innecesario sobre órdenes canceladas o pendientes.

2. idx_products_category_id:
Justificación: Acelera el JOIN entre Productos y Categorías en el Reporte 1 (Ventas), permitiendo agrupaciones instantáneas.

3. idx_orders_created_at:
Justificación: Optimiza la Window Function del Reporte 5. Al tener los datos pre-ordenados por fecha, el cálculo del acumulado es mucho más eficiente.

# Evidencia de Performance (EXPLAIN ANALYZE).

1. Análisis del Reporte VIP:
isaac@DESKTOP-NLG3BH8 MINGW64 ~/T6 (main)
$ docker exec -it postgres_nfl_recu psql -U app_user -d superbowl_db -c "EXPLAIN ANALYZE SELECT * FROM view_2_vip_fans;"
                                                               QUERY PLAN                                                             
---------------------------------------------------------------------------------------------------------------------------------------
 GroupAggregate  (cost=9.33..9.36 rows=1 width=504) (actual time=0.228..0.232 rows=3 loops=1)
   Group Key: u.id
   Filter: (sum(o.total) > '0'::numeric)
   ->  Sort  (cost=9.33..9.34 rows=1 width=456) (actual time=0.121..0.122 rows=3 loops=1)
         Sort Key: u.id
         Sort Method: quicksort  Memory: 25kB
         ->  Nested Loop  (cost=0.14..9.32 rows=1 width=456) (actual time=0.040..0.045 rows=3 loops=1)
               ->  Seq Scan on orders o  (cost=0.00..1.04 rows=1 width=20) (actual time=0.014..0.015 rows=3 loops=1)
                     Filter: ((status)::text = 'pagado'::text)
               ->  Index Scan using users_pkey on users u  (cost=0.14..8.16 rows=1 width=440) (actual time=0.008..0.008 rows=1 loops=3)
                     Index Cond: (id = o.user_id)
 Planning Time: 2.426 ms
 Execution Time: 0.923 ms
(13 rows)

2. Verificación de Vistas Activas (\dv):

isaac@DESKTOP-NLG3BH8 MINGW64 ~/T6 (main)
$ docker exec -it postgres_nfl_recu psql -U app_user -d superbowl_db -c "\dv"
                   List of relations
 Schema |            Name            | Type |  Owner   
--------+----------------------------+------+----------
 public | view_1_sales_by_category   | view | app_user
 public | view_2_vip_fans            | view | app_user
 public | view_3_inventory_risk      | view | app_user
 public | view_4_price_performance   | view | app_user
 public | view_5_sales_running_total | view | app_user
(5 rows)

# Bitácora de Inteligencia Artificial.

Se utilizó IA generativa como asistente de desarrollo para los siguientes puntos:

### 1. Generación de Datos (Data Seeding)
* **Prompt:** *"Genera un script SQL `INSERT INTO` para poblar una base de datos de la NFL. Necesito 5 usuarios, 10 productos de merch y 3 órdenes de compra con diferentes fechas y estatus."*
* **Validación Humana:** Se ajustaron los IDs manuales para asegurar integridad referencial y se agregaron datos específicos para probar los casos borde de las Vistas.

### 2. Infraestructura Docker & PostgreSQL
* **Prompt:** *"Escribe un `docker-compose.yml` para Next.js y Postgres. La base de datos debe ejecutar scripts de inicialización en orden alfabético."*
* **Problema Detectado:** La IA sugirió usar volúmenes anónimos que persistían datos viejos, causando errores de `relation does not exist`.
* **Corrección:** Se implementó la limpieza de volúmenes (`docker compose down -v`) y se renombraron los archivos SQL con prefijos numéricos (`01_schema`, `02_seed`) para garantizar el orden de ejecución.

### 3. Optimización SQL Avanzada
* **Prompt:** *"Optimiza esta consulta de ventas acumuladas usando Window Functions en lugar de subqueries correlacionadas."*
* **Resultado:** La IA generó `SUM(total) OVER (ORDER BY created_at)`.
* **Ajuste:** Se agregó un índice en `created_at` para mejorar el performance del `OVER`, reduciendo el tiempo de ejecución en el `EXPLAIN ANALYZE`.

### 4. Seguridad y Roles
* **Prompt:** *"Crea un script SQL para un usuario `app_user` que solo pueda leer vistas pero no tablas."*
* **Validación:** Se verificó manualmente que el `GRANT SELECT ON ALL TABLES IN SCHEMA public` fuera reemplazado por `GRANT SELECT ON view_...` específicos, cumpliendo con el principio de menor privilegio estricto.

### 5. Frontend & TypeScript
* **Prompt:** *"Crea un componente de Next.js que muestre una tabla de datos traídos de Postgres con `pg`."*
* **Corrección:** El código generado usaba `useEffect` (Client Component). Se refactorizó manualmente a **Server Component** (`async function Page()`) para proteger las credenciales de la BD y mejorar el SEO/Performance.

# Estructura del proyecto.

1. /db: Contiene toda la lógica de base de datos (Schema, Seeds, Vistas, Roles, Índices).
2. /web: Aplicación Next.js.
3. /src/app/reports: Páginas dinámicas para cada reporte.
4. /src/lib: Configuración de conexión segura a PostgreSQL.
5. docker-compose.yml: Orquestación de servicios y redes.