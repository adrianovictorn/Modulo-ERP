package edu.ifbasaj.pweb.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.ifbasaj.pweb.models.Endereco;


public interface EnderecoRepository extends JpaRepository<Endereco,Long> {
    
}
