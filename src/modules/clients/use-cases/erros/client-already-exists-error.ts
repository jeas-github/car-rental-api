export class ClientAlreadyExistsError extends Error {
  constructor() {
    super("Um cliente com este e-mail já existe.");
  }
}
