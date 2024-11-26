package edu.ifbasaj.pweb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ifbasaj.pweb.models.Contato;
import edu.ifbasaj.pweb.repository.ContatoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ContatoService {

    @Autowired
    private ContatoRepository contatoRepository;

    public List<Contato> listarTodosContatos() {
        return contatoRepository.findAll();
    }

    public Optional<Contato> buscarContatoPorId(Long id) {
        return contatoRepository.findById(id);
    }

    public Contato salvarContato(Contato contato) {
        return contatoRepository.save(contato);
    }

    public void deletarContato(Long id) {
        contatoRepository.deleteById(id);
    }

    public Contato atualizarContato(Long id, Contato contatoAtualizado) {
        return contatoRepository.findById(id).map(contato -> {
            contato.setNome(contatoAtualizado.getNome());
            contato.setEmail(contatoAtualizado.getEmail());
            contato.setTelefone(contatoAtualizado.getTelefone());
            contato.setCargo(contatoAtualizado.getCargo());
            return contatoRepository.save(contato);
        }).orElseThrow(() -> new RuntimeException("Contato não encontrado"));
    }
}