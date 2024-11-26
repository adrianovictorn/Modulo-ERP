package edu.ifbasaj.pweb.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.ifbasaj.pweb.models.Cliente;
import edu.ifbasaj.pweb.service.ClienteService;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public ResponseEntity<List<Cliente>> listarTodosClientes() {
        List<Cliente> clientes = clienteService.listarTodosClientes();
        return ResponseEntity.ok(clientes);
    }
    
    @GetMapping("/api")
    public ResponseEntity<List<Cliente>> listarTodosClientesApi() {
        List<Cliente> clientes = clienteService.listarTodosClientes();
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarClientePorId(@PathVariable Long id) {
        Cliente cliente = clienteService.buscarClientePorId(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return ResponseEntity.ok(cliente);
    }

    @GetMapping("/api/{id}")
    public ResponseEntity<Cliente> buscarClienteApiPorId(@PathVariable Long id) {
        Cliente cliente = clienteService.buscarClientePorId(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        return ResponseEntity.ok(cliente);
    }

    @PostMapping
    public ResponseEntity<?> cadastrarCliente(@RequestBody Cliente cliente) {
    if (clienteService.cpfCnpjExiste(cliente.getCpfCnpj())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("CPF/CNPJ já cadastrado.");
    }
    
    Cliente clienteSalvo = clienteService.salvarCliente(cliente);
    return ResponseEntity.status(HttpStatus.CREATED).body(clienteSalvo);
}


    @PutMapping("/{id}")
    public ResponseEntity<Void> atualizarCliente(@PathVariable Long id, @RequestBody Cliente clienteAtualizado) {
        clienteService.atualizarCliente(id, clienteAtualizado);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Long id) {
        clienteService.deletarCliente(id);
        return ResponseEntity.noContent().build();
    }
}
