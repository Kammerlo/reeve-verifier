package org.cardanofoundation.reeve.indexer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cardanofoundation.reeve.indexer.model.repository.ReportRepository;
import org.cardanofoundation.reeve.indexer.model.view.ReportView;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ObjectMapper objectMapper;

    public List<ReportView> findAll() {
        log.info("Fetching all reports");
        return reportRepository.findAll().stream()
                .map(reportEntity -> {
                    try {
                        return ReportView.fromEntity(reportEntity, objectMapper);
                    } catch (Exception e) {
                        log.error("Error converting ReportEntity to ReportView: {}", e.getMessage());
                        return null;
                    }
                })
                .toList();
    }
}
