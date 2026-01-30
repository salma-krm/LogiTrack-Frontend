package com.smartusers.logitrackapi.repository;

import com.smartusers.logitrackapi.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    @Query("SELECT i FROM Inventory i WHERE i.product.id = :productId AND i.warehouse.id = :warehouseId")
    Optional<Inventory> findByProductIdAndWarehouseId(@Param("productId") Long productId,
                                                       @Param("warehouseId") Long warehouseId);

    List<Inventory> findByWarehouseId(Long warehouseId);

    List<Inventory> findByProductId(Long productId);

    @Query("SELECT i FROM Inventory i WHERE i.quantityOnHand - i.quantityReserved <= :threshold")
    List<Inventory> findLowStock(@Param("threshold") int threshold);

    @Query("SELECT i FROM Inventory i WHERE i.quantityOnHand - i.quantityReserved <= 0")
    List<Inventory> findOutOfStock();
}
