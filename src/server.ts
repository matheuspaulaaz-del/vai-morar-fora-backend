import express, { Request, Response } from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// ======================================
// SUPABASE CLIENT
// ======================================
const supabaseUrl = "https://smhxscjxbehtiikqywrh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtaHhzY2p4YmVodGlpa3F5d3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTQzNzUsImV4cCI6MjA3OTUzMDM3NX0.hmALWsmRYHeMLemph1TOpdTW4EG3DQ8NHLSFTxhgDg4";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ======================================
// EXPRESS SETUP
// ======================================
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ======================================
// HEALTH CHECK
// ======================================
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "vai-morar-fora-backend rodando 🚀" });
});

// ======================================
// PROFILES
// ======================================

// GET /profiles/:id
app.get("/profiles/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro profile GET:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// POST /profiles
app.post("/profiles", async (req: Request, res: Response) => {
  const { id, country, area, english_level, full_name } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id é obrigatório" });
  }

  const payload: any = {
    id,
    country,
    area,
    english_level,
  };

  if (full_name) payload.full_name = full_name;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Erro profile POST:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// ======================================
// AGENDA NOTES
// ======================================

// GET /agenda/notes/:userId
app.get("/agenda/notes/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("agenda_notes")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Erro agenda_notes GET:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(data || { user_id: userId, notes: "" });
});

// POST /agenda/notes
app.post("/agenda/notes", async (req: Request, res: Response) => {
  const { user_id, notes } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id é obrigatório" });
  }

  const { data, error } = await supabase
    .from("agenda_notes")
    .upsert({ user_id, notes }, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    console.error("Erro agenda_notes POST:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// ======================================
// AGENDA ITEMS
// ======================================

// GET /agenda/items/:userId
app.get("/agenda/items/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("agenda_items")
    .select("*")
    .eq("user_id", userId)
    .order("target_date", { ascending: true });

  if (error) {
    console.error("Erro agenda_items GET:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// POST /agenda/items
app.post("/agenda/items", async (req: Request, res: Response) => {
  const { user_id, title, description, target_date } = req.body;

  if (!user_id) return res.status(400).json({ error: "user_id é obrigatório" });
  if (!title) return res.status(400).json({ error: "title é obrigatório" });

  const { data, error } = await supabase
    .from("agenda_items")
    .insert([
      {
        user_id,
        title,
        description: description || null,
        target_date: target_date || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro agenda_items POST:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
});

// PATCH /agenda/items/:id
app.patch("/agenda/items/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, target_date, is_done } = req.body;

  const payload: any = {};
  if (title !== undefined) payload.title = title;
  if (description !== undefined) payload.description = description;
  if (target_date !== undefined) payload.target_date = target_date;
  if (is_done !== undefined) payload.is_done = is_done;

  const { data, error } = await supabase
    .from("agenda_items")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro agenda_items PATCH:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// ======================================
// SAVED JOBS
// ======================================

// GET /saved-jobs/:userId
app.get("/saved-jobs/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro saved_jobs GET:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

// POST /saved-jobs
app.post("/saved-jobs", async (req: Request, res: Response) => {
  const { user_id, job_title, company_name, location, source, job_url } = req.body;

  if (!user_id) return res.status(400).json({ error: "user_id é obrigatório" });
  if (!job_title || !job_url)
    return res.status(400).json({ error: "job_title e job_url são obrigatórios" });

  const { data, error } = await supabase
    .from("saved_jobs")
    .insert([
      {
        user_id,
        job_title,
        company_name: company_name || null,
        location: location || null,
        source: source || null,
        job_url,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro saved_jobs POST:", error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json(data);
});

// ======================================
// START SERVER
// ======================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
