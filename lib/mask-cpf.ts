/**
 * Mascara um CPF mostrando apenas os últimos 4 dígitos
 * @param cpf - CPF completo (com ou sem formatação)
 * @returns CPF mascarado no formato ***.***.*XX-XX
 */
export function maskCpf(cpf: string | undefined | null): string {
  if (!cpf) return "Não informado";

  // Remove formatação
  const cleanCpf = cpf.replace(/\D/g, "");

  if (cleanCpf.length !== 11) return "CPF inválido";

  // Retorna apenas os últimos 4 dígitos
  const lastFour = cleanCpf.slice(-4);
  return `***.***.*${lastFour.slice(0, 2)}-${lastFour.slice(2)}`;
}

/**
 * Verifica se o usuário tem CPF cadastrado
 * @param cpf - CPF para verificar
 * @returns true se tem CPF válido
 */
export function hasCpf(cpf: string | undefined | null): boolean {
  if (!cpf) return false;
  const cleanCpf = cpf.replace(/\D/g, "");
  return cleanCpf.length === 11;
}
