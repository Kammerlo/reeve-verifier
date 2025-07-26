package org.cardanofoundation.reeve.indexer.service;

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

    public List<ReportView> findAll() {
        log.info("Fetching all reports");
        return reportRepository.findAll().stream()
                .map(ReportView::fromEntity)
                .toList();
    }
}
