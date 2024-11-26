package edu.ifbasaj.pweb.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import edu.ifbasaj.pweb.models.HistoricoCompra;

import java.util.Arrays;
import java.util.List;

@Service
public class HistoricoCompraService {

    private final RestTemplate restTemplate;

    public HistoricoCompraService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<HistoricoCompra> obterHistoricoDeCompra(Long clienteId) {
        String url = "http://localhost:8080/api/historico-compras/cliente/" + clienteId;
        HistoricoCompra[] historicoArray = restTemplate.getForObject(url, HistoricoCompra[].class);
        return Arrays.asList(historicoArray);
    }
}
