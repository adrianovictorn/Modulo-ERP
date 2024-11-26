package edu.ifbasaj.pweb.service;

import edu.ifbasaj.pweb.dto.EnderecoDto;
import edu.ifbasaj.pweb.models.Endereco;
import edu.ifbasaj.pweb.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private ViaCepService viaCepService;

    public List<Endereco> listarTodosEnderecos() {
        return enderecoRepository.findAll();
    }

    public Optional<Endereco> buscarEnderecoPorId(Long id) {
        return enderecoRepository.findById(id);
    }

    public Endereco salvarEndereco(Endereco endereco) {
        return enderecoRepository.save(endereco);
    }

    public void deletarEndereco(Long id) {
        enderecoRepository.deleteById(id);
    }

    public Endereco atualizarEndereco(Long id, Endereco enderecoAtualizado) {
        return enderecoRepository.findById(id).map(endereco -> {
            endereco.setLogradouro(enderecoAtualizado.getLogradouro());
            endereco.setNumero(enderecoAtualizado.getNumero());
            endereco.setComplemento(enderecoAtualizado.getComplemento());
            endereco.setBairro(enderecoAtualizado.getBairro());
            endereco.setCidade(enderecoAtualizado.getCidade());
            endereco.setEstado(enderecoAtualizado.getEstado());
            endereco.setCep(enderecoAtualizado.getCep());
            endereco.setPais(enderecoAtualizado.getPais());
            endereco.setTipoEndereco(enderecoAtualizado.getTipoEndereco());
            return enderecoRepository.save(endereco);
        }).orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
    }

    public Endereco buscarEnderecoPorCep(String cep) {
        EnderecoDto enderecoDto = viaCepService.buscarEnderecoPorCep(cep);
        
        // Verifica se o retorno da API é nulo ou se numero e logradouro estão vazios
        if (enderecoDto == null || 
            (enderecoDto.getNumero() == null || enderecoDto.getNumero().isEmpty()) && 
            (enderecoDto.getLogradouro() == null || enderecoDto.getLogradouro().isEmpty())) {
            return null; // Retorna null se numero e logradouro estiverem vazios
        }
    
        Endereco endereco = new Endereco();
        endereco.setCep(enderecoDto.getCep());
        endereco.setLogradouro(enderecoDto.getLogradouro());
        endereco.setComplemento(enderecoDto.getComplemento());
        endereco.setBairro(enderecoDto.getBairro());
        endereco.setCidade(enderecoDto.getLocalidade());
        endereco.setEstado(enderecoDto.getUf());
    
        return enderecoRepository.save(endereco);
    }
    
}
