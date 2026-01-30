package com.smartusers.logitrackapi.mapper;

import com.smartusers.logitrackapi.dto.salesorder.*;
import com.smartusers.logitrackapi.entity.SalesOrder;
import com.smartusers.logitrackapi.entity.SalesOrderLine;
import com.smartusers.logitrackapi.entity.Shipment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SalesOrderMapper {

    public SalesOrderResponse toResponse(SalesOrder salesOrder) {
        if (salesOrder == null) {
            return null;
        }

        return SalesOrderResponse.builder()
                .id(salesOrder.getId())
                .orderNumber(salesOrder.getOrderNumber())
                .clientId(salesOrder.getClient() != null ? salesOrder.getClient().getId() : null)
                .clientName(salesOrder.getClient() != null ? salesOrder.getClient().getName() : null)
                .warehouseId(salesOrder.getWarehouse() != null ? salesOrder.getWarehouse().getId() : null)
                .warehouseName(salesOrder.getWarehouse() != null ? salesOrder.getWarehouse().getName() : null)
                .status(salesOrder.getStatus())
                .createdAt(salesOrder.getCreatedAt())
                .reservedAt(salesOrder.getReservedAt())
                .shippedAt(salesOrder.getShippedAt())
                .deliveredAt(salesOrder.getDeliveredAt())
                .canceledAt(salesOrder.getCanceledAt())
                .totalAmount(salesOrder.getTotalAmount())
                .notes(salesOrder.getNotes())
                .orderLines(toLineResponseList(salesOrder.getOrderLines()))
                .shipment(toShipmentSummary(salesOrder.getShipment()))
                .build();
    }

    public List<SalesOrderResponse> toResponseList(List<SalesOrder> salesOrders) {
        if (salesOrders == null) {
            return null;
        }
        return salesOrders.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SalesOrderLineResponse toLineResponse(SalesOrderLine line) {
        if (line == null) {
            return null;
        }

        return SalesOrderLineResponse.builder()
                .id(line.getId())
                .productId(line.getProduct() != null ? line.getProduct().getId() : null)
                .productName(line.getProduct() != null ? line.getProduct().getName() : null)
                .productSku(line.getProduct() != null ? line.getProduct().getSku() : null)
                .quantity(line.getQuantity())
                .unitPrice(line.getUnitPrice())
                .subtotal(line.getSubtotal())
                .quantityReserved(line.getQuantityReserved())
                .quantityShipped(line.getQuantityShipped())
                .build();
    }

    public List<SalesOrderLineResponse> toLineResponseList(List<SalesOrderLine> lines) {
        if (lines == null) {
            return null;
        }
        return lines.stream()
                .map(this::toLineResponse)
                .collect(Collectors.toList());
    }

    public ShipmentSummaryResponse toShipmentSummary(Shipment shipment) {
        if (shipment == null) {
            return null;
        }

        return ShipmentSummaryResponse.builder()
                .id(shipment.getId())
                .trackingNumber(shipment.getTrackingNumber())
                .status(shipment.getStatus() != null ? shipment.getStatus().name() : null)
                .build();
    }
}