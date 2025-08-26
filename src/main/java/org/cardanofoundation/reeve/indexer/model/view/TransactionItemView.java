package org.cardanofoundation.reeve.indexer.model.view;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.cardanofoundation.reeve.indexer.model.entity.TransactionItemEntity;

import com.fasterxml.jackson.annotation.JsonInclude;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionItemView {

    private String id;
    private String amount;
    private String currency;
    private String documentNumber;

    public static TransactionItemView fromEntity(TransactionItemEntity entity) {
        return TransactionItemView.builder()
                .id(entity.getId())
                .amount(entity.getAmount())
                .currency(entity.getCurrency())
                .documentNumber(entity.getDocumentNumber())
                .build();
    }
}
