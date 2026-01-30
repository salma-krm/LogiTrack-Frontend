// ============================================
// SalesOrder Service Interface
// ============================================
package com.smartusers.logitrackapi.service.interfaces;

import com.smartusers.logitrackapi.dto.salesorder.*;
import com.smartusers.logitrackapi.entity.SalesOrder;
import com.smartusers.logitrackapi.enums.SalesOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesOrderService {


    SalesOrder create(SalesOrderRequest request);


    SalesOrder update(Long id, SalesOrderRequest request);


    SalesOrder getById(Long id);

    SalesOrder getByOrderNumber(String orderNumber);


    Page<SalesOrder> getAll(Pageable pageable);


    Page<SalesOrder> getByClientId(Long clientId, Pageable pageable);

    Page<SalesOrder> getByStatus(SalesOrderStatus status, Pageable pageable);

    /**
     * Get sales orders by client and status
     * @param clientId The client ID
     * @param status The order status
     * @param pageable Pagination parameters
     * @return Page of sales orders
     */
    Page<SalesOrder> getByClientIdAndStatus(Long clientId, SalesOrderStatus status, Pageable pageable);

    ReservationResultResponse reserve(Long id, ReserveRequest request);


    SalesOrder cancel(Long id);

    SalesOrder markAsShipped(Long id);


    SalesOrder markAsDelivered(Long id);

    int releaseExpiredReservations(int expiryDuration);


    List<SalesOrder> getOrdersBetweenDates(LocalDateTime startDate, LocalDateTime endDate);

    void delete(Long id);
}
