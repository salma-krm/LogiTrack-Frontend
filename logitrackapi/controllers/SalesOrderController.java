package com.smartusers.logitrackapi.controllers;

import com.smartusers.logitrackapi.annotation.RequireAuth;
import com.smartusers.logitrackapi.annotation.RequireRole;
import com.smartusers.logitrackapi.dto.salesorder.*;
import com.smartusers.logitrackapi.entity.SalesOrder;
import com.smartusers.logitrackapi.entity.User;
import com.smartusers.logitrackapi.enums.SalesOrderStatus;
import com.smartusers.logitrackapi.mapper.SalesOrderMapper;
import com.smartusers.logitrackapi.service.impl.SessionManager;
import com.smartusers.logitrackapi.service.interfaces.SalesOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;
    private final SalesOrderMapper salesOrderMapper;
    private final SessionManager sessionManager;

    /**
     * Create a new sales order - Available to authenticated clients
     */
    @RequireAuth
    @PostMapping
    public ResponseEntity<SalesOrderResponse> create(
            @RequestHeader("Session-Id") String sessionId,
            @Valid @RequestBody SalesOrderRequest request
    ) {
        // Get client from session and set in request
        User client = sessionManager.getUserBySessionId(sessionId);
        request.setClientId(client.getId());

        SalesOrder salesOrder = salesOrderService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(salesOrderMapper.toResponse(salesOrder));
    }

    /**
     * Get all sales orders - Manager only
     */
    @RequireAuth
    @RequireRole("MANAGER")
    @GetMapping
    public ResponseEntity<Page<SalesOrderResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<SalesOrder> orders = salesOrderService.getAll(pageable);
        return ResponseEntity.ok(orders.map(salesOrderMapper::toResponse));
    }

    /**
     * Get orders for the current client
     */
    @RequireAuth
    @GetMapping("/my-orders")
    public ResponseEntity<Page<SalesOrderResponse>> getMyOrders(
            @RequestHeader("Session-Id") String sessionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User client = sessionManager.getUserBySessionId(sessionId);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<SalesOrder> orders = salesOrderService.getByClientId(client.getId(), pageable);
        return ResponseEntity.ok(orders.map(salesOrderMapper::toResponse));
    }

    /**
     * Get order by ID
     */
    @RequireAuth
    @GetMapping("/{id}")
    public ResponseEntity<SalesOrderResponse> getById(@PathVariable Long id) {
        SalesOrder order = salesOrderService.getById(id);
        return ResponseEntity.ok(salesOrderMapper.toResponse(order));
    }

    /**
     * Get order by order number
     */
    @RequireAuth
    @GetMapping("/by-number/{orderNumber}")
    public ResponseEntity<SalesOrderResponse> getByOrderNumber(@PathVariable String orderNumber) {
        SalesOrder order = salesOrderService.getByOrderNumber(orderNumber);
        return ResponseEntity.ok(salesOrderMapper.toResponse(order));
    }

    /**
     * Get orders by status - Manager only
     */
    @RequireAuth
    @RequireRole("MANAGER")
    @GetMapping("/by-status/{status}")
    public ResponseEntity<Page<SalesOrderResponse>> getByStatus(
            @PathVariable SalesOrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<SalesOrder> orders = salesOrderService.getByStatus(status, pageable);
        return ResponseEntity.ok(orders.map(salesOrderMapper::toResponse));
    }

    /**
     * Update a sales order
     */
    @RequireAuth
    @PutMapping("/{id}")
    public ResponseEntity<SalesOrderResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SalesOrderRequest request
    ) {
        SalesOrder updated = salesOrderService.update(id, request);
        return ResponseEntity.ok(salesOrderMapper.toResponse(updated));
    }

    /**
     * Reserve stock for an order - Manager only
     */
    @RequireAuth
    @RequireRole("MANAGER")
    @PostMapping("/{id}/reserve")
    public ResponseEntity<ReservationResultResponse> reserve(
            @PathVariable Long id,
            @RequestBody(required = false) ReserveRequest request
    ) {
        if (request == null) {
            request = new ReserveRequest();
        }
        ReservationResultResponse result = salesOrderService.reserve(id, request);
        return ResponseEntity.ok(result);
    }

    /**
     * Cancel an order
     */
    @RequireAuth
    @PostMapping("/{id}/cancel")
    public ResponseEntity<SalesOrderResponse> cancel(@PathVariable Long id) {
        SalesOrder canceled = salesOrderService.cancel(id);
        return ResponseEntity.ok(salesOrderMapper.toResponse(canceled));
    }

    /**
     * Mark order as shipped - Manager only
     */
    @RequireAuth
    @RequireRole("MANAGER")
    @PostMapping("/{id}/ship")
    public ResponseEntity<SalesOrderResponse> ship(@PathVariable Long id) {
        SalesOrder shipped = salesOrderService.markAsShipped(id);
        return ResponseEntity.ok(salesOrderMapper.toResponse(shipped));
    }

    /**
     * Mark order as delivered - Manager only
     */
    @RequireAuth
    @RequireRole("MANAGER")
    @PostMapping("/{id}/deliver")
    public ResponseEntity<SalesOrderResponse> deliver(@PathVariable Long id) {
        SalesOrder delivered = salesOrderService.markAsDelivered(id);
        return ResponseEntity.ok(salesOrderMapper.toResponse(delivered));
    }

    /**
     * Delete an order
     */
    @RequireAuth
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        salesOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

