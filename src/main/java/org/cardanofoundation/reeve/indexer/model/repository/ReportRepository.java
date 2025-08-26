package org.cardanofoundation.reeve.indexer.model.repository;

import java.util.Collection;
import java.util.List;
import org.cardanofoundation.reeve.indexer.model.domain.Interval;
import org.cardanofoundation.reeve.indexer.model.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<ReportEntity, Long> {

    List<ReportEntity> findAllByOrganisationIdAndSubTypeAndIntervalAndYearAndPeriod(
            String organisationId, String subType, Interval interval, short year,
            short period);
}
