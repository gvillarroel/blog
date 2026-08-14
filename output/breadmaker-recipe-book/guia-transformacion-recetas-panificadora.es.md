# Cómo transformar una receta tradicional para la panificadora Zojirushi BB-PDC20 / BB-PPC20

## Objetivo

El objetivo no es copiar una receta dentro del recipiente. Es transformar una fórmula y un proceso variables en una fórmula que pueda sobrevivir a un programa con volumen, amasado, temperatura, fermentaciones y horneado predeterminados.

Una conversión completa debe producir cinco cosas:

1. una fórmula en gramos que no exceda la capacidad;
2. un curso de la máquina o una secuencia Homemade;
3. un orden de carga de ingredientes;
4. una lista de intervenciones, como el Add Beep, raspado o formado manual;
5. un protocolo para corregir la siguiente prueba.

La [comparación receta por receta](comparativa-original-vs-maquina.es.md) es la evidencia de esta guía. La [plantilla de trabajo](plantilla-conversion-receta.es.md) permite aplicar el método a una receta nueva.

## La decisión que debe tomarse primero

Antes de cambiar cantidades, defina qué quiere preservar:

| Prioridad | Estrategia recomendada |
|---|---|
| Máxima automatización | Transformar fórmula, fermentación y forma para obtener una hogaza rectangular completamente automática. |
| Máxima fidelidad al pan original | Usar Course 11 - Dough para mezclar, amasar y hacer la primera fermentación; formar y hornear fuera. |
| Equilibrio entre ambos | Usar Course 15 - Homemade, con pausas para formar o con tiempos personalizados. |

Una baguette, un bagel, una focaccia o una babka pierden parte de su identidad si se fuerzan a terminar como una hogaza de panificadora. En esos casos, delegar solo la masa no es una conversión incompleta: es la transformación correcta.

## Las cuatro capas de transformación

| Capa | Pregunta | Qué se puede escalar | Qué debe recalibrarse |
|---|---|---|---|
| 1. Capacidad | ¿Cabe sin desbordar ni quedar demasiado pequeño? | Harina y casi todos los ingredientes por un mismo factor inicial. | Reserva para cereales, fruta, nueces, huevos y rellenos. |
| 2. Reología | ¿Las palas producirán una masa suave que pueda retener gas? | Relación inicial entre harina y agua. | Absorción de la harina, integral, centeno, granos, grasa, huevos, purés y gluten añadido. |
| 3. Cinética | ¿La masa llegará al punto correcto justo cuando empiece el horneado? | Sal, azúcar y grasa como punto de partida. | Tipo y cantidad de levadura, temperatura del líquido, acidez y curso. La levadura no se escala de forma ciega. |
| 4. Geometría y calor | ¿La forma y la corteza dependen del formado, vapor, fritura o hervor? | Nada de forma automática. | Elegir hogaza completa, Dough, pausa Shape, horneado externo o programa Homemade. |

## Restricciones duras de esta máquina

