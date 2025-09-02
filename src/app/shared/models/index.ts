export interface Endereco {
  cep: string | null;
  uf: string | null;
  cidade: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento?: string | null;
  bairro: string | null;
}
export interface Fornecedor {
  id: number;
  tipo: 'PF' | 'PJ';
  cpfCnpj: string;
  nomeRazaoSocial: string;
  endereco?: Endereco;
}
export interface Contato {
  id?: number;
  tipo: 'email' | 'telefone';
  valor: string;
}
export interface PessoaContrato {
  id: number;
  nomeCompleto: string;
  papelResponsabilidade: {
    id: number;
    nome: 'Preposto' | 'Fiscal' | 'Representante';
    flagFiscal: 'S' | 'N';
  };
  contatos?: Contato[];
}
export interface AcordoMinimo {
  id: number;
  nome: string;
  descricao: string;
}
export interface ContratoCreate {
  identificacao: {
    numero: string;
    ano: number;
    dataAssinatura: string;
    objeto: string;
    fornecedorId: number;
    endereco?: Endereco;
  };
  partes?: {
    fiscais?: number[];
    prepostoId?: number;
    representantes?: number[];
  };
  obrigacoes?: string[];
  valores: {
    valorGlobal: number;
    permiteReajuste: boolean;
    reajuste: {
      indiceId: number | string;
      periodoMes: number;
      dataInicioContagem: string;
      percentual: number;
    };
  };
  fiscalizacao?: {
    acordos?: AcordoMinimo[];
    glosas?: { descricaoGlosa: string; acordoId: number }[];
  };
  status?: 'rascunho' | 'enviado' | 'aprovado' | 'reprovado';
}
