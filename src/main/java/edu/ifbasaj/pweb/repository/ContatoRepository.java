package edu.ifbasaj.pweb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.ifbasaj.pweb.models.Contato;


@Repository
public interface ContatoRepository extends JpaRepository <Contato, Long>{
    
}
