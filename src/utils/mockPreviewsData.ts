
export interface ProjectItem {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  status: string;
  createdAt: string;
  versions?: any[];
}

export const mockPreviewProjects: ProjectItem[] = [
  {
    id: "PRJ-AF23",
    clientName: "Roberto Silva",
    clientEmail: "roberto@example.com",
    packageType: "Premium",
    status: "waiting",
    createdAt: "2023-05-15",
    versions: [
      {
        id: "V1",
        title: "Primeira Versão",
        url: "https://example.com/music/v1.mp3",
        createdAt: "2023-05-16",
        feedback: null
      }
    ]
  },
  {
    id: "PRJ-BH67",
    clientName: "Maria Pereira",
    clientEmail: "maria@example.com",
    packageType: "Essencial",
    status: "feedback",
    createdAt: "2023-05-10",
    versions: [
      {
        id: "V1",
        title: "Primeira Versão",
        url: "https://example.com/music/v2.mp3",
        createdAt: "2023-05-12",
        feedback: "Gostei, mas poderia ser um pouco mais rápido o ritmo."
      },
      {
        id: "V2",
        title: "Segunda Versão",
        url: "https://example.com/music/v2-revised.mp3",
        createdAt: "2023-05-14",
        feedback: null
      }
    ]
  },
  {
    id: "PRJ-CL92",
    clientName: "Carlos Santos",
    clientEmail: "carlos@example.com",
    packageType: "Profissional",
    status: "approved",
    createdAt: "2023-04-28",
    versions: [
      {
        id: "V1",
        title: "Primeira Versão",
        url: "https://example.com/music/v3.mp3",
        createdAt: "2023-04-30",
        feedback: "Quase perfeito! Só precisa de alguns ajustes na introdução."
      },
      {
        id: "V2",
        title: "Versão Final",
        url: "https://example.com/music/v3-final.mp3",
        createdAt: "2023-05-02",
        feedback: "Aprovado! Exatamente o que eu queria."
      }
    ]
  }
];
