package com.smartusers.logitrackapi.dto.salesorder;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResultResponse {

    private Long orderId;
    private Long salesOrderId;
    private String orderNumber;
    private Boolean fullyReserved;
    private String status;
    @Builder.Default
    private List<LineReservationDetail> lineDetails = new ArrayList<>();
    private String message;
}