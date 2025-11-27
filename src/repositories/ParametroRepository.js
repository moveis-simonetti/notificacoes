import { PrismaClient } from '@prisma/client';

class ParametroRepository {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findByContextoAndChave(contexto, chave) {
    return await this.prisma.parametro.findUnique({
      where: {
        contexto_chave: {
          contexto,
          chave
        }
      },
    });
  }
}

export default ParametroRepository;
