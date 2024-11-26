package edu.ifbasaj.pweb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ifbasaj.pweb.models.Cliente;
import edu.ifbasaj.pweb.models.Contato;
import edu.ifbasaj.pweb.models.Documento;
import edu.ifbasaj.pweb.models.Endereco;
import edu.ifbasaj.pweb.repository.ClienteRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> listarTodosClientes() {
        return clienteRepository.findAll();
    }

   
    public Optional<Cliente> buscarClientePorId(Long id) {
        return clienteRepository.findById(id);
    }


    public boolean cpfCnpjExiste(String cpfCnpj) {
        return clienteRepository.findByCpfCnpj(cpfCnpj).isPresent();
    }


    public Cliente salvarCliente(Cliente cliente) {
    
        if (cliente.getEnderecos() != null) {
            for (Endereco endereco : cliente.getEnderecos()) {
                endereco.setCliente(cliente); 
            }
        }

        if (cliente.getEnderecoPrincipal() != null) {
            cliente.getEnderecoPrincipal().setCliente(cliente); 
        }
    
        if (cliente.getDocumentos() != null) {
            for (Documento documento : cliente.getDocumentos()) {
                documento.setCliente(cliente);
            }
        }
    
        if (cliente.getContatos() != null) {
            for (Contato contato : cliente.getContatos()) {
                contato.setCliente(cliente); 
            }
        }
    
        return clienteRepository.save(cliente);
    
        
    }
        


    public Cliente atualizarCliente(Long id, Cliente clienteAtualizado) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(id);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            cliente.setNome(clienteAtualizado.getNome());
            cliente.setCpfCnpj(clienteAtualizado.getCpfCnpj());
            cliente.setEmail(clienteAtualizado.getEmail());
            cliente.setStatus(clienteAtualizado.getStatus());
            cliente.setEnderecoPrincipal(clienteAtualizado.getEnderecoPrincipal());
            
            if (clienteAtualizado.getEnderecos() != null) {
                cliente.setEnderecos(clienteAtualizado.getEnderecos());
                for (Endereco endereco : cliente.getEnderecos()) {
                    endereco.setCliente(cliente);
                }
            }
            
            if (clienteAtualizado.getDocumentos() != null) {
                cliente.setDocumentos(clienteAtualizado.getDocumentos());
                for (Documento documento : cliente.getDocumentos()) {
                    documento.setCliente(cliente);
                }
            }
            
            if (clienteAtualizado.getContatos() != null) {
                cliente.setContatos(clienteAtualizado.getContatos());
                for (Contato contato : cliente.getContatos()) {
                    contato.setCliente(cliente);
                }
            }
            
            
            return clienteRepository.save(cliente);
        } else {
            throw new RuntimeException("Cliente não encontrado!");
        }
    }


    public void deletarCliente(Long id) {
        clienteRepository.deleteById(id);
    }

    
}