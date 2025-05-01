
import { 
  Music, 
  Award, 
  Clock, 
  FileMusic, 
  Sliders, 
  Edit, 
  MusicIcon, 
  Headphones 
} from 'lucide-react';

export interface ExtraService {
  id: string;
  title: string;
  price: number | string;
  description: string;
  features: string[];
  icon: any; // Using any for Lucide icons
  buttonText?: string;
}

export const extraServicesData: ExtraService[] = [
  {
    id: "Revisão Extra",
    title: "Revisão Extra",
    price: 79,
    description: "Peça uma revisão adicional para ajustar a letra ou melodia da sua música.",
    features: [
      "• Prazo: Até 3 dias úteis após a solicitação",
      "• Disponível para todos os pacotes"
    ],
    icon: Music
  },
  {
    id: "Registro na BN (Letra)",
    title: "Registro na BN (Letra)",
    price: 99,
    description: "Proteja legalmente a letra da sua música com registro na Biblioteca Nacional.",
    features: [
      "• Não protege melodia, arranjos ou gravações",
      "• Não gera royalties",
      "• Ideal para proteção sem intenção comercial imediata",
      "• Prazo: Até 30 dias úteis"
    ],
    icon: Award
  },
  {
    id: "Registro UBC",
    title: "Registro UBC",
    price: 249,
    description: "Registro completo na UBC (letra, melodia, arranjo) com código ISWC para direitos de execução pública.",
    features: [
      "• Proteção integral (letra + melodia + arranjo)",
      "• Direitos autorais em execuções públicas",
      "• Essencial para receber royalties",
      "• Ideal para uso comercial da música",
      "• Disponível para todos os pacotes"
    ],
    icon: Award
  },
  {
    id: "Masterização Premium",
    title: "Masterização Premium",
    price: 149,
    description: "Melhore a qualidade sonora com masterização avançada em formato WAV 24-bit.",
    features: [
      "• Ideal para apresentações públicas ou uso comercial",
      "• Adicionado ao prazo original do pacote"
    ],
    icon: Sliders
  },
  {
    id: "Stems Separados",
    title: "Stems Separados",
    price: 129,
    description: "Receba faixas separadas (vocais, instrumentos, etc.) para maior flexibilidade em edições futuras.",
    features: [
      "• Disponível apenas para pacotes Essencial e Profissional",
      "• Adicionado ao prazo original do pacote"
    ],
    icon: FileMusic
  },
  {
    id: "Entrega Expressa",
    title: "Entrega Expressa (48h)",
    price: 149,
    description: "Priorize seu projeto e receba sua música finalizada em até 48 horas.",
    features: [
      "• Sujeito à disponibilidade da equipe",
      "• Depende da complexidade do briefing"
    ],
    icon: Clock
  },
  {
    id: "Partituras MusicXML/PDF",
    title: "Partituras MusicXML/PDF",
    price: 149,
    description: "Receba a partitura completa da sua música em formato MusicXML ou PDF, ideal para músicos e bandas.",
    features: [
      "• Prazo: Até 7 dias úteis após a entrega do áudio",
      "• Compatível com todos os softwares de notação musical"
    ],
    icon: FileMusic
  },
  {
    id: "Composição sem IA (letra)",
    title: "Composição sem IA (letra)",
    price: 499,
    description: "Composição 100% humana da letra da sua música, criada por um de nossos letristas profissionais.",
    features: [
      "• Processo 100% criativo humano",
      "• Inclui 2 revisões gratuitas",
      "• Prazo: Até 10 dias úteis"
    ],
    icon: Edit
  },
  {
    id: "Composição sem IA (letra + melodia)",
    title: "Composição sem IA (letra + melodia)",
    price: 1499,
    description: "Composição 100% humana da letra e melodia da sua música, incluindo partitura completa (sem gravação).",
    features: [
      "• Processo 100% criativo humano",
      "• Inclui partitura em formato MusicXML/PDF",
      "• 3 revisões gratuitas",
      "• Prazo: Até 15 dias úteis"
    ],
    icon: MusicIcon
  },
  {
    id: "Composição sem IA (letra + melodia + gravação)",
    title: "Composição sem IA (completa)",
    price: "Consultar valor",
    description: "Composição 100% humana com letra, melodia e gravação profissional da sua música.",
    features: [
      "• Processo 100% criativo e produção humana",
      "• Inclui compositores e músicos profissionais",
      "• Gravação em estúdio profissional",
      "• Masterização de áudio incluída",
      "• Prazo: A combinar conforme complexidade"
    ],
    icon: Headphones
  }
];
