package org.cardanofoundation.reeve.indexer.model.request;

import org.hibernate.query.sqm.IntervalType;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategies.LowerCamelCaseStrategy.class)
public class ReportSearchRequest {
    
    @Schema(example = "75f95560c1d883ee7628993da5adf725a5d97a13929fd4f477be0faf5020ca94")
    @NotBlank(message = "Organisation Id is mandatory and must not be blank or null.")
    private String organisationId;

    @Schema(example = "INCOME_STATEMENT")
    private String reportType;

    private String intervalType;

    @Schema(example = "2024")
    private short year;

    @Schema(example = "3")
    private short period;

}
