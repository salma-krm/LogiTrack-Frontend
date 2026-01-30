package com.smartusers.logitrackapi.dto.salesorder;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LineReservationDetail {

    private Long lineId;
    private Long productId;
    private String productSku;
    private String productName;
    private Integer requestedQuantity;
    private Integer reservedQuantity;
    private Integer missingQuantity;
    private Boolean fullyReserved;
}