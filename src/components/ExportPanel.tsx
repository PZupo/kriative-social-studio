import React from "react";
import type { Preset, Idea, TextBundle, KssStyle, BatchPlan } from "../lib/types";

type Props = {
  preset: Preset;
  idea: Idea;
  text: TextBundle;
  styleKey: KssStyle;
  plan: BatchPlan;
  seeds: number[];
};

export default function ExportPanel({ preset, idea, text, styleKey, plan, seeds }: Props) {
  const [busy, setBusy] = React.useState(false);
  const [banner, setBanner] = React.useState<string>("");

  const collectCanvases = () => {
    const list: { idx: number; seed: number; canvasId: string; canvas: HTMLCanvasElement }[] = [];
    seeds.forEach((seed, idx) => {
      const id = `kss-canvas-${idx}`;
      const el = document.getElementById(id) as HTMLCanvasElement | null;
      if (el) list.push({ idx, seed, canvasId: id, canvas: el });
    });
    return list;
  };

  const slug = (s: string) =>
    (s || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase();

  const folderName = React.useMemo(() => {
    const p = preset?.name || "preset";
    return `${slug(styleKey)}_${slug(p)}` || "export";
  }, [styleKey, preset]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const showBanner = (msg: string) => {
    setBanner(msg);
    setTimeout(() => setBanner(""), 2800);
  };

  async function ensureCommitted(canvasId: string): Promise<void> {
    return new Promise((resolve) => {
      window.dispatchEvent(new CustomEvent("kss:render:text", { detail: { id: canvasId } }));
      const handler = () => {
        window.removeEventListener(`kss:render:done:${canvasId}`, handler as any);
        requestAnimationFrame(() => resolve());
      };
      window.addEventListener(`kss:render:done:${canvasId}`, handler as any, { once: true });
    });
  }

  const handleZipAll = async () => {
    if (!seeds.length) {
      alert("Gere as imagens antes de exportar.");
      return;
    }
    setBusy(true);
    try {
      let JSZip: any;
      try {
        JSZip = (await import("jszip")).default;
      } catch {
        JSZip = null;
      }

      const canvases = collectCanvases();
      if (!canvases.length) {
        alert("Nenhum canvas encontrado para exportação.");
        setBusy(false);
        return;
      }

      // garante que todo texto (se houver) foi pintado no canvas
      for (const c of canvases) {
        await ensureCommitted(c.canvasId);
      }

      if (!JSZip) {
        // fallback: baixa PNGs individuais
        canvases.forEach(({ idx, canvas }) => {
          const a = document.createElement("a");
          a.href = canvas.toDataURL("image/png");
          a.download = `kss_${idx + 1}.png`;
          a.click();
        });
        alert("Opcional: instale 'jszip' para exportar ZIP único (npm i jszip).");
        setBusy(false);
        return;
      }

      const zip = new JSZip();
      const root = zip.folder(folderName)!;
      const imgFolder = root.folder("images")!;
      const thumbsFolder = root.folder("thumbs")!;

      const files: { png: string; jpg: string; seed: number; nameBase: string }[] = [];
      for (const { idx, seed, canvas } of canvases) {
        const nameBase = `kss_${idx + 1}_seed-${seed}`;
        const pngData = canvas.toDataURL("image/png");
        const jpgData = canvas.toDataURL("image/jpeg", 0.92);

        imgFolder.file(`${nameBase}.png`, pngData.split(",")[1] || "", { base64: true });
        imgFolder.file(`${nameBase}.jpg`, jpgData.split(",")[1] || "", { base64: true });

        const thumbData = await makeThumb(canvas, 360);
        thumbsFolder.file(`${nameBase}.png`, thumbData.split(",")[1] || "", { base64: true });

        files.push({
          png: `${folderName}/images/${nameBase}.png`,
          jpg: `${folderName}/images/${nameBase}.jpg`,
          seed,
          nameBase,
        });
      }

      const meta = {
        preset,
        styleKey,
        idea,
        text,
        plan,
        seeds,
        count: canvases.length,
        exportedAt: new Date().toISOString(),
      };
      root.file("metadata.json", JSON.stringify(meta, null, 2), { binary: false });

      const html = buildPreviewHtml({
        title: `${preset?.name || "Export"} • ${styleKey}`,
        folderName,
        files,
      });
      root.file("index.html", html, { binary: false });

      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, `kss_export_${Date.now()}.zip`);
      showBanner("✅ Arquivo exportado com sucesso");
    } catch (err) {
      console.error(err);
      alert("Falha ao gerar o ZIP.");
    } finally {
      setBusy(false);
    }
  };

  const handleCopyMetadata = async () => {
    const meta = {
      preset,
      styleKey,
      idea,
      text,
      plan,
      seeds,
      exportedAt: new Date().toISOString(),
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(meta, null, 2));
      showBanner("✅ Metadados copiados");
    } catch {
      const w = window.open();
      if (w) {
        w.document.write(`<pre>${escapeHtml(JSON.stringify(meta, null, 2))}</pre>`);
        w.document.close();
      }
    }
  };

  return (
    <section className="card" style={{ marginTop: 12 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Exportação</h3>
        <div aria-live="polite" aria-atomic="true" style={{ minHeight: 22 }}>
          {banner && <div className="alert alert--success">{banner}</div>}
        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <button
          className="btn btn--primary"
          onClick={handleZipAll}
          disabled={busy || !seeds.length}
          style={{
            whiteSpace: "normal",
            lineHeight: 1.2,
            padding: "10px 16px",
            textAlign: "center",
          }}
        >
          {busy ? (
            "Gerando ZIP…"
          ) : (
            <>
              ⬇ Baixar tudo (.zip)
              <br />
              PNG + JPEG + Preview
            </>
          )}
        </button>

        <button className="btn" onClick={handleCopyMetadata}>
          Copiar metadados (JSON)
        </button>
      </div>

      {!seeds.length && (
        <p style={{ opacity: 0.7, marginTop: 8 }}>
          Dica: gere imagens primeiro para habilitar o ZIP.
        </p>
      )}
    </section>
  );
}

/* ---------- helpers ---------- */

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return m;
    }
  });
}

