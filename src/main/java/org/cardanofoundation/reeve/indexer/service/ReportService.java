package org.cardanofoundation.reeve.indexer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cardanofoundation.reeve.indexer.model.domain.Interval;
import org.cardanofoundation.reeve.indexer.model.repository.ReportRepository;
import org.cardanofoundation.reeve.indexer.model.view.ReportView;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final OrganisationService organisationService;
    private final ObjectMapper objectMapper;

    public List<ReportView> findAllByTypeAndPeriod(String organisationId, String reportType,
            String intervalType, short year, short period) {
       return reportRepository.findAllByOrganisationIdAndSubTypeAndIntervalAndYearAndPeriod(
                organisationId, reportType, Interval.valueOf(intervalType), year, period)
                .stream()
                .map(reportEntity -> {
                    try {
                        return ReportView.fromEntity(reportEntity,
                                organisationService.findById(organisationId).orElseThrow(),
                                objectMapper);
                    } catch (Exception e) {
                        log.error("Error converting ReportEntity to ReportView: {}", e.getMessage());
                        return null;
                    }
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    public List<ReportView> findAll() {
        return reportRepository.findAll()
                .stream()
                .map(reportEntity -> {
                    try {
                        return ReportView.fromEntity(reportEntity,
                                organisationService.findById(reportEntity.getOrganisationId()).orElseThrow(),
                                objectMapper);
                    } catch (Exception e) {
                        log.error("Error converting ReportEntity to ReportView: {}", e.getMessage());
                        return null;
                    }
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }
}
