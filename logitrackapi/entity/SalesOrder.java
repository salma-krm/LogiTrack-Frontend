package com.smartusers.logitrackapi.entity;

import com.smartusers.logitrackapi.enums.SalesOrderStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SalesOrderStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "reserved_at")
    private LocalDateTime reservedAt;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "notes", length = 500)
    private String notes;

    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SalesOrderLine> orderLines = new ArrayList<>();

    @OneToOne(mappedBy = "salesOrder", cascade = CascadeType.ALL)
    private Shipment shipment;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = SalesOrderStatus.CREATED;
        }
        if (orderNumber == null) {
            orderNumber = generateOrderNumber();
        }
    }

    // Helper method to generate order number
    private String generateOrderNumber() {
        return "SO-" + System.currentTimeMillis();
    }

    // Helper method to add order line
    public void addOrderLine(SalesOrderLine line) {
        orderLines.add(line);
        line.setSalesOrder(this);
        calculateTotalAmount();
    }

    // Helper method to remove order line
    public void removeOrderLine(SalesOrderLine line) {
        orderLines.remove(line);
        line.setSalesOrder(null);
        calculateTotalAmount();
    }


    public void calculateTotalAmount() {
        this.totalAmount = orderLines.stream()
                .map(SalesOrderLine::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Business method to check if order can be reserved
    public boolean canBeReserved() {
        return status == SalesOrderStatus.CREATED;
    }

    // Business method to check if order can be shipped
    public boolean canBeShipped() {
        return status == SalesOrderStatus.RESERVED;
    }

    // Business method to check if order can be canceled
    public boolean canBeCanceled() {
        return status == SalesOrderStatus.CREATED || status == SalesOrderStatus.RESERVED;
    }
}