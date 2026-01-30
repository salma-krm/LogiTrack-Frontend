package com.smartusers.logitrackapi.service.impl;

import com.smartusers.logitrackapi.dto.salesorder.*;
import com.smartusers.logitrackapi.entity.*;
import com.smartusers.logitrackapi.enums.SalesOrderStatus;
import com.smartusers.logitrackapi.Exception.*;
import com.smartusers.logitrackapi.repository.*;
import com.smartusers.logitrackapi.service.interfaces.SalesOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SalesOrderServiceImpl implements SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderLineRepository salesOrderLineRepository;
    private final UserRepository userRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    @Override
    public SalesOrder create(SalesOrderRequest request) {
        // Validate client exists
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + request.getClientId()));

        // Validate warehouse exists
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with ID: " + request.getWarehouseId()));

        // Create the sales order
        SalesOrder salesOrder = SalesOrder.builder()
                .client(client)
                .warehouse(warehouse)
                .status(SalesOrderStatus.CREATED)
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .orderLines(new ArrayList<>())
                .build();

        // Process order lines
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (SalesOrderLineRequest lineRequest : request.getOrderLines()) {
            Product product = productRepository.findById(lineRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + lineRequest.getProductId()));

            // Check stock availability
            int availableStock = getAvailableStock(product.getId(), warehouse.getId());
            if (availableStock < lineRequest.getQuantity()) {
                throw new BusinessException("Insufficient stock for product: " + product.getName() +
                        ". Available: " + availableStock + ", Requested: " + lineRequest.getQuantity());
            }

            SalesOrderLine line = SalesOrderLine.builder()
                    .salesOrder(salesOrder)
                    .product(product)
                    .quantity(lineRequest.getQuantity())
                    .unitPrice(lineRequest.getUnitPrice())
                    .subtotal(lineRequest.getUnitPrice().multiply(BigDecimal.valueOf(lineRequest.getQuantity())))
                    .quantityReserved(0)
                    .quantityShipped(0)
                    .build();

            salesOrder.getOrderLines().add(line);
            totalAmount = totalAmount.add(line.getSubtotal());
        }

        salesOrder.setTotalAmount(totalAmount);
        return salesOrderRepository.save(salesOrder);
    }

    @Override
    public SalesOrder update(Long id, SalesOrderRequest request) {
        SalesOrder existingOrder = getById(id);

        if (existingOrder.getStatus() != SalesOrderStatus.CREATED) {
            throw new BusinessException("Cannot update order with status: " + existingOrder.getStatus());
        }

        // Update warehouse if changed
        if (!existingOrder.getWarehouse().getId().equals(request.getWarehouseId())) {
            Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
            existingOrder.setWarehouse(warehouse);
        }

        existingOrder.setNotes(request.getNotes());

        // Clear existing lines and add new ones
        existingOrder.getOrderLines().clear();

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (SalesOrderLineRequest lineRequest : request.getOrderLines()) {
            Product product = productRepository.findById(lineRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

            int availableStock = getAvailableStock(product.getId(), existingOrder.getWarehouse().getId());
            if (availableStock < lineRequest.getQuantity()) {
                throw new BusinessException("Insufficient stock for product: " + product.getName());
            }

            SalesOrderLine line = SalesOrderLine.builder()
                    .salesOrder(existingOrder)
                    .product(product)
                    .quantity(lineRequest.getQuantity())
                    .unitPrice(lineRequest.getUnitPrice())
                    .subtotal(lineRequest.getUnitPrice().multiply(BigDecimal.valueOf(lineRequest.getQuantity())))
                    .quantityReserved(0)
                    .quantityShipped(0)
                    .build();

            existingOrder.getOrderLines().add(line);
            totalAmount = totalAmount.add(line.getSubtotal());
        }

        existingOrder.setTotalAmount(totalAmount);
        return salesOrderRepository.save(existingOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public SalesOrder getById(Long id) {
        return salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sales order not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public SalesOrder getByOrderNumber(String orderNumber) {
        return salesOrderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Sales order not found with order number: " + orderNumber));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalesOrder> getAll(Pageable pageable) {
        return salesOrderRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalesOrder> getByClientId(Long clientId, Pageable pageable) {
        return salesOrderRepository.findByClientId(clientId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalesOrder> getByStatus(SalesOrderStatus status, Pageable pageable) {
        return salesOrderRepository.findByStatus(status, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalesOrder> getByClientIdAndStatus(Long clientId, SalesOrderStatus status, Pageable pageable) {
        return salesOrderRepository.findByClientIdAndStatus(clientId, status, pageable);
    }

    @Override
    public ReservationResultResponse reserve(Long id, ReserveRequest request) {
        SalesOrder order = getById(id);

        if (order.getStatus() != SalesOrderStatus.CREATED) {
            throw new BusinessException("Cannot reserve order with status: " + order.getStatus());
        }

        List<LineReservationDetail> reservationDetails = new ArrayList<>();
        boolean allReserved = true;

        for (SalesOrderLine line : order.getOrderLines()) {
            int availableStock = getAvailableStock(line.getProduct().getId(), order.getWarehouse().getId());
            int toReserve = Math.min(line.getQuantity() - line.getQuantityReserved(), availableStock);

            if (toReserve > 0) {
                // Reserve stock in inventory
                reserveStock(line.getProduct().getId(), order.getWarehouse().getId(), toReserve);
                line.setQuantityReserved(line.getQuantityReserved() + toReserve);
            }

            boolean lineFullyReserved = line.getQuantityReserved().equals(line.getQuantity());
            if (!lineFullyReserved) {
                allReserved = false;
            }

            reservationDetails.add(LineReservationDetail.builder()
                    .productId(line.getProduct().getId())
                    .productName(line.getProduct().getName())
                    .requestedQuantity(line.getQuantity())
                    .reservedQuantity(line.getQuantityReserved())
                    .fullyReserved(lineFullyReserved)
                    .build());
        }

        if (allReserved) {
            order.setStatus(SalesOrderStatus.RESERVED);
            order.setReservedAt(LocalDateTime.now());
        }

        salesOrderRepository.save(order);

        return ReservationResultResponse.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus().name())
                .fullyReserved(allReserved)
                .lineDetails(reservationDetails)
                .build();
    }

    @Override
    public SalesOrder cancel(Long id) {
        SalesOrder order = getById(id);

        if (order.getStatus() == SalesOrderStatus.SHIPPED || order.getStatus() == SalesOrderStatus.DELIVERED) {
            throw new BusinessException("Cannot cancel order with status: " + order.getStatus());
        }

        // Release reserved stock
        for (SalesOrderLine line : order.getOrderLines()) {
            if (line.getQuantityReserved() > 0) {
                releaseStock(line.getProduct().getId(), order.getWarehouse().getId(), line.getQuantityReserved());
                line.setQuantityReserved(0);
            }
        }

        order.setStatus(SalesOrderStatus.CANCELED);
        order.setCanceledAt(LocalDateTime.now());
        return salesOrderRepository.save(order);
    }

    @Override
    public SalesOrder markAsShipped(Long id) {
        SalesOrder order = getById(id);

        if (order.getStatus() != SalesOrderStatus.RESERVED) {
            throw new BusinessException("Order must be reserved before shipping");
        }

        // Update shipped quantities and reduce stock
        for (SalesOrderLine line : order.getOrderLines()) {
            line.setQuantityShipped(line.getQuantityReserved());
            // Reduce actual stock (reserved quantity becomes shipped)
            reduceStock(line.getProduct().getId(), order.getWarehouse().getId(), line.getQuantityShipped());
        }

        order.setStatus(SalesOrderStatus.SHIPPED);
        order.setShippedAt(LocalDateTime.now());
        return salesOrderRepository.save(order);
    }

    @Override
    public SalesOrder markAsDelivered(Long id) {
        SalesOrder order = getById(id);

        if (order.getStatus() != SalesOrderStatus.SHIPPED) {
            throw new BusinessException("Order must be shipped before delivery");
        }

        order.setStatus(SalesOrderStatus.DELIVERED);
        order.setDeliveredAt(LocalDateTime.now());
        return salesOrderRepository.save(order);
    }

    @Override
    public int releaseExpiredReservations(int expiryMinutes) {
        LocalDateTime expiryDate = LocalDateTime.now().minusMinutes(expiryMinutes);
        List<SalesOrder> expiredOrders = salesOrderRepository.findExpiredReservations(
                SalesOrderStatus.RESERVED, expiryDate);

        int count = 0;
        for (SalesOrder order : expiredOrders) {
            // Release reserved stock
            for (SalesOrderLine line : order.getOrderLines()) {
                if (line.getQuantityReserved() > 0) {
                    releaseStock(line.getProduct().getId(), order.getWarehouse().getId(), line.getQuantityReserved());
                    line.setQuantityReserved(0);
                }
            }
            order.setStatus(SalesOrderStatus.CREATED);
            salesOrderRepository.save(order);
            count++;
        }
        return count;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesOrder> getOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return salesOrderRepository.findByCreatedAtBetween(startDate, endDate);
    }

    @Override
    public void delete(Long id) {
        SalesOrder order = getById(id);

        if (order.getStatus() != SalesOrderStatus.CREATED && order.getStatus() != SalesOrderStatus.CANCELED) {
            throw new BusinessException("Cannot delete order with status: " + order.getStatus());
        }

        salesOrderRepository.delete(order);
    }

    // Helper methods for stock management
    private int getAvailableStock(Long productId, Long warehouseId) {
        return inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                .map(inv -> inv.getQuantityOnHand() - inv.getQuantityReserved())
                .orElse(0);
    }

    private void reserveStock(Long productId, Long warehouseId, int quantity) {
        Inventory inventory = inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
        inventory.setQuantityReserved(inventory.getQuantityReserved() + quantity);
        inventoryRepository.save(inventory);
    }

    private void releaseStock(Long productId, Long warehouseId, int quantity) {
        Inventory inventory = inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
        inventory.setQuantityReserved(Math.max(0, inventory.getQuantityReserved() - quantity));
        inventoryRepository.save(inventory);
    }

    private void reduceStock(Long productId, Long warehouseId, int quantity) {
        Inventory inventory = inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory not found"));
        inventory.setQuantityOnHand(inventory.getQuantityOnHand() - quantity);
        inventory.setQuantityReserved(inventory.getQuantityReserved() - quantity);
        inventoryRepository.save(inventory);
    }
}
