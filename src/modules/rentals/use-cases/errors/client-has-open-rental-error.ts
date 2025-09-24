export class ClientHasOpenRentalError extends Error {
  constructor() {
    super("O cliente já possui um aluguel ativo.");
  }
}
