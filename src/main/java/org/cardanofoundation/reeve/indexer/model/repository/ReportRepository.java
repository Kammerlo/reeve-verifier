package org.cardanofoundation.reeve.indexer.model.repository;

import java.util.List;
import org.cardanofoundation.reeve.indexer.model.domain.Interval;
import org.cardanofoundation.reeve.indexer.model.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<ReportEntity, Long> {

    @Query("""
            SELECT r FROM ReportEntity r
            WHERE (:organisationId IS NULL OR r.organisationId = :organisationId)
            AND (:subType IS NULL OR r.subType = :subType)
            AND (:interval IS NULL OR r.interval = :interval)
            AND (:year IS NULL OR r.year = :year)
            AND (:period IS NULL OR r.period = :period)
            """)
    List<ReportEntity> findAllByOrganisationIdAndSubTypeAndIntervalAndYearAndPeriod(
            @Param("organisationId") String organisationId, @Param("subType") String subType,
            @Param("interval") Interval interval, @Param("year") Short year,
            @Param("period") Short period);
}
