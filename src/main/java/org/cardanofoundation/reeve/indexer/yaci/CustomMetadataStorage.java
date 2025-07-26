package org.cardanofoundation.reeve.indexer.yaci;

import com.bloxbean.cardano.yaci.store.metadata.domain.TxMetadataLabel;
import com.bloxbean.cardano.yaci.store.metadata.storage.impl.TxMetadataStorageImpl;
import com.bloxbean.cardano.yaci.store.metadata.storage.impl.mapper.MetadataMapper;
import com.bloxbean.cardano.yaci.store.metadata.storage.impl.repository.TxMetadataLabelRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.cardanofoundation.reeve.indexer.model.domain.RawMetadata;
import org.cardanofoundation.reeve.indexer.model.domain.ReeveTransactionType;
import org.cardanofoundation.reeve.indexer.model.domain.Transaction;
import org.cardanofoundation.reeve.indexer.model.entity.ReportEntity;
import org.cardanofoundation.reeve.indexer.model.entity.TransactionEntity;
import org.cardanofoundation.reeve.indexer.model.repository.ReportRepository;
import org.cardanofoundation.reeve.indexer.model.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@Slf4j
public class CustomMetadataStorage extends TxMetadataStorageImpl {

    @Value("${reeve.label}")
    private String metadataLabel;
    @Value("${reeve.address}")
    private String address;
    @Value("${reeve.organisation}")
    private String orgId;
    private final ObjectMapper objectMapper;
    private final TransactionRepository transactionRepository;
    private final ReportRepository reportRepository;

    public CustomMetadataStorage(ObjectMapper objectMapper, TransactionRepository transactionRepository, ReportRepository reportRepository, TxMetadataLabelRepository metadataLabelRepository, MetadataMapper metadataMapper) {
        super(metadataLabelRepository, metadataMapper);
        this.objectMapper = objectMapper;
        this.transactionRepository = transactionRepository;
        this.reportRepository = reportRepository;
    }

    @Override
    public List<TxMetadataLabel> saveAll(List<TxMetadataLabel> txMetadataLabelsList) {
        List<TxMetadataLabel> filteredList = txMetadataLabelsList.stream()
                .filter(metadata -> metadata.getLabel().equals(metadataLabel)
                        && metadata.getBody().contains(orgId) // Not the best solution but works for now
                )
                .toList();

        List<RawMetadata> list = filteredList.stream().map(metadata -> {
            try {
                RawMetadata rawMetadata = objectMapper.readValue(metadata.getBody(), RawMetadata.class);
                rawMetadata.setTxHash(metadata.getTxHash());
                return rawMetadata;
            } catch (JsonProcessingException e) {
                log.error("Can't parse metadata of transaction: {}, error: {}", metadata.getTxHash(), e.getMessage());
            }
            return null;
        }).filter(rawMetadata -> Optional.ofNullable(rawMetadata).isPresent()).toList();

        if(!list.isEmpty()) {
            list.forEach(rawMetadata -> {
                if(rawMetadata.getType() == ReeveTransactionType.INDIVIDUAL_TRANSACTIONS) {
                    List<TransactionEntity> transactionEntities = ((List<Transaction>)rawMetadata.getData()).stream().map(transaction -> {
                        TransactionEntity entity = transaction.toEntity();
                        entity.setTxHash(rawMetadata.getTxHash());
                        return entity;
                    }).toList();
                    transactionRepository.saveAll(transactionEntities);
                }
                if(rawMetadata.getType() == ReeveTransactionType.REPORT) {
                    ReportEntity reportEntity = ReportEntity.builder()
                            .txHash(rawMetadata.getTxHash())
                            .interval(rawMetadata.getInterval())
                            .year(rawMetadata.getYear())
                            .period(rawMetadata.getPeriod())
                            .subType(rawMetadata.getSubType())
                            .fields((String) rawMetadata.getData())
                            .build();
                    reportRepository.save(reportEntity);
                }
            });
        }

        return List.of();
    }

}
