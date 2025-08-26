package org.cardanofoundation.reeve.indexer.model.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.EnumNamingStrategies.CamelCaseStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategies.LowerCamelCaseStrategy.class)
public class TransactionsSearchRequest {
    
    @Schema(example = "75f95560c1d883ee7628993da5adf725a5d97a13929fd4f477be0faf5020ca94")
    @NotBlank(message = "Organisation Id is mandatory and must not be blank or null.")
    private String organisationId;

    @Schema(example = "2023-01-01")
    @NotNull
    private LocalDate dateFrom;

    @Schema(example = "2023-31-01")
    @NotNull
    private LocalDate dateTo;

    private Set<String> events;
    
    private Set<String> currency;

    private Optional<BigDecimal> minAmount;

    private Optional<BigDecimal> maxAmount;

    private Set<String> transactionHashes;
}
