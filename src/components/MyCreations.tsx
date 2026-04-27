// src/components/MyCreations.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Creation, listCreations, removeCreation } from "../lib/storage";
import { useFeedback } from "@/hooks/useFeedback";

const CHANGE_EVENT = "kss:creations:changed";

export default function MyCreations() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Creation[]>([]);
  const { push } = useFeedback();

  const reload = useCallback(() => {
    try {
      const list = listCreations() || [];
      // mais recentes primeiro (se houver createdAt)
      const sorted = [...list].sort(
        (a: any, b: any) => (b?.createdAt || 0) - (a?.createdAt || 0)
      );
      setItems(sorted);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    reload();

    const onChanged = () => reload();
    window.addEventListener(CHANGE_EVENT, onChanged as EventListener);

    const onStorage = (e: StorageEvent) => {
      reload();
    };
    window.addEventListener("storage", onStorage);

    const onVisible = () => {
      if (document.visibilityState === "visible") reload();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener(CHANGE_EVENT, onChanged as EventListener);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [reload]);

  const doRemove = (id: string) => {
    if (!confirm("Excluir esta criação?")) return;
    try {
      removeCreation(id);
      push({ kind: "info", message: "Criação excluída." });
    } catch {
      push({ kind: "error", message: "Falha ao excluir a criação." });
    } finally {
      reload();
    }
  };

  if (items.length === 0) {
    return (
      <section className="card" style={{ marginTop: 12 }}>
        <h3 style={{ margin: 0 }}>{t('my_creations_title')}</h3>
        <p style={{ opacity: 0.7, marginTop: 6 }}>
          {t('no_saved_creations')}
        </p>
      </section>
    );
  }

  const fmt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <section className="card" style={{ marginTop: 12 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h3 style={{ margin: 0 }}>{t('my_creations_title')}</h3>
        <div className="row" role="toolbar" aria-label="Ações da galeria">
          <button className="btn" onClick={reload} aria-label="Recarregar lista">
            ↻ {t('btn_regenerate') || "Recarregar"}
          </button>
        </div>
      </div>

      {/* Grid Layout Ajustado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: 12 }}>
        {items.map((it) => {
          const when =
            it && (it as any).createdAt
              ? fmt.format(new Date((it as any).createdAt as number))
              : "";
          return (
            <article key={it.id} className="card" style={{ padding: 12 }}>
              {/* data/hora */}
              <div
                style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}
                aria-label={when ? `Criado em ${when}` : undefined}
              >
                {when}
              </div>

              {/* thumb CORRIGIDA */}
              <div className="frame" style={{ padding: 0, borderStyle: "solid", overflow: "hidden" }}>
                <img
                  src={it.dataURL}
                  alt="Pré-visualização da criação"
                  style={{
                    width: "100%",
                    height: "auto",      // ✅ CORREÇÃO: Altura automática para respeitar proporção
                    objectFit: "contain", // ✅ CORREÇÃO: Garante que a imagem inteira apareça
                    display: "block",
                    background: "#0b0f19",
                    minHeight: "150px"   // Mínimo para não ficar sumido se der erro
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                  }}
                />
              </div>

              {/* ações */}
              <div className="row" style={{ marginTop: 10 }}>
                <a
                  className="btn"
                  href={it.dataURL}
                  download={`${it.id}.png`}
                  aria-label="Baixar imagem"
                >
                  ⬇ {t('btn_save') || "Baixar"}
                </a>
                <button
                  className="btn"
                  onClick={() => doRemove(it.id)}
                  aria-label="Excluir criação"
                >
                  🗑 Excluir
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}