import ParametroRepository from '../repositories/ParametroRepository.js';

class ParametroService {
  constructor(parametroRepository = null) {
    this.parametroRepository = parametroRepository || new ParametroRepository();
  }

  async buscarPorContextoEChave(contexto, chave) {
    const parametro = await this.parametroRepository.findByContextoAndChave(contexto, chave);

    return parametro;
  }

  async buscarPorContextoEChaveOuFalhar(contexto, chave) {
    const parametro = await this.buscarPorContextoEChave(contexto, chave);

    if (!parametro || !parametro.valor) {
      throw new Error(`Parametro ${chave} não encontrado para o contexto ${contexto}`);
    }

    return parametro;
  }
}

export default ParametroService;
