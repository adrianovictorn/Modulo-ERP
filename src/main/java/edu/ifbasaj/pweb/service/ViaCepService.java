package edu.ifbasaj.pweb.service;

import edu.ifbasaj.pweb.dto.EnderecoDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ViaCepService {

    private final WebClient webClient;

    public ViaCepService(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://viacep.com.br/ws/").build();
    }

    public EnderecoDto buscarEnderecoPorCep(String cep) {
        // Remove caracteres indesejados do CEP (como espaços ou caracteres especiais)
        String cepFormatado = cep.replaceAll("[^0-9]", "");
        
        return this.webClient
                .get()
                .uri("/{cep}/json/", cepFormatado)
                .retrieve()
                .bodyToMono(EnderecoDto.class)
                .block();
    }
    
}
