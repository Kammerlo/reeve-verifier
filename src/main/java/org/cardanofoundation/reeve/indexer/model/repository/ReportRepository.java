package org.cardanofoundation.reeve.indexer.model.repository;

import org.cardanofoundation.reeve.indexer.model.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<ReportEntity, String> {
}
