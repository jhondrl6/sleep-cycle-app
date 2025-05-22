# Aplicación de Seguimiento de Glucosa

## Descripción General
Una sencilla aplicación web para registrar y consultar mediciones de glucosa en sangre. Diseñada para ser fácil de usar, especialmente para personas mayores, con un tema oscuro y fuentes claras para mejorar la legibilidad. Permite a los usuarios llevar un control personal de sus niveles de glucosa directamente en su navegador.

## Características Principales
*   Registro de mediciones de glucosa con fecha, hora, valor (mg/dL) y observaciones.
*   Historial de mediciones visible en una tabla, ordenado cronológicamente (el más reciente primero).
*   Posibilidad de eliminar mediciones individuales del historial.
*   Cálculo de promedios de glucosa para diferentes períodos:
    *   Última semana.
    *   Últimas dos semanas.
    *   Un rango de fechas específico seleccionado por el usuario.
*   Interfaz con modo oscuro y fuentes grandes para una mejor legibilidad y menor fatiga visual.
*   Almacenamiento de datos localmente en el navegador del usuario (utilizando `localStorage`), lo que significa que los datos persisten entre sesiones sin necesidad de una base de datos externa.

## ¿Cómo Usar la Aplicación?

### Agregar una Medición
1.  Introduce la fecha, hora, valor de glucosa (en mg/dL) y cualquier observación relevante en los campos de la sección "Agregar Nueva Medición".
2.  Haz clic en el botón "Agregar Medición".
3.  La nueva medición aparecerá al inicio de la tabla del "Historial de Mediciones".

### Ver el Historial
*   Todas las mediciones guardadas se muestran automáticamente en la tabla "Historial de Mediciones".
*   Las mediciones están ordenadas de la más reciente a la más antigua.

### Eliminar una Medición
*   En la tabla del "Historial de Mediciones", localiza la medición que deseas borrar.
*   Haz clic en el botón "Eliminar" que se encuentra en la columna "Acciones" de esa fila. La medición será eliminada permanentemente.

### Calcular Promedios
*   **Promedios rápidos**: Para calcular el promedio de la última semana o las últimas dos semanas, simplemente haz clic en los botones "Promedio Última Semana" o "Promedio Últimas Dos Semanas" ubicados en la sección "Calcular Promedios".
*   **Promedio por rango específico**:
    1.  Selecciona la fecha de inicio en el campo "Desde:".
    2.  Selecciona la fecha de fin en el campo "Hasta:".
    3.  Haz clic en el botón "Promedio Rango Específico".
*   El resultado del promedio, junto con el número de mediciones consideradas, se mostrará en el área debajo de los botones de promedio.

## Tecnologías Utilizadas
*   HTML
*   CSS
*   JavaScript

## Despliegue en GitHub Pages
Esta aplicación está diseñada para ser desplegada fácilmente como un sitio estático en GitHub Pages.

1.  **Prepara tu Repositorio**:
    *   Asegúrate de que tu repositorio de GitHub contenga los archivos `index.html`, `style.css`, y `script.js` en la raíz de la rama que deseas desplegar (generalmente `main` o `master`).

2.  **Configura GitHub Pages**:
    *   Ve a la página principal de tu repositorio en GitHub.
    *   Haz clic en la pestaña "Settings" (Configuración).
    *   En el menú lateral izquierdo, busca y haz clic en la sección "Pages" (Páginas).
    *   En la sección "Build and deployment" (Construcción y despliegue), bajo "Source" (Fuente), selecciona "Deploy from a branch" (Desplegar desde una rama).
    *   Luego, bajo "Branch" (Rama), selecciona la rama que contiene tus archivos (e.g., `main`) y la carpeta (normalmente `/root` o dejar como está si los archivos están en la raíz de la rama).
    *   Haz clic en "Save" (Guardar).

3.  **Accede a tu Aplicación**:
    *   Después de guardar, GitHub Pages comenzará el proceso de despliegue. Puede tomar unos minutos para que tu sitio esté activo.
    *   Una vez desplegado, GitHub Pages te proporcionará una URL (generalmente en el formato `https://<tu-usuario>.github.io/<nombre-del-repositorio>/`) donde tu aplicación estará visible. Esta URL se mostrará en la parte superior de la sección "Pages".
    *   Nota: Puede tomar unos minutos para que la página esté activa después de la configuración inicial.

¡Y eso es todo! Tu aplicación de seguimiento de glucosa estará en línea y lista para usar.
