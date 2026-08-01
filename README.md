# Sitio institucional de AUDIP

Sitio web de la Asociación Uruguaya de Investigación Paranormal (AUDIP),
construido en React + Vite, con Supabase como base de datos/autenticación
y pensado para publicarse gratis en GitHub Pages.

Este instructivo asume que **nunca usaste Supabase ni GitHub Pages**. Seguilo
en orden, de punta a punta.

---

## 0. Lo que vas a necesitar

- Una cuenta de GitHub (gratis) → https://github.com/signup
- Una cuenta de Supabase (gratis) → https://supabase.com
- Una cuenta de EmailJS (gratis) → https://www.emailjs.com
- Node.js instalado en tu computadora (para probar el sitio localmente) → https://nodejs.org (versión LTS)

---

## 1. Crear el proyecto en Supabase

1. Entrá a https://app.supabase.com y creá un **New project**.
   - Nombre: `audip` (o el que quieras)
   - Contraseña de base de datos: guardala en un lugar seguro
   - Región: elegí la más cercana (ej. South America - São Paulo)
2. Esperá 1-2 minutos a que el proyecto termine de crearse.
3. Andá a **SQL Editor** (menú izquierdo) → **New query**.
4. Abrí el archivo [`supabase/schema.sql`](./supabase/schema.sql) de este
   proyecto, copiá TODO su contenido, pegalo en el editor y presioná **Run**.
   - Esto crea las 4 tablas (`agrupaciones`, `investigadores`, `autoridades`,
     `contactos`), activa la seguridad (RLS), crea el espacio de
     almacenamiento para fotos/logos, y carga los 6 grupos que ya nos
     pasaste como punto de partida.
5. Andá a **Project Settings → API**. Ahí vas a ver:
   - **Project URL** → esto es tu `VITE_SUPABASE_URL`
   - **anon public key** → esto es tu `VITE_SUPABASE_ANON_KEY`
   - Guardalos, los vas a usar en el paso 3.

### Crear los administradores (usuarios que pueden entrar al panel)

1. Andá a **Authentication → Users** en Supabase.
2. Hacé clic en **Add user → Create new user**.
3. Cargá el email y una contraseña para cada administrador que necesites.
   Repetí esto por cada persona (recordá que pediste que todos tengan el
   mismo nivel de acceso: cualquier usuario creado acá puede administrar
   todo el contenido).
4. Con ese email y contraseña van a poder entrar en `/#/login` del sitio.

No hace falta que la gente se registre sola: los administradores se crean
siempre desde este panel de Supabase, a mano, por seguridad.

---

## 2. Configurar EmailJS (para recibir el email del formulario de contacto)

1. Creá una cuenta en https://www.emailjs.com
2. **Email Services** → agregá tu servicio (podés conectar el Gmail
   `audipuruguay@gmail.com`) → copiá el **Service ID**.
3. **Email Templates** → creá una plantilla nueva. Usá estas variables en
   el cuerpo del mensaje: `{{from_name}}`, `{{from_email}}`, `{{telefono}}`,
   `{{departamento}}`, `{{mensaje}}`. Copiá el **Template ID**.
4. **Account → General** → copiá tu **Public Key**.
5. Guardá los tres valores, los usás en el paso 3.

---

## 3. Configurar las variables de entorno

1. En la raíz del proyecto, copiá `.env.example` a un archivo nuevo llamado `.env`.
2. Completá los valores con los datos de Supabase y EmailJS de los pasos 1 y 2.

Este archivo `.env` es solo para probar el sitio en tu computadora y
**nunca se sube a GitHub** (ya está excluido en `.gitignore`).

---

## 4. Probar el sitio en tu computadora

```bash
npm install
npm run dev
```

Abrí la URL que te muestra la terminal (normalmente `http://localhost:5173`).

---

## 5. Subir el proyecto a GitHub

1. Creá un repositorio nuevo en https://github.com/new
   - Nombre sugerido: `audip-web`
   - Dejalo público (GitHub Pages gratis requiere que el repo sea público,
     salvo que tengas GitHub Pro/Team)
2. En tu computadora, dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Sitio institucional AUDIP"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/audip-web.git
git push -u origin main
```

> Si tu repositorio se llama distinto a `audip-web`, editá la línea `base`
> en `vite.config.js` para que coincida exactamente.

---

## 6. Cargar tus claves como "Secrets" de GitHub (para que el sitio se pueda publicar)

El archivo `.env` nunca se sube a GitHub, así que el robot que publica el
sitio (GitHub Actions) necesita sus propias copias de esas claves:

1. En tu repositorio de GitHub: **Settings → Secrets and variables → Actions**
2. **New repository secret**, y cargá uno por uno estos 5 secrets (mismos
   valores que pusiste en tu `.env`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

---

## 7. Activar GitHub Pages

1. En tu repositorio: **Settings → Pages**
2. En **Source**, elegí **GitHub Actions**.
3. Listo. Cada vez que hagas `git push` a la rama `main`, el sitio se va a
   compilar y publicar solo (mirá el progreso en la pestaña **Actions**).
4. Tu sitio va a quedar publicado en:
   `https://TU-USUARIO.github.io/audip-web/`

---

## 8. Cargar el contenido real

Entrá a tu sitio publicado → **Administración** (arriba a la derecha) →
iniciá sesión con un usuario creado en el paso 1. Desde ahí podés:

- Cargar/editar/dar de baja **agrupaciones** (se ubican solas en el mapa
  según el departamento que elijas)
- Cargar/editar/dar de baja **integrantes**, con foto y grupo
- Cargar/editar/dar de baja **autoridades**
- Ver y borrar los **mensajes** que llegan por el formulario de contacto

---

## Seguridad — qué la protege

- **Row Level Security (RLS)** en las 4 tablas: nadie puede escribir nada
  en la base de datos sin haber iniciado sesión como administrador, sin
  importar que la "anon key" sea técnicamente pública (así funciona
  Supabase: la clave pública solo sirve para lo que las políticas RLS
  permiten explícitamente).
- El formulario de contacto solo puede **insertar** mensajes, nunca leerlos:
  un visitante no puede ver los datos de contacto de otras personas.
- Los archivos subidos (fotos, logos) requieren sesión de administrador
  para subirse o borrarse; solo la lectura es pública.
- El campo oculto ("honeypot") en el formulario de contacto descarta en
  silencio los envíos automáticos de robots/spam.
- La clave `service_role` de Supabase (la que puede saltarse RLS) **nunca**
  se usa en este proyecto — ni en el frontend ni en ningún archivo. No la
  copies nunca a un `.env` ni la subas a GitHub.

---

## Estructura del proyecto

```
src/
  pages/           → Inicio, Autoridades, Mapa, Grupos, Login
  pages/admin/      → Panel de administración (protegido)
  components/       → Navbar, Footer, formulario de contacto, etc.
  lib/departamentos.js → los 19 departamentos + coordenadas para el mapa
  supabaseClient.js → conexión a Supabase
supabase/schema.sql → tablas + seguridad, para pegar en Supabase
```
