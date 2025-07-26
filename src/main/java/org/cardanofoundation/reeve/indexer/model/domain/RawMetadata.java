package org.cardanofoundation.reeve.indexer.model.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.cardanofoundation.reeve.indexer.util.RawMetadataDeserializer;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@JsonDeserialize(using = RawMetadataDeserializer.class)
public class RawMetadata {

    private String txHash;

    private Organisation org;
    private int ver;
    private ReeveTransactionType type;
    private Metadata metadata;

    private Object data;
    private List<Transaction> transactions;

    // In case it's a report
    private Interval interval;
    private String year;
    private int period;
    private String subType;
}
