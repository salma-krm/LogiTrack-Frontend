package com.smartusers.logitrackapi.repository;

import com.smartusers.logitrackapi.entity.SalesOrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesOrderLineRepository extends JpaRepository<SalesOrderLine, Long> {

    List<SalesOrderLine> findBySalesOrderId(Long salesOrderId);

    List<SalesOrderLine> findByProductId(Long productId);

    @Query("SELECT sol FROM SalesOrderLine sol WHERE sol.salesOrder.id = :salesOrderId AND sol.product.id = :productId")
    List<SalesOrderLine> findBySalesOrderIdAndProductId(@Param("salesOrderId") Long salesOrderId,
                                                        @Param("productId") Long productId);

    @Query("SELECT sol FROM SalesOrderLine sol WHERE sol.quantityReserved < sol.quantity")
    List<SalesOrderLine> findPartiallyReservedLines();

    @Query("SELECT sol FROM SalesOrderLine sol WHERE sol.quantityShipped < sol.quantity")
    List<SalesOrderLine> findPartiallyShippedLines();

    @Query("SELECT SUM(sol.quantity) FROM SalesOrderLine sol WHERE sol.product.id = :productId AND sol.salesOrder.status = 'RESERVED'")
    Integer getTotalReservedQuantityByProduct(@Param("productId") Long productId);
}