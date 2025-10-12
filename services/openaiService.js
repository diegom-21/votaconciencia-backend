const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generarResumenIA = async (planTexto, tema) => {
    if (!planTexto || planTexto.trim() === "") {
        throw new Error("El plan de gobierno está vacío o no es válido.");
    }

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente que resume planes de gobierno en un lenguaje claro, sencillo y fácil de entender para cualquier ciudadano, evitando tecnicismos y explicaciones largas."
                },
                {
                    role: "user",
                    content: `Resume el plan de gobierno para el tema "${tema}" en un único párrafo breve, claro y directo (máx. 3-4 líneas). 
  El resumen debe ser fácil de leer y entender, como para mostrarlo en una tarjeta informativa de una página web para ciudadanos comunes. 
  Evita listas, subtítulos o tecnicismos. 
  Luego de ese resumen, en una nueva línea, añade lo siguiente:
  
  "Orientación política: [Izquierda Autoritaria / Izquierda Libertaria / Derecha Autoritaria / Derecha Libertaria]"
  "Nivel de afinidad: [Porcentaje entre 0 y 100]"
  "Explicacion": "Breve descripción de por qué se clasifica así (1 línea)."

  Solo esas líneas extra, sin explicaciones ni formato JSON.
  
  Texto base:\n\n${planTexto}`
                }
            ]
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error al generar el resumen con OpenAI:", error);
        throw new Error("No se pudo generar el resumen con OpenAI.");
    }
};

module.exports = { generarResumenIA };