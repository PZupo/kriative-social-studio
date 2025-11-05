import React from "react";
import MyCreations from "@/components/MyCreations";

export default function Library() {
  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Biblioteca</h1>
        <p className="text-sm opacity-70">
          Suas miniaturas salvas do editor.
        </p>
      </header>

      {/* Galeria de criações salvas (localStorage) */}
      <section>
        <MyCreations />
      </section>
    </div>
  );
}
