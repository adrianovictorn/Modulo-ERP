package edu.ifbasaj.pweb.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifbasaj.pweb.models.Documento;


public interface DocumentoRepository extends JpaRepository <Documento, Long> {
    
}
