import { GoogleGenerativeAI } from "@google/generative-ai";

// Tente inicializar especificando a versão da API se a sua SDK permitir, 
// ou use o modelo que é padrão da v1.
const genAI = new GoogleGenerativeAI("AIzaSyDIow0qkwzac6SLmkbkPLrbT2achUtPRsk");

async function run() {
  try {
    // Tentativa A: Nome direto (padrão v1)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Se o erro persistir, o Google quer que você use o modelo 1.0 Pro 
    // ou que atualize o endpoint. Vamos testar o 1.5 Flash na v1:
    const result = await model.generateContent("Oi");
    const response = await result.response;
    console.log("✅ CONECTADO NA V1:", response.text());
  } catch (error) {
    console.error("❌ AINDA DÁ 404. Tentando alternativa...");
    try {
        // Tentativa B: Forçar o modelo que SEMPRE existe
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Oi");
        console.log("✅ CONECTADO VIA GEMINI-PRO");
    } catch (e2) {
        console.error("❌ ERRO FATAL: Sua chave não tem acesso aos modelos via v1beta nem v1.");
    }
  }
}
run();