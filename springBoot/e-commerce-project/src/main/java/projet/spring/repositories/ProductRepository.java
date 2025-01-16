package projet.spring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import projet.spring.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}
