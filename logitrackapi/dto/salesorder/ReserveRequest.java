package com.smartusers.logitrackapi.dto.salesorder;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReserveRequest {

    private Boolean allowPartialReservation = false;
    private Boolean createBackorder = true;
}
