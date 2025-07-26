package org.cardanofoundation.reeve.indexer.model.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.cardanofoundation.reeve.indexer.model.entity.TransactionItemEntity;

import java.util.Optional;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionItem {

    private String id;
    private String amount;
    private String fxRate;
    private Document document;
    private CostCenter costCenter;

    public TransactionItemEntity toEntity() {
        return TransactionItemEntity.builder()
                .id(id)
                .amount(amount)
                .fxRate(fxRate)
                .documentNumber(Optional.ofNullable(document).map(Document::getNumber).orElse(null))
                .currency(Optional.ofNullable(document)
                        .map(Document::getCurrency)
                        .map(Currency::getCustCode)
                        .orElse(null))
                .costCenterCustCode(Optional.ofNullable(costCenter)
                        .map(CostCenter::getCustCode)
                        .orElse(null))
                .costCenterName(Optional.ofNullable(costCenter)
                        .map(CostCenter::getName)
                        .orElse(null))
                .build();
    }

}