Zojirushi establece para sus modelos de 2 lb, incluido el BB-PDC20, un máximo general de 5 tazas o 20 oz de harina y 2 tazas de líquido. Veinte onzas de harina son aproximadamente 567 g. También advierte que las inclusiones reducen la capacidad efectiva. Consulte la [FAQ oficial de Zojirushi](https://www.zojirushi.com/app/faq/breadmakers) y la [guía de conversión de King Arthur](https://www.kingarthurbaking.com/blog/2018/04/30/how-to-convert-recipes-to-a-bread-machine).

El propio recetario confirma el límite:

- las hogazas normales usan habitualmente 545 a 553 g de harina;
- el máximo observado es 563 g de harina integral;
- el Raisin Bread baja a 520 g cuando incorpora 140 g de pasas;
- el Mini White usa 406 g, pero requiere un programa Homemade específico;
- los productos de Dough suelen usar 433 a 488 g de harina.

Regla práctica inferida de las fórmulas del libro para la primera prueba, no un límite adicional del fabricante:

- use 545 a 550 g de harina para una hogaza automática sin inclusiones pesadas;
- use 500 a 520 g si la carga de fruta, nueces o cereal seco se acerca a 20% de la harina;
- no supere 567 g de harina ni la capacidad líquida indicada por el fabricante;
- para una masa menor que la hogaza mínima normal de 1.5 lb, use una fórmula y tiempos personalizados. Zojirushi identifica 1.5 lb como el mínimo normal de sus máquinas de 2 lb en su [guía de uso](https://store.zojirushi.com/blogs/breadmakers/here-s-what-you-should-know-usage).

Las recetas sin gluten validadas por el fabricante son una excepción estructural: son batidos con huevos, almidones y goma, no masas de trigo. No intente reconstruirlas aplicando solamente el límite o la hidratación de un pan blanco.

## Algoritmo de conversión

### Paso 1 - Clasifique la receta por su proceso, no por su nombre

| Familia real | Señales | Primera opción |
|---|---|---|
| Hogaza directa de trigo | Una masa, dos fermentaciones, molde y horno | Course 1 - White |
| 50% a 100% integral | Mucho salvado, mayor absorción, menor volumen | Course 2 - Whole Wheat |
| Pan magro europeo | Poco azúcar y grasa, fermentación moderada | Course 3 - European |
| Multigrano | Cereales, semillas o granos además de harina | Course 4 - Multigrain |
| Sin gluten | Batido espeso, almidones, xantana, huevo | Course 5 - Gluten Free o Course 15 para piezas separadas |
| Sin sal | La receta elimina el regulador principal de la fermentación | Course 6 - Salt Free con fórmula específica |
| Sin azúcares añadidos | Se eliminan azúcar y miel | Course 7 - Sugar Free con fórmula específica |
| Vegano | Sustitución de leche, mantequilla y huevo | Course 8 - Vegan |
| Rápido | Se acepta menos desarrollo de sabor y se usa levadura rápida | Courses 9 o 10 |
| Panecillos, bagels, pizza, doughnuts | La forma o el horneado define el producto | Course 11 - Dough |
| Relleno, mármol, tamaño especial | Requiere pausa, segundo amasado o tiempos propios | Course 15 - Homemade |
| Masa madre natural | Fermentación larga controlada por madurez, no por reloj fijo | Dough, Homemade o proceso manual |
| Quick bread o cake | Leudante químico, sin fermentación de levadura | Course 13 - Cake |

El Basic/White con corteza media es el punto de partida recomendado para una hogaza común. Los panes con fermentación larga, forma especial o corteza libre son mejores candidatos para Dough. Esta distinción coincide con la [guía de conversión de King Arthur](https://www.kingarthurbaking.com/blog/2018/04/30/how-to-convert-recipes-to-a-bread-machine).

### Paso 2 - Pase la receta a gramos y porcentajes de panadero

Sume toda la harina, incluida la harina de una biga, poolish o masa madre:

```text
harina total = suma de todas las harinas de la masa y los prefermentos
porcentaje de ingrediente = gramos del ingrediente / gramos de harina total x 100
```

Ejemplo:

```text
500 g harina = 100%
330 g agua   = 66%
10 g sal     = 2%
6 g levadura = 1.2%
```

Los porcentajes permiten escalar sin perder relaciones. La [referencia de porcentajes de panadero](https://www.kingarthurbaking.com/pro/reference/bakers-percentage) explica también cómo descomponer prefermentos.

Mantenga dos medidas separadas:

- `hidratación panadera`: agua y fracción acuosa conocida de otros ingredientes, divididas por la harina;
- `carga líquida de la máquina`: agua, leche, huevos, miel, purés, yogur, mantequilla y aceite que afectan la consistencia y la capacidad.

Aceite no es agua y un huevo no equivale a 50 g de agua, pero ambos vuelven más fluida o pesada la mezcla. No sume todos los líquidos como si fueran hidratación; sí regístrelos para entender lo que las palas encuentran. La [guía de máquinas de King Arthur](https://www.kingarthurbaking.com/learn/guides/bread-machines) desarrolla esta diferencia operativa.

### Paso 3 - Escale primero; ajuste funciones después

El factor inicial es:

```text
k = harina objetivo / harina original
ingrediente escalado = ingrediente original x k
```

Para una receta de 360 g de harina y un objetivo de 550 g:

```text
k = 550 / 360 = 1.528
```

Multiplique por `k` harina, agua, sal, grasa, azúcar y demás ingredientes para crear un borrador. Después recalcule los ingredientes funcionales. No use el resultado escalado de levadura como cantidad final.

### Paso 4 - Compare el borrador con un ancla de la máquina

Estas fórmulas del recetario sirven como anclas, no como límites universales:

| Ancla | Curso | Harina | Líquido principal | Sal | Levadura | Compensaciones |
|---|---:|---:|---:|---:|---:|---|
| Basic White 1 | 1 | 553 g | 320 g agua, 57.9% | 10 g, 1.8% | 6 g, 1.1% rapid rise | 48 g azúcar, 8 g leche seca, 35 g mantequilla |
| French 11 | 3 | 553 g | 320 g agua, 57.9% | 10 g, 1.8% | 3 g, 0.54% rapid rise | Solo 12 g azúcar y 12 g leche seca |
| Whole Wheat 7 | 2 | 553 g | 370 g agua, 66.9% | 10 g, 1.8% | 6 g, 1.1% rapid rise | 32 g gluten vital, miel, azúcar y mantequilla |
| Light Rye 9 | 2 | 553 g total | 330 g agua, 59.7% | 10 g, 1.8% | 6 g, 1.1% rapid rise | 23.5% centeno, 11.8% integral, 64.7% panificable |
| Rapid White 27 | 9 | 553 g | 320 g agua, 57.9% | 10 g, 1.8% | 7.5 g, 1.36% rapid rise | Misma fórmula que Basic White salvo la levadura |
| Sugar Free White 23 | 7 | 545 g | 320 g agua, 58.7% | 7.5 g, 1.38% | 3 g, 0.55% rapid rise | Sin azúcar; más leche seca; ciclo más largo |
| Vegan White 25 | 8 | 545 g | 160 g agua + 160 g bebida de almendra | 10 g, 1.83% | 4.5 g, 0.83% rapid rise | 24 g aceite de oliva, sin leche seca ni mantequilla |

Si el borrador queda muy lejos del ancla de su familia, no corrija todo a la vez. Pregunte qué ingrediente cambió la función: absorción, estructura, velocidad, capacidad o sabor.

### Paso 5 - Recalibre la estructura

#### Harina blanca

Use harina panificable o una harina de trigo con proteína suficiente. Red Star sitúa la harina panificable alrededor de 12% a 14% de proteína y advierte que una harina común débil puede no resistir el amasado de la máquina: [FAQ de Red Star Yeast](https://redstaryeast.com/frequently-asked-questions/).

#### Harina integral

El salvado absorbe más agua y corta parte de la red de gluten. Para una primera conversión no validada, la [FAQ de Red Star](https://redstaryeast.com/frequently-asked-questions/) propone empezar con una sustitución parcial:

1. pruebe 25% a 30% de sustitución integral;
2. aumente gradualmente en pruebas posteriores;
3. añada líquido según la masa observada;
4. cuando llegue a 100% integral, use el ancla Whole Wheat y evalúe gluten vital.

En el recetario, los panes 100% integrales usan 5.7% a 5.8% de gluten vital. Esa es una decisión específica de Zojirushi para obtener altura en este ciclo, no una obligación para todo pan integral.

#### Centeno y harinas sin gluten de trigo

Centeno, maíz, avena y otros granos aportan poco o ningún gluten. El Light Rye automático del libro limita el centeno a 23.5% y conserva 64.7% de harina panificable. Si el estilo exige mucho más centeno, la solución suele ser aceptar una hogaza densa, usar un ciclo personalizado o hornear fuera.

#### Cereales y semillas

Trátelos como carga seca adicional. Absorben agua, interfieren con el gluten y reducen capacidad. Si la receta manual los remoja, preserve el remojo y contabilice el agua. Si no los remoja, empiece con más reserva de capacidad y ajuste la masa durante el amasado.

### Paso 6 - Recalibre hidratación y consistencia

El número de hidratación es un punto de partida; la masa real decide.

Revise a los 5 minutos de amasado, antes de las fermentaciones. Para trigo, busque una bola:

- suave;
- lisa o camino a alisarse;
- ligeramente pegajosa al tacto;
- capaz de despegarse del fondo y volver a unirse.

Correcciones durante la primera prueba:

- masa seca, grumosa o que no toma las inclusiones: añada agua o leche 1 cucharadita, aproximadamente 5 g, cada vez y espere a que se absorba;
- masa que forma una pasta o charco bajo las palas: añada 5 a 10 g de harina panificable cada vez;
- masa sin gluten: no busque una bola; debe ser un batido espeso y requiere raspar laterales según la receta.

Zojirushi recomienda observar la masa y añadir agua o leche una cucharadita a la vez: [FAQ de solución de problemas](https://www.zojirushi.com/app/faq/breadmakers).

### Paso 7 - Recalibre fermentación, no solo levadura

La máquina no decide si la masa está madura; ejecuta un reloj. Por eso la combinación importa más que un único número.

#### Levadura

- Los cursos normales del libro usan habitualmente 6 g de rapid rise por unos 550 g de harina, cerca de 1.1%.
- Los cinco panes Rapid usan 7.5 g, un aumento de 25%, pero algunos también cambian agua, harina, azúcar o inclusiones.
- Red Star propone como referencia de máquina 1/2 cucharadita de levadura instantánea por taza de harina y 3/4 de cucharadita de active dry; el tipo instantáneo actúa más rápido.
- No use active dry en un curso rápido salvo que la receta de ese modelo lo haya validado.
- Si el pan sube y colapsa, reduzca la levadura 1/8 a 1/4 de cucharadita por prueba y use líquido frío.

#### Sal

La zona normal es aproximadamente 1.8% a 2.2% de la harina. La sal no es solo sabor: frena la fermentación y fortalece la estructura. Quitarla sin cambiar curso y levadura puede producir sobrefermentación y colapso.

En la transformación observada White 1 -> Salt Free White 21, el libro:

- elimina 10 g de sal;
- reduce la levadura de 6 g a 3 g;
- añade 15 g de vinagre;
- usa Course 6.

Eso demuestra que `sin sal` es una transformación cinética y estructural, no la eliminación de una fila.

#### Azúcar y miel

La levadura puede obtener azúcares de la harina; añadir azúcar no es obligatorio. Sin embargo, azúcar y miel cambian velocidad, color, humedad y ternura. Por encima de aproximadamente 10% de azúcar, la fermentación empieza a ralentizarse y puede requerir levadura osmotolerante o más tiempo: [referencia sobre azúcar y levadura](https://www.kingarthurbaking.com/blog/2017/05/16/reduce-sugar-in-yeast-bread?page=1).

En White 1 -> Sugar Free White 23, Zojirushi no solo quita 48 g de azúcar:

- baja levadura de 6 a 3 g;
- baja sal de 10 a 7.5 g;
- baja mantequilla de 35 a 28 g;
- sube leche seca de 8 a 12 g;
- alarga el ciclo medio de 3:25 a 4:15.

#### Temperatura

Muchas recetas del libro piden agua a 41°F / 5°C cuando la habitación supera 77°F / 25°C. El líquido frío evita que una masa rápida llegue demasiado pronto al volumen máximo. Registre la temperatura ambiente; una fórmula que funciona en invierno puede sobrefermentar en verano.

### Paso 8 - Trate grasa, lácteos y sustituciones como cambios funcionales

Grasa ablanda, conserva y reduce la corteza crujiente; demasiada grasa o azúcar puede retrasar fermentación y dejar el centro crudo.

La transformación observada White 1 -> Vegan White 25 hace esto:

| Función | White 1 | Vegan White 25 |
|---|---:|---:|
| Líquido nominal | 320 g agua | 160 g agua + 160 g bebida de almendra |
| Grasa | 35 g mantequilla | 24 g aceite de oliva |
| Lácteo seco | 8 g | 0 g |
| Azúcar | 48 g | 36 g |
| Levadura | 6 g | 4.5 g |

La sustitución preserva el total nominal de líquido, pero reduce grasa, azúcar y levadura. Por eso `mantequilla por la misma cantidad de aceite` no sería la regla extraída de esta máquina.

### Paso 9 - Reserve las inclusiones para el Add Beep

Fruta, nueces, chips y semillas grandes pueden romperse, cortar gluten o impedir que la masa se una.

En el libro, las inclusiones añadidas al aviso representan aproximadamente 9% a 27% de la harina:

| Receta | Inclusión | Carga sobre harina |
|---|---:|---:|
| Multigrain Raisin 17 | 47 g pasas / 521 g harina | 9.0% |
| Whole Wheat Walnut 8 | 73 g nueces / 563 g harina | 13.0% |
| Chocolate 5 | 90 g chips / 545 g harina | 16.5% |
| Cranberry & Walnut 6 | 95 g / 553 g harina | 17.2% |
| Raisin 4 | 140 g / 520 g harina | 26.9% |

Para la primera prueba, 10% a 15% es una zona conservadora. Por encima de 15%, reduzca tamaño del lote, revise hidratación y espere más variabilidad. El 26.9% observado es una receta específica de pasas, no un máximo universal para cualquier ingrediente.

Use el Add Beep, separe piezas pegadas y córtelas al tamaño indicado. El recetario usa con frecuencia piezas de aproximadamente 1/4 de pulgada / 6 mm.

### Paso 10 - Cambie el orden de carga

Ignore el orden de mezclado manual y siga el orden de la máquina:

1. líquidos;
2. harina, apilada en el centro;
3. azúcar, leche seca, sal y grasa;
4. levadura en una depresión de la harina, sin contacto inicial con el líquido;
5. inclusiones en el Add Beep.

La separación de levadura y líquido es especialmente importante si usa inicio diferido. El orden aparece en el [manual oficial BB-PDC20](https://www.zojirushi.com/servicesupport/manuals/manual_pdf/bb_pdc20_e.pdf).

No use Timer con huevo, leche fresca, carne, queso u otros ingredientes perecederos, ni cuando el recetario marque `Timer unavailable`.

## Transformaciones observadas que sí se pueden aprender del libro

| Transformación | Cambios observados | Regla general que puede extraerse |
|---|---|---|
| White 1 -> Rapid White 27 | Solo levadura: 6 -> 7.5 g; ciclo 3:25 -> 2:25. | El 25% extra de levadura es válido para este par y este curso, no para toda receta. |
| Italian 2 -> Rapid Italian 28 | Harina -8 g; azúcar +12 g; leche seca +8 g; albahaca x2; levadura +25%. | Un curso rápido puede necesitar cambios de sabor, sólidos y estructura además de levadura. |
| Raisin 4 -> Rapid Raisin 29 | Agua +20 g; harina +25 g; azúcar +12 g; pasas -47 g; levadura +25%. | Reducir carga pesada ayuda a completar un ciclo corto. |
| Whole Wheat 7 -> Rapid Whole Wheat 30 | Agua +10 g; levadura +25%; lo demás igual. | El salvado recibe un poco más de agua cuando pierde tiempo de hidratación. |
| Light Rye 9 -> Rapid Light Rye 31 | Elimina integral; centeno 130 -> 87 g; panificable 358 -> 455 g; levadura +25%. | Para acelerar una masa débil, aumenta la proporción de trigo con gluten. |
| White 1 -> Sugar Free White 23 | Quita 48 g azúcar; levadura -50%; sal -25%; grasa -20%; ciclo +50 min. | Eliminar azúcar exige reequilibrar fermentación, estructura, color y tiempo. |
| Whole Wheat 7 -> Sugar Free Whole Wheat 24 | Quita miel y azúcar; levadura -50%; gluten -50%; agua -10 g; ciclo +55 min. | No copie el ajuste del blanco: cada matriz de harina necesita su propia calibración. |
| White 1 -> Vegan White 25 | Conserva 320 g de líquido nominal; leche seca fuera; mantequilla -> menos aceite; azúcar y levadura bajan. | Una sustitución dietaria es un conjunto coordinado, no un reemplazo 1:1. |
| White 1 -> Mini White 46 | Harina x0.734; agua x0.75; levadura x0.5; programa Homemade 2:45. | El lote escala casi linealmente, pero levadura y tiempos no. |
| White 1 -> Cranberry & Walnut 6 | Base idéntica +95 g de inclusiones; Add Beep; Timer no disponible. | Si la base ya está equilibrada, una inclusión moderada puede añadirse sin rediseñar toda la fórmula. |

## Ejemplos completos

### Ejemplo A - Pan blanco manual convertido a hogaza automática

[Receta manual de referencia](https://www.kingarthurbaking.com/recipes/our-favorite-sandwich-bread-recipe):

```text
360 g harina
227 g leche
28 g mantequilla
25 g azúcar
8 g sal
levadura
```

Objetivo: 553 g de harina. Factor `k = 553 / 360 = 1.536`.

El escalado lineal produciría aproximadamente:

```text
553 g harina
349 g leche
43 g mantequilla
38 g azúcar
12.3 g sal
levadura original x 1.536
```

La fórmula validada Basic White 1 usa:

```text
553 g harina panificable
320 g agua
8 g leche seca
48 g azúcar
10 g sal
35 g mantequilla
6 g rapid rise yeast
Course 1, corteza media, 3:25
```

Transformaciones aprendidas:

1. leche líquida se reformula como agua más leche seca;
2. sal baja de 2.2% a 1.8%;
3. grasa baja de 7.8% a 6.3%;
4. azúcar sube de 6.9% a 8.7% para el perfil de pan de molde de la máquina;
5. levadura se fija por el curso en 1.1%, no se escala linealmente;
6. se acepta la forma del recipiente y la corteza cerrada.

Si preservar el sabor lácteo original importa más que el botón único, use Dough y hornee la receta escalada en su molde original.

### Ejemplo B - Pan 100% integral

La [fórmula manual de referencia](https://www.kingarthurbaking.com/recipes/classic-100-whole-wheat-bread-recipe) usa 397 g de integral, 227 a 255 g de agua, 50 g de aceite, 85 g de miel, 28 g de leche seca y 8 g de sal.

La fórmula Whole Wheat 7 usa 553 g de integral y:

```text
370 g agua, 66.9%
40 g miel, 7.2%
36 g azúcar, 6.5%
8 g leche seca, 1.4%
10 g sal, 1.8%
32 g gluten vital, 5.8%
28 g mantequilla, 5.1%
6 g rapid rise yeast, 1.1%
```

La máquina aumenta hidratación directa y añade soporte de gluten, pero reduce radicalmente grasa, leche seca y carga total de miel frente al simple escalado. Eso permite que una masa con salvado alcance volumen dentro de 3:20 sin volverse demasiado pesada.

### Ejemplo C - Bagel

Un bagel depende de forma, superficie y hervor. Convertirlo a hogaza destruiría el producto.

La transformación correcta del libro es:

1. 488 g harina, 300 g agua, azúcar, sal y levadura;
2. Course 11 para amasado y primera fermentación;
3. dividir y formar diez anillos;
4. segunda fermentación fuera;
5. hervir 30 segundos por lado en agua con miel;
6. hornear a 375°F / 191°C.

Aquí la máquina sustituye trabajo, no el proceso que define al bagel.

### Ejemplo D - Masa madre natural

Una masa madre madura según actividad biológica, temperatura y acidez; no siempre cabe en un reloj fijo. El Light Sourdough 37 del libro resuelve esa incompatibilidad usando 12 g de levadura comercial y vinagre más limón. Es una conversión eficaz para obtener sabor ácido el mismo día, pero cambia la identidad del pan.

Si el objetivo es masa madre natural:

1. incluya harina y agua del iniciador en los porcentajes totales;
2. use Dough o Homemade para mezclar y amasar;
3. controle fermentación por volumen y madurez;
4. forme y hornee fuera, o programe fases solo después de medir tiempos reales en su cocina.

## Protocolo de la primera prueba

1. Empiece con Basic/White y corteza media, o con Dough si existe alguna duda sobre forma o fermentación.
2. Pese todo; no convierta de tazas si la fuente también ofrece gramos.
3. Registre temperatura ambiente y del líquido.
4. Observe la masa a los 5 minutos de amasado.
5. Corrija con incrementos pequeños y registre cada uno.
6. No abra durante segunda fermentación o Bake.
7. Mida altura máxima, colapso, color, cocción del centro y textura al enfriar.
8. Cambie una sola variable en la siguiente prueba.

## Diagnóstico y siguiente cambio

| Resultado | Causas probables | Próxima corrección aislada |
|---|---|---|
| Sube y colapsa | Exceso de levadura, agua o azúcar; poca sal; masa caliente | Reduzca levadura 1/8 a 1/4 tsp. o 0.4 a 0.8 g; mantenga lo demás y use líquido frío. |
| Bajo, denso y oscuro | Masa seca, harina débil, levadura vieja, exceso de sal | En la próxima prueba añada 5 a 10 g de líquido o use harina panificable fresca. |
| Grumoso o asimétrico | Muy seco, lote demasiado pequeño o palas mal instaladas | Añada 5 g de líquido durante amasado; verifique tamaño y palas. |
| Pasta bajo las palas | Exceso de líquido o harina con baja absorción | Añada 5 a 10 g de harina durante amasado. |
| Centro crudo | Lote excesivo, demasiada grasa/azúcar, Bake corto | Reduzca carga o use Homemade/Dough y horneado externo. |
| Corteza gruesa y oscura | Exceso de harina o masa seca | Reduzca harina aproximadamente 10 a 16 g en la siguiente prueba o sustituya parte del agua por leche. |
| Inclusiones quedan fuera | Masa demasiado seca, piezas grandes o incorporación tardía | Corrija hidratación, reduzca tamaño y use Add Beep. |
| Pan demasiado pálido | Poco azúcar/lácteo o Bake corto | Cambie primero crust control; después ajuste sólidos de leche o azúcar. |

Las relaciones entre defecto y causa se contrastaron con la [guía de uso y diagnóstico de Zojirushi](https://store.zojirushi.com/blogs/breadmakers/here-s-what-you-should-know-usage).

## Cuándo no intentar una hogaza totalmente automática

Use Dough o Homemade si la receta tiene una o más de estas señales:

- biga, poolish, masa madre o fermentación nocturna que debe evaluarse por madurez;
- formado que define el producto: baguette, bagel, trenza, rollo, babka, focaccia;
- fritura, hervor, vapor intenso, greñado o piedra de horno;
- relleno, laminado o varias masas de colores;
- más de 10% de azúcar o una masa muy rica en huevo y grasa sin ciclo validado;
- gran carga de centeno, granos o inclusiones;
- una hidratación o una harina muy distinta de las anclas del libro;
- ingredientes perecederos con inicio diferido.

## Regla final

No pregunte solamente `¿cuánto multiplico cada ingrediente?`. Pregunte:

```text
¿Qué restricciones de capacidad, estructura, fermentación y forma
resolvía el proceso manual, y cómo las resolverá ahora la máquina?
```

Si la respuesta incluye fórmula, curso, orden, intervención y criterio de corrección, la receta ya está transformada. Si solo contiene cantidades escaladas, todavía es un primer borrador.

## Fuentes principales

- [Zojirushi Breadmaker FAQ - capacidad, recetas propias y diagnóstico](https://www.zojirushi.com/app/faq/breadmakers)
- [Manual oficial Zojirushi BB-PDC20](https://www.zojirushi.com/servicesupport/manuals/manual_pdf/bb_pdc20_e.pdf)
- [Recetario convertido a Markdown](BBPDC_BBPPC_Recipe_en.md)
- [How to convert your favorite recipes to a bread machine - King Arthur Baking](https://www.kingarthurbaking.com/blog/2018/04/30/how-to-convert-recipes-to-a-bread-machine)
- [Bread Machines Guide - King Arthur Baking](https://www.kingarthurbaking.com/learn/guides/bread-machines)
- [Baker's Percentage - King Arthur Baking](https://www.kingarthurbaking.com/pro/reference/bakers-percentage)
- [Red Star Yeast FAQ - tipos de levadura, harina, sal e integral](https://redstaryeast.com/frequently-asked-questions/)
- [Zojirushi Usage and Troubleshooting](https://store.zojirushi.com/blogs/breadmakers/here-s-what-you-should-know-usage)
