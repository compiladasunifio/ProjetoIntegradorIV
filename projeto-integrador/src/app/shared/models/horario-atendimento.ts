export interface HorarioAtendimento {
  id: number;
  vendedorId: number;
  dia: string; // "Segunda", "Terça", ...
  inicio: string; // "10:00"
  fim: string; // "12:00"
  local: string; // "Bloco 2"
}

export const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
