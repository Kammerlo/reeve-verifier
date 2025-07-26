package org.cardanofoundation.reeve.indexer.model.repository;

import org.cardanofoundation.reeve.indexer.model.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<TransactionEntity, String> {
}
