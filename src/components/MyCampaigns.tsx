import React, { useState, useEffect } from "react";

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filterClient, setFilterClient] = useState("");

  useEffect(() => {
    const savedCampaigns = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('campaign_')) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            savedCampaigns.push(JSON.parse(data));
          } catch (e) {
            console.error("Erro ao parsear campanha:", key, e);
          }
        }
      }
    }
    setCampaigns(savedCampaigns);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.client?.toLowerCase().includes(filterClient.toLowerCase()) ||
    campaign.projectName?.toLowerCase().includes(filterClient.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <input 
        type="text"
        className="w-full p-3 rounded-xl border border-purple-500/30 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
        value={filterClient}
        onChange={(e) => setFilterClient(e.target.value)}
        placeholder="Filtrar por nome do cliente ou campanha..."
      />

      {filteredCampaigns.length === 0 ? (
        <div className="text-center text-slate-400 py-12 bg-slate-800/30 rounded-xl">
          {filterClient ? "Nenhuma campanha encontrada com esse filtro" : "Você ainda não salvou nenhuma campanha"}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCampaigns.map((campaign, index) => (
            <div 
              key={index} 
              className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {campaign.projectName}
                  </h4>
                  <p className="text-sm text-purple-400">
                    Cliente: {campaign.client}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  Salva em: {new Date(campaign.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {campaign.images.map((img: any, i: number) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-900">
                    <img
                      src={img.dataURL}
                      alt={`Imagem ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}