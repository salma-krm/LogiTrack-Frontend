package com.smartusers.logitrackapi.service.impl;


import com.smartusers.logitrackapi.entity.*;
import com.smartusers.logitrackapi.enums.MovementType;
import com.smartusers.logitrackapi.repository.*;
import com.smartusers.logitrackapi.service.interfaces.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final inventoryMovementRepository  inventoryMovementRepository ;


    @Override
    public Inventory create(Inventory inventory) {
        Product product = productRepository.findById(inventory.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        Warehouse warehouse = warehouseRepository.findById(inventory.getWarehouse().getId())
                .orElseThrow(() -> new RuntimeException("Entrepôt non trouvé"));

        inventory.setProduct(product);
        inventory.setWarehouse(warehouse);


        if (inventory.getQuantityOnHand() == null) {
            inventory.setQuantityOnHand(0);
        }

        inventory.setQuantityReserved(0);


        Inventory savedInventory = inventoryRepository.save(inventory);


        if (savedInventory.getQuantityOnHand() > 0) {
            InventoryMovement movement = InventoryMovement.builder()
                    .inventory(savedInventory)
                    .type(MovementType.INBOUND)
                    .quantity(savedInventory.getQuantityOnHand())
                    .movementDate(LocalDateTime.now())
                    .description("Initialisation du stock avec " + savedInventory.getQuantityOnHand() + " unités")
                    .build();

            inventoryMovementRepository.save(movement);


        }


    }
    @Override
    public Inventory update(Long id, Inventory inventory) {
        Inventory existing = getById(id);

        existing.setQuantityOnHand(inventory.getQuantityOnHand());
        existing.setQuantityReserved(inventory.getQuantityReserved());




        return inventoryRepository.save(existing);
    }

    @Override
    public List<Inventory> getAll() {
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory getById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventaire non trouvé avec ID " + id));
    }

    @Override
    public void delete(Long id) {
        inventoryRepository.deleteById(id);
    }
}

