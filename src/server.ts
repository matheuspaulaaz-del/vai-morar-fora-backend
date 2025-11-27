import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ROTA RAIZ – APENAS TESTE
app.get("/", (req: Request, res: Response) => {
  res.send("VaiMorarFora Backend funcionando 🚀");
});

// EXEMPLO DE ROTA DE STATUS
app.get("/status", (req: Request, res: Response) => {
  res.json({
    ok: true,
    message: "Backend ativo",
    timestamp: new Date().toISOString(),
  });
});

// INICIA O SERVIDOR
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔥 Server rodando na porta ${PORT}`);
});
