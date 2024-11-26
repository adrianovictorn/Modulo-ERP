package edu.ifbasaj.pweb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.ifbasaj.pweb.models.Endereco;
import edu.ifbasaj.pweb.service.EnderecoService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {
    

    @Autowired
    private EnderecoService enderecoService;

    
    @GetMapping
    public List<Endereco> listarTodosEnderecos() {
        return enderecoService.listarTodosEnderecos();
    }

 
    @GetMapping("/{id}")
    public ResponseEntity<Endereco> buscarEnderecoPorId(@PathVariable Long id) {
        Optional<Endereco> endereco = enderecoService.buscarEnderecoPorId(id);
        return endereco.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public Endereco salvarEndereco(@RequestBody Endereco endereco) {
        return enderecoService.salvarEndereco(endereco);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Endereco> atualizarEndereco(@PathVariable Long id, @RequestBody Endereco enderecoAtualizado) {
        try {
            Endereco endereco = enderecoService.atualizarEndereco(id, enderecoAtualizado);
            return ResponseEntity.ok(endereco);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEndereco(@PathVariable Long id) {
        enderecoService.deletarEndereco(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/salvar-por-cep/{cep}")
    public ResponseEntity<Endereco> salvarEnderecoPorCep(@PathVariable String cep) {
    try {
        Endereco endereco = enderecoService.buscarEnderecoPorCep(cep);
        return ResponseEntity.ok(endereco);  
    } catch (Exception e) {
        e.printStackTrace();  // Para debugar
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}

    
}
