package edu.ifbasaj.pweb.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.ifbasaj.pweb.models.Contato;
import edu.ifbasaj.pweb.service.ContatoService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/contatos")
public class ContatoController {

    @Autowired
    private ContatoService contatoService;

    @GetMapping
    public List<Contato> listarTodosContatos() {
        return contatoService.listarTodosContatos();
    }

    @GetMapping("/public")
    public List<Contato> listarTodosContatosApi() {
        return contatoService.listarTodosContatos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contato> buscarContatoPorId(@PathVariable Long id) {
        Optional<Contato> contato = contatoService.buscarContatoPorId(id);
        return contato.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Contato salvarContato(@RequestBody Contato contato) {
        return contatoService.salvarContato(contato);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contato> atualizarContato(@PathVariable Long id, @RequestBody Contato contatoAtualizado) {
        try {
            Contato contato = contatoService.atualizarContato(id, contatoAtualizado);
            return ResponseEntity.ok(contato);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarContato(@PathVariable Long id) {
        contatoService.deletarContato(id);
        return ResponseEntity.noContent().build();
    }
}
