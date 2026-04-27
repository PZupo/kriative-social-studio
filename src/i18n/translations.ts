export type LanguageCode = 'pt-BR' | 'en-US' | 'es' | 'fr' | 'de' | 'ko' | 'pt-PT';

export const translations = {
  'pt-BR': {
    appName: 'Kriative Social Studio', appDesc: 'Gestão de Mídia & IA',
    statusOp: 'STATUS OPERACIONAL', active: 'SISTEMA ATIVO', inactive: 'INATIVO',
    credits: 'CRÉDITOS DISPONÍVEIS', unit: 'unid.',
    plan: 'PLANO VIGENTE', free: 'GRATUITO', upgrade: 'FAZER UPGRADE',
    quickAccess: 'ACESSO RÁPIDO', backDashboard: 'VOLTAR AO DASHBOARD HUB',

    // CHAVES DO SEU EDITOR (AS QUE ESTÃO QUEBRADAS NA TELA)
    step_idea: 'Ideia', step_text: 'Texto', step_visual: 'Visual',
    TOPIC_LABEL: 'TÓPICO PRINCIPAL', topic_placeholder: 'Ex: Dicas de Marketing...',
    AUDIENCE_LABEL: 'PÚBLICO ALVO', audience_placeholder: 'Ex: Empreendedores...',
    GOAL_LABEL: 'OBJETIVO', goal_placeholder: 'Ex: Vender curso...',
    DESC_LABEL: 'DESCRIÇÃO ADICIONAL', desc_placeholder: 'Detalhes extras...',
    
    btn_next_text: 'PRÓXIMO: TEXTO', btn_back: 'VOLTAR', btn_next_visual: 'PRÓXIMO: VISUAL',
    btn_gen_title: 'Gerar Título', btn_gen_copy: 'Gerar Legenda', btn_gen_legend: 'Ideias', btn_gen_hashtags: 'Hashtags',
    btn_back_text: 'Voltar', btn_export_pdf: 'Exportar PDF', btn_generate: 'GERAR IMAGEM',
    btn_regenerate: 'Regenerar', btn_save: 'Salvar', save_success: 'Salvo com sucesso!',
    
    title_label: 'Título', title_placeholder: 'Título gerado...',
    copy_label: 'Legenda', copy_placeholder: 'Legenda gerada...',
    caption_label: 'Ideia Visual', caption_placeholder: 'Sugestão visual...',
    hashtags_label: 'Hashtags',
    
    styles: 'Estilos', formats: 'Formatos', selectors: 'Seletores', top_band: 'Faixa Superior', vary_all: 'Variar Tudo',
    texts_creation: 'Criação Visual', select_img_msg: 'Selecione uma imagem.', editing_img: 'Editando'
  },
  'en-US': {
    appName: 'Kriative Social Studio', appDesc: 'Media Management & AI',
    statusOp: 'OPERATIONAL STATUS', active: 'SYSTEM ACTIVE', inactive: 'INACTIVE',
    credits: 'AVAILABLE CREDITS', unit: 'units',
    plan: 'CURRENT PLAN', free: 'FREE', upgrade: 'UPGRADE NOW',
    quickAccess: 'QUICK ACCESS', backDashboard: 'BACK TO DASHBOARD HUB',

    step_idea: 'Idea', step_text: 'Text', step_visual: 'Visual',
    TOPIC_LABEL: 'MAIN TOPIC', topic_placeholder: 'E.g. Marketing Tips...',
    AUDIENCE_LABEL: 'TARGET AUDIENCE', audience_placeholder: 'E.g. Entrepreneurs...',
    GOAL_LABEL: 'GOAL', goal_placeholder: 'E.g. Sell course...',
    DESC_LABEL: 'ADDITIONAL DESC', desc_placeholder: 'Details...',
    
    btn_next_text: 'NEXT: TEXT', btn_back: 'BACK', btn_next_visual: 'NEXT: VISUAL',
    btn_gen_title: 'Gen Title', btn_gen_copy: 'Gen Caption', btn_gen_legend: 'Gen Ideas', btn_gen_hashtags: 'Gen Hashtags',
    btn_back_text: 'Back', btn_export_pdf: 'Export PDF', btn_generate: 'GENERATE',
    btn_regenerate: 'Regenerate', btn_save: 'Save', save_success: 'Saved!',
    
    title_label: 'Title', title_placeholder: 'Generated title...',
    copy_label: 'Caption', copy_placeholder: 'Generated caption...',
    caption_label: 'Visual Idea', caption_placeholder: 'Visual suggestion...',
    hashtags_label: 'Hashtags',
    
    styles: 'Styles', formats: 'Formats', selectors: 'Selectors', top_band: 'Top Band', vary_all: 'Vary All',
    texts_creation: 'Visual Creation', select_img_msg: 'Select an image.', editing_img: 'Editing'
  },
  'es': {
    appName: 'Kriative Social Studio', appDesc: 'Gestión', statusOp: 'ESTADO', active: 'ACTIVO', inactive: 'INACTIVO', credits: 'CRÉDITOS', unit: 'u.', plan: 'PLAN', free: 'GRATUITO', upgrade: 'MEJORAR', quickAccess: 'ACCESO', backDashboard: 'VOLVER',
    step_idea: 'Idea', step_text: 'Texto', step_visual: 'Visual', TOPIC_LABEL: 'TEMA', topic_placeholder: '...', AUDIENCE_LABEL: 'AUDIENCIA', audience_placeholder: '...', GOAL_LABEL: 'META', goal_placeholder: '...', DESC_LABEL: 'DESC', desc_placeholder: '...',
    btn_next_text: 'SIGUIENTE', btn_back: 'VOLVER', btn_next_visual: 'SIGUIENTE', btn_back_text: 'Volver', btn_export_pdf: 'Exportar PDF', btn_generate: 'GENERAR', btn_regenerate: 'Regenerar', btn_save: 'Guardar', save_success: '¡Guardado!',
    title_label: 'Título', copy_label: 'Copy', caption_label: 'Visual', hashtags_label: 'Hashtags',
    styles: 'Estilos', formats: 'Formatos', selectors: 'Selectores', top_band: 'Banda', vary_all: 'Variar', texts_creation: 'Creación', select_img_msg: 'Selecciona.', editing_img: 'Editando'
  },
  'fr': {
    appName: 'Kriative Social Studio', appDesc: 'Gestion', statusOp: 'STATUT', active: 'ACTIF', inactive: 'INACTIF', credits: 'CRÉDITS', unit: 'u.', plan: 'PLAN', free: 'GRATUIT', upgrade: 'NIVEAU', quickAccess: 'ACCÈS', backDashboard: 'RETOUR',
    step_idea: 'Idée', step_text: 'Texte', step_visual: 'Visuel', TOPIC_LABEL: 'SUJET', topic_placeholder: '...', AUDIENCE_LABEL: 'PUBLIC', audience_placeholder: '...', GOAL_LABEL: 'OBJECTIF', goal_placeholder: '...', DESC_LABEL: 'DESC', desc_placeholder: '...',
    btn_next_text: 'SUIVANT', btn_back: 'RETOUR', btn_next_visual: 'SUIVANT', btn_back_text: 'Retour', btn_export_pdf: 'Exporter', btn_generate: 'GÉNÉRER', btn_regenerate: 'Régénérer', btn_save: 'Sauver', save_success: 'Sauvegardé!',
    title_label: 'Titre', copy_label: 'Légende', caption_label: 'Visuel', hashtags_label: 'Hashtags',
    styles: 'Styles', formats: 'Formats', selectors: 'Sélecteurs', top_band: 'Bande', vary_all: 'Varier', texts_creation: 'Création', select_img_msg: 'Sélectionnez.', editing_img: 'Édition'
  },
  'de': {
    appName: 'Kriative Social Studio', appDesc: 'Medien', statusOp: 'STATUS', active: 'AKTIV', inactive: 'INAKTIV', credits: 'KREDITE', unit: 'u.', plan: 'PLAN', free: 'KOSTENLOS', upgrade: 'UPGRADE', quickAccess: 'ZUGRIFF', backDashboard: 'ZURÜCK',
    step_idea: 'Idee', step_text: 'Text', step_visual: 'Visuell', TOPIC_LABEL: 'THEMA', topic_placeholder: '...', AUDIENCE_LABEL: 'ZIELGRUPPE', audience_placeholder: '...', GOAL_LABEL: 'ZIEL', goal_placeholder: '...', DESC_LABEL: 'DESC', desc_placeholder: '...',
    btn_next_text: 'WEITER', btn_back: 'ZURÜCK', btn_next_visual: 'WEITER', btn_back_text: 'Zurück', btn_export_pdf: 'Export', btn_generate: 'GENERIEREN', btn_regenerate: 'Regenerieren', btn_save: 'Speichern', save_success: 'Gespeichert!',
    title_label: 'Titel', copy_label: 'Copy', caption_label: 'Visuell', hashtags_label: 'Hashtags',
    styles: 'Stile', formats: 'Formate', selectors: 'Selektoren', top_band: 'Band', vary_all: 'Variieren', texts_creation: 'Erstellung', select_img_msg: 'Wählen.', editing_img: 'Bearbeitung'
  },
  'ko': {
    appName: 'Kriative Social Studio', appDesc: 'AI', statusOp: 'Status', active: 'Active', inactive: 'Inactive', credits: 'Credits', unit: 'u.', plan: 'Plan', free: 'Free', upgrade: 'Upgrade', quickAccess: 'Access', backDashboard: 'Back',
    step_idea: 'Idea', step_text: 'Text', step_visual: 'Visual', TOPIC_LABEL: 'TOPIC', topic_placeholder: '...', AUDIENCE_LABEL: 'AUDIENCE', audience_placeholder: '...', GOAL_LABEL: 'GOAL', goal_placeholder: '...', DESC_LABEL: 'DESC', desc_placeholder: '...',
    btn_next_text: 'NEXT', btn_back: 'BACK', btn_next_visual: 'NEXT', btn_back_text: 'Back', btn_export_pdf: 'Export', btn_generate: 'GENERATE', btn_regenerate: 'Regenerate', btn_save: 'Save', save_success: 'Saved!',
    title_label: 'Title', copy_label: 'Copy', caption_label: 'Visual', hashtags_label: 'Hashtags',
    styles: 'Styles', formats: 'Formats', selectors: 'Selectors', top_band: 'Band', vary_all: 'Vary', texts_creation: 'Creation', select_img_msg: 'Select.', editing_img: 'Editing'
  },
  'pt-PT': {
    appName: 'Kriative Social Studio', appDesc: 'Gestão', statusOp: 'ESTADO', active: 'ATIVO', inactive: 'INATIVO', credits: 'CRÉDITOS', unit: 'u.', plan: 'PLANO', free: 'GRATUITO', upgrade: 'MELHORAR', quickAccess: 'ACESSO', backDashboard: 'VOLTAR',
    step_idea: 'Ideia', step_text: 'Texto', step_visual: 'Visual', TOPIC_LABEL: 'TEMA', topic_placeholder: '...', AUDIENCE_LABEL: 'AUDIENCIA', audience_placeholder: '...', GOAL_LABEL: 'META', goal_placeholder: '...', DESC_LABEL: 'DESC', desc_placeholder: '...',
    btn_next_text: 'SEGUINTE', btn_back: 'VOLTAR', btn_next_visual: 'SEGUINTE', btn_back_text: 'Voltar', btn_export_pdf: 'Exportar', btn_generate: 'GERAR', btn_regenerate: 'Regenerar', btn_save: 'Guardar', save_success: 'Guardado!',
    title_label: 'Título', copy_label: 'Legenda', caption_label: 'Visual', hashtags_label: 'Hashtags',
    styles: 'Estilos', formats: 'Formatos', selectors: 'Seletores', top_band: 'Banda', vary_all: 'Variar', texts_creation: 'Criação', select_img_msg: 'Selecione.', editing_img: 'A editar'
  }
};