async function makeThumb(srcCanvas: HTMLCanvasElement, targetW = 360): Promise<string> {
  const ratio = srcCanvas.height / srcCanvas.width;
  const w = targetW,
    h = Math.round(targetW * ratio);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(srcCanvas, 0, 0, w, h);
  return c.toDataURL("image/png");
}

function buildPreviewHtml({
  title,
  folderName,
  files,
}: {
  title: string;
  folderName: string;
  files: { png: string; jpg: string; seed: number; nameBase: string }[];
}) {
  const items = files
    .map(
      (f) => `
    <article class="card">
      <a href="${escapeAttr(f.png)}" target="_blank" rel="noopener">
        <img src="./thumbs/${escapeAttr(f.nameBase)}.png" alt="${escapeAttr(f.nameBase)}" />
      </a>
      <div class="meta">
        <div class="name">${escapeHtml(f.nameBase)}</div>
        <div class="links">
          <a href="./images/${escapeAttr(f.nameBase)}.png" download>PNG</a>
          <a href="./images/${escapeAttr(f.nameBase)}.jpg" download>JPEG</a>
        </div>
      </div>
    </article>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(title)} — preview</title>
<style>
:root{--bg:#f7f3eb;--fg:#111827;--card:#ffffff;--border:#e5e7eb}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;background:var(--bg);color:var(--fg)}
header{position:sticky;top:0;z-index:10;background:#ffffffcc;backdrop-filter:saturate(1.2) blur(6px);border-bottom:1px solid var(--border)}
header .wrap{max-width:1100px;margin:0 auto;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
h1{font-size:16px;margin:0;font-weight:800}.muted{opacity:.7;font-size:12px}
main{max-width:1100px;margin:0 auto;padding:16px}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
.card{border:1px solid var(--border);border-radius:12px;background:var(--card);padding:10px}
.card img{width:100%;height:160px;object-fit:cover;border-radius:8px;background:#0b0f19}
.meta{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
.meta .name{font-size:12px;opacity:.85}
.meta .links a{font-size:12px;margin-left:8px;text-decoration:none;border:1px solid var(--border);padding:4px 6px;border-radius:6px;color:inherit}
footer{max-width:1100px;margin:0 auto;padding:20px 16px;font-size:12px;opacity:.7}
</style>
</head>
<body>
<header><div class="wrap"><h1>${escapeHtml(title)}</h1><div class="muted">${escapeHtml(
    folderName
  )}/</div></div></header>
<main><div class="grid">${items}</div></main>
<footer>Gerado pelo Kriative Social Studio — export ZIP com preview.</footer>
</body></html>`;
}

function escapeAttr(s: string) {
  return s.replace(/["'<>&]/g, (m) => {
    switch (m) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return m;
    }
  });
}
