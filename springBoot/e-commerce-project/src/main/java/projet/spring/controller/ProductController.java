package projet.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import projet.spring.entities.Product;
import projet.spring.service.ProductService;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "image3D", required = false) MultipartFile image3D) {

        try {
            Product product = new Product();
            product.setName(name);
            product.setCategory(category);
            product.setDescription(description);

            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                String filePath = uploadDir + fileName;
                image.transferTo(new File(filePath));
                product.setImagePath("/uploads/" + fileName); // Stocke le chemin relatif
            }

            if (image3D != null && !image3D.isEmpty()) {
                String contentType = image3D.getContentType();
                if (contentType != null && (
                    contentType.equals("model/gltf-binary") ||
                    contentType.equals("model/gltf+json") ||
                    contentType.equals("application/octet-stream"))) {
                    
                    String fileName3D = System.currentTimeMillis() + "_3D_" + image3D.getOriginalFilename();
                    File destination = new File(uploadDir + fileName3D);
                    image3D.transferTo(destination);
                    product.setImage3DPath("/uploads/" + fileName3D);
                } else {
                    return ResponseEntity.badRequest()
                        .body("Format de fichier 3D non supporté. Utilisez .glb ou .gltf");
                }
            }
            Product savedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur : " + e.getMessage());
        }
    }
    
    
    
    private String saveFile(MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        String filePath = uploadDir + file.getOriginalFilename();
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        file.transferTo(new File(filePath));
        return filePath;
    }


    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Optional<Product> existingProduct = productService.getProductById(id);
        if (existingProduct.isPresent()) {
            product.setId(id);
            return ResponseEntity.ok(productService.saveProduct(product));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productService.getProductById(id).isPresent()) {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/";
            String filePath = uploadDir + file.getOriginalFilename();
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            file.transferTo(new File(filePath));
            return ResponseEntity.ok(filePath);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed!");
        }
    }

}
