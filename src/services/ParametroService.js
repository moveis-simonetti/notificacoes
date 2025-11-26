import ParametroRepository from '../repositories/ParametroRepository.js';

class ParametroService {
  constructor(parametroRepository = null) {
    this.parametroRepository = parametroRepository || new ParametroRepository();
  }

  async buscarPorContextoEChave(contexto, chave) {
    const parametro = await this.parametroRepository.findByContextoAndChave(contexto, chave);
    return parametro;
  }
}

export default ParametroService;
