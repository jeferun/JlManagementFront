# Sistema Interno Cooperativo - JlManagementFront

Este es un sistema interno para la gestión de afiliados de la cooperativa y sus aportes mensuales.

## Tecnologías Utilizadas
- **Framework:** [Next.js 15.0.8](https://nextjs.org/) (App Router)
- **Librería UI:** [React 19](https://react.dev/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [shadcn/ui](https://ui.shadcn.com/)
- **Iconos:** [lucide-react](https://lucide.dev/)
- **Formularios y Validación:** [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)

## Arquitectura: MVVM (Modelo-Vista-ViewModel)

Este proyecto sigue estrictamente un patrón de diseño MVVM basado en módulos.

### Estructura de Directorios

```text
src/
├── app/                      # Enrutador App Router de Next.js (Rutas y páginas)
│   ├── layout.tsx
│   └── page.tsx
├── modules/                  # Módulos por funcionalidad
│   ├── affiliates/           # Módulo de Afiliados
│   │   ├── model/            # Interfaces, tipos y contexto de manejo de estado
│   │   ├── services/         # Lógica de consumo de API
│   │   ├── view/             # Componentes de UI específicos de afiliados
│   │   └── viewModel/        # Hooks personalizados que conectan la vista con el modelo
│   └── contributions/        # Módulo de Aportes
│       ├── model/
│       ├── services/
│       ├── view/
│       └── viewModel/
└── shared/                   # Recursos compartidos entre módulos
    ├── components/ui/        # Componentes genéricos y de shadcn/ui reutilizables
    ├── layouts/              # Wrappers de diseño principal
    ├── utils/                # Funciones auxiliares
    └── contexts/             # Contextos globales de la aplicación
```
## Requisitos de Entorno (NVM)

Este proyecto está configurado para usar [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) para gestionar la versión de Node.js.

El proyecto cuenta con un archivo `.nvmrc` en la raíz que fija la versión requerida de Node.js a **`22.14.0`**.

### Instalación y Uso de NVM:

1. **Instalar NVM (si no lo tienes):**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```
2. **Reiniciar la terminal** (o abrir una nueva pestaña) para activar los comandos de NVM.
3. **Instalar la versión requerida de Node:**
   Navega a la carpeta del proyecto y ejecuta:
   ```bash
   nvm install
   ```
   *(Esto detectará el archivo `.nvmrc` e instalará la versión `22.14.0` de forma automática).*
4. **Activar la versión correcta para trabajar:**
   A diferencia de Volta, **NVM no cambia de versión automáticamente por defecto** al entrar a una carpeta. Debes ejecutar manualmente lo siguiente cada vez que abras una nueva terminal en la carpeta del proyecto:
   ```bash
   nvm use
   ```
   *Nota: Si al ejecutar `nvm use` la terminal te indica que la versión no está instalada (por ejemplo: `N/A: version "v22.14.0" is not yet installed`), instala la versión requerida corriendo:*
   ```bash
   nvm install
   ```

## Primeros Pasos

1. **Instalar Dependencias:**
   Asegúrate de haber activado la versión de Node correcta con `nvm use` antes de correr:
   ```bash
   npm install
   ```

2. **Iniciar el Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir la Aplicación:**
   Navega a [http://localhost:3000](http://localhost:3000) en tu navegador.
