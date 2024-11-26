package edu.ifbasaj.pweb.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.ifbasaj.pweb.models.Documento;
import edu.ifbasaj.pweb.repository.DocumentoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentoService {

    @Autowired
    private DocumentoRepository documentoRepository;

    public List<Documento> listarTodosDocumentos() {
        return documentoRepository.findAll();
    }

    public Optional<Documento> buscarDocumentoPorId(Long id) {
        return documentoRepository.findById(id);
    }

    public Documento salvarDocumento(Documento documento) {
        return documentoRepository.save(documento);
    }

    public void deletarDocumento(Long id) {
        documentoRepository.deleteById(id);
    }

    public Documento atualizarDocumento(Long id, Documento documentoAtualizado) {
        return documentoRepository.findById(id).map(documento -> {
            documento.setNumero(documentoAtualizado.getNumero());
            documento.setDataEmissao(documentoAtualizado.getDataEmissao());
            documento.setOrgaoEmissor(documentoAtualizado.getOrgaoEmissor());
            documento.setTipoDocumento(documentoAtualizado.getTipoDocumento());
            return documentoRepository.save(documento);
        }).orElseThrow(() -> new RuntimeException("Documento não encontrado"));
    }
}