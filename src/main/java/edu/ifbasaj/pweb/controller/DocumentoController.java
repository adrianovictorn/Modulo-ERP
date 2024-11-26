package edu.ifbasaj.pweb.controller;

import edu.ifbasaj.pweb.models.Documento;
import edu.ifbasaj.pweb.service.DocumentoService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    @Autowired
    private DocumentoService documentoService;

    @GetMapping
    public ResponseEntity<List<Documento>> listarDocumentos() {
        List<Documento> documentos = documentoService.listarTodosDocumentos();
        return ResponseEntity.ok(documentos);
    }

    @PostMapping
    public ResponseEntity<Documento> salvarDocumento(@RequestBody Documento documento) {
        Documento documentoSalvo = documentoService.salvarDocumento(documento);
        return ResponseEntity.status(HttpStatus.CREATED).body(documentoSalvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Documento> atualizarDocumento(@PathVariable Long id, @Valid @RequestBody Documento documentoAtualizado) {
    Optional<Documento> documentoExistente = documentoService.buscarDocumentoPorId(id);
    if (documentoExistente.isPresent()) {
        Documento documentoAtualizadoResult = documentoService.atualizarDocumento(id, documentoAtualizado);
        return ResponseEntity.ok(documentoAtualizadoResult);
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarContato(@PathVariable Long id) {
        documentoService.deletarDocumento(id);
        return ResponseEntity.noContent().build();
    }
}
