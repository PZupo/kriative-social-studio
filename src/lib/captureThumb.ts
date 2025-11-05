/**
 * Captura uma miniatura (thumbnail) a partir do primeiro <canvas> dentro de um elemento raiz.
 * Se quiser capturar um card inteiro com borda/sombra, troque depois por html2canvas.
 *
 * @param root Elemento que contém o <canvas> (ex.: card visual)
 * @param targetWidth Largura desejada da miniatura (padrão: 360px)
 * @returns string base64 (dataURL)
 */
export async function captureThumbnail(root: HTMLElement, targetWidth = 360): Promise<string> {
  const canvas = root.querySelector("canvas") as HTMLCanvasElement | null;
  if (!canvas) throw new Error("Canvas não encontrado para thumbnail");

  const scale = targetWidth / canvas.width;
  const w = Math.round(canvas.width * scale);
  const h = Math.round(canvas.height * scale);

  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ctx = off.getContext("2d");
  if (!ctx) throw new Error("Falha ao obter contexto 2D");

  ctx.drawImage(canvas, 0, 0, w, h);

  return off.toDataURL("image/jpeg", 0.9);
}
