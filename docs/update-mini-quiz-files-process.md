# Update Mini Quiz Files Process

1. Agregar atributo `data-id-field`. Buscar en el editor el elemento `input` que contenga `onKeyDown='return enterKeyIsTab(event);' data-default='1000'`, agrega este atributo al padre del `td` buscando.

1. Agregar atributo `data-name-field`. Buscar en el editor el elemento `input` que contenga `onKeyDown='return enterKeyIsTab(event);' data-default=''`, agrega este atributo al padre del `td` buscando.

1. Agregar `data-grade-field`. Buscar en el editor el elemento `object` que contenga `emailAttachment='Grade: `. Copia el campo de excel (generalmente J62 u O62). Busca el elemento `td` que contenga ese campo de excel. Ahi vas a agregar dicho atributo