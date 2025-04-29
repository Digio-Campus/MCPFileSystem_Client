## USO

1. Iniciar llm en un servidor local, debe ser compatible con el SDK de OpenAi. Puedes usar Jan para esto.
2. Modificar .env para incluir el modelo que se está usando, el prompt y la url base del servidor (está puesta por defecto)
3. Ejecutar el comando ```node app.js```

## CONSIDERACIONES

1. El programa solo tendrá acceso a los directorios especificados (por defecto files). Se puede modificar en app.js en la declaración del servidor mcp
   ``` EJ ln.20
   const transport = new StdioClientTransport({
        command: "npx",
        args: [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "ruta",
          "otra ruta",
           ...
      ],
      });```
2.  El modelo especificado por defecto en .env no funcionará correctamente, es necesario un modelo con la función de tool calling.
