package com.smartusers.logitrackapi.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sales_order_lines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesOrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "quantity_reserved")
    private Integer quantityReserved;

    @Column(name = "quantity_shipped")
    private Integer quantityShipped;

    @PrePersist
    @PreUpdate
    protected void calculateSubtotal() {
        if (quantity != null && unitPrice != null) {
            this.subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
        if (quantityReserved == null) {
            quantityReserved = 0;
        }
        if (quantityShipped == null) {
            quantityShipped = 0;
        }
    }

    // Business method to check if line is fully reserved
    public boolean isFullyReserved() {
        return quantityReserved != null && quantityReserved.equals(quantity);
    }

    // Business method to check if line is fully shipped
    public boolean isFullyShipped() {
        return quantityShipped != null && quantityShipped.equals(quantity);
    }

    // Business method to get pending quantity
    public Integer getPendingQuantity() {
        return quantity - (quantityReserved != null ? quantityReserved : 0);
    }
}