# 🚀 Configuración del Proyecto

Este proyecto requiere ciertas configuraciones previas antes de poder ejecutarse correctamente en tu entorno local. A continuación te explico todo lo necesario paso a paso.

## 🛠 Requisitos

Asegúrate de tener instalado lo siguiente:

* PHP 8.2
* MySQL
* Node.js y npm
* Herd (para levantar el entorno local)

## 📥 Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd <nombre-del-proyecto>
```

## ⚙️ Configuración del proyecto

Primero, instala las dependencias de PHP:

```bash
composer install
```

Luego, instala las dependencias de Node:

```bash
npm install
```

## 🔐 Configurar variables de entorno

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

Configura tus credenciales de base de datos en el archivo `.env`:

```
DB_DATABASE=nombre_bd
DB_USERNAME=usuario
DB_PASSWORD=contraseña
```

## 🔑 Generar clave de la aplicación

```bash
php artisan key:generate
```

## 🗄️ Migraciones y Seeders

Ejecuta las migraciones junto con los seeders para poblar la base de datos:

```bash
php artisan migrate --seed
```

> ⚠️ Nota: Los seeders son importantes ya que cargan datos iniciales necesarios para el funcionamiento del sistema.

## ▶️ Ejecutar el proyecto

Levanta el servidor con Herd o usando:

```bash
php artisan serve
```

Y en otra terminal, ejecuta:

```bash
npm run dev
```

## Usuario por defecto
correo: admin@admin.com
password: 123

## ✅ Listo

Con esto ya deberías tener el proyecto corriendo correctamente en tu entorno local.
