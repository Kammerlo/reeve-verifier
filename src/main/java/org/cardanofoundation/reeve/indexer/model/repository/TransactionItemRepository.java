package org.cardanofoundation.reeve.indexer.model.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.cardanofoundation.reeve.indexer.model.entity.TransactionItemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionItemRepository extends JpaRepository<TransactionItemEntity, String> {

    // Define custom query methods if needed
    // For example, to find items by transaction ID or other criteria
    List<TransactionItemEntity> findByTransactionId(String transactionId);

    @Query("""
            SELECT i FROM TransactionItemEntity i
            WHERE (:organisationId IS NULL OR i.transaction.organisationId = :organisationId)
            AND (:dateFrom IS NULL OR i.transaction.date >= :dateFrom)
            AND (:dateTo IS NULL OR i.transaction.date <= :dateTo)
            AND (:events IS NULL OR i.eventCode IN :events)
            AND (:currencies IS NULL OR i.currency IN :currencies)
            AND (:minAmount IS NULL OR i.amount >= :minAmount)
            AND (:maxAmount IS NULL OR i.amount <= :maxAmount)
            AND (:transactionHashes IS NULL OR i.transaction.txHash IN :transactionHashes)
            """)
    Page<TransactionItemEntity> searchItems(@Param("organisationId") String organisationId, @Param("dateFrom") LocalDate dateFrom,
            @Param("dateTo") LocalDate dateTo, @Param("events") Set<String> events, @Param("currencies") Set<String> currencies, @Param("minAmount") Optional<BigDecimal> minAmount,
            @Param("maxAmount") Optional<BigDecimal> maxAmount, @Param("transactionHashes") Set<String> transactionHashes, Pageable pageable);

    // Additional methods can be added here as required
    
}
