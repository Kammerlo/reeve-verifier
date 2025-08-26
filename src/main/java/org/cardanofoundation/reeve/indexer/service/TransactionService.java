package org.cardanofoundation.reeve.indexer.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.cardanofoundation.reeve.indexer.model.entity.TransactionEntity;
import org.cardanofoundation.reeve.indexer.model.entity.TransactionItemEntity;
import org.cardanofoundation.reeve.indexer.model.repository.TransactionItemRepository;
import org.cardanofoundation.reeve.indexer.model.repository.TransactionRepository;
import org.cardanofoundation.reeve.indexer.model.view.ExtractionTransactionItemView;
import org.cardanofoundation.reeve.indexer.model.view.ExtractionTransactionView;
import org.cardanofoundation.reeve.indexer.model.view.TransactionView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionItemRepository transactionItemRepository;

    public Page<TransactionView> findAllTransactions(Pageable pageable) {
        Page<TransactionEntity> transactionPage = transactionRepository.findAll(pageable);
        // Map the entity page to a DTO page
        return transactionPage.map(TransactionView::fromEntity);
    }

    public ExtractionTransactionView findTransactionItems(String organisationId, LocalDate dateFrom, LocalDate dateTo,
            Set<String> events,
            Set<String> currencies, Optional<BigDecimal> minAmount,
            Optional<BigDecimal> maxAmount, Set<String> transactionHashes, Pageable pageable) {

        Page<TransactionItemEntity> transactionItems = transactionItemRepository.searchItems(organisationId, dateFrom,
                dateTo, events, currencies, minAmount, maxAmount, transactionHashes, pageable);
        List<ExtractionTransactionItemView> itemViews = transactionItems.stream()
                .map(ExtractionTransactionItemView::fromEntity).toList();
        return ExtractionTransactionView.createSuccess(itemViews, transactionItems.getTotalElements(),
                pageable.getPageNumber(), pageable.getPageSize());
    }
}
