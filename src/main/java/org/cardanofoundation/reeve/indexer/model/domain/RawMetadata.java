package org.cardanofoundation.reeve.indexer.model.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
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
    private Long ver;
    private ReeveTransactionType type;
    private Metadata metadata;

    private Object data;
    private List<Transaction> transactions;

    // In case it's a report
    private Interval interval;
    private Integer year;
    private Integer period;
    private String subType;
}
