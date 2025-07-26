package org.cardanofoundation.reeve.indexer.model.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    private String number;
    private Vat vat;
    private Currency currency;

}
