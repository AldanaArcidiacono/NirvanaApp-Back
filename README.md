# Nirvana

## Descripción

Proyecto Final. Se creará una página web, del tipo mobile-first, sobre planificación viajes.

### Mínimos

Al ingresar, se podrán ver fotos de los destinos con una breve descripción. Si el usuario hace click sobre estas 'tarjetas', de no estar logado lo
redireccionará al formulario de loggin. En cambio, de estar logado, le direccionará a los detalles de la locación.

En la sección de detalles, aparecerán datos sobre la locación (como por ej puntos a visitar) y además el usuario tendrá un botón al través del cuál podrá guardar
la locación seleccionada en su lista de 'Lugares a visitar'.
En la sección lugares a visitar, el usuario podrá gestionar su lista de la forma que desee, pudiendo eliminar o agregar lugares e indicar si ya ha visitado
el lugar a través de otro botón.
Además la página contará con un buscador (solo para usuarios logados) filtre por país.

### Extras

Generar un calendario donde el usuario pueda indicar que visitará un determinado lugar, en una fecha determinada. Esto se reflejará en su lista de lugares y en
el inicio, cuando este loggeado.

### Modelo de datos

```
IUser:
    id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    visitedPlaces: Array<Types.ObjectId>;

Category:
    category: 'beach' | 'mountain' | 'forest' | 'lake';

IPlace:
    id: Types.ObjectId;
    country: string;
    description: string;
    mustVisit: string;
    img: string;
    isVisited: boolean;
    isNewPlace: boolean;
    category: Category;
    traveler: Types.ObjectId;
```

### EndPoints

#### User:

-   Post - ‘/register’ → Crea un usuario nuevo
-   Post - ‘/login’ → Se fija que exista el usuario en la base de datos y le devuelve un token.
-   Patch - ‘/update’ → Hay que estar logado y autenticado. Agregará a mis viajes el lugar elegido.

#### Place:

-   Get - ‘/’ → (getAll) Mostrará la lista principal de viajes.
-   Get - ‘/find/:key/:value’ → Hay que estar logado. Es el motor del buscador
-   Get - ‘/:id’ → Hay que estar logado. Mostrará los detalles de un viaje seleccionado.
-   Post - ‘/create’ → Hay que estar logado. El usuario agregará un viaje.
-   Patch - ‘/update’ → Hay que estar logado y autenticado. Actualiza los viajes que agrego
-   Delete - ‘/delete/:id’ → Hay que estar logado y autenticado. Eliminará un viaje creado por el user

### Listado de componentes

https://www.notion.so/Final-Proyect-955fad18dea24e51bc5fd45388eaf997

### Figma

https://www.figma.com/file/hyITt8SoPbB5AxY2NIcfwO/Proyecto-Final?node-id=13%3A502&t=TYMwbtA7TJA4WAtG-1
