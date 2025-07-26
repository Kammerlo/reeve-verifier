package org.cardanofoundation.reeve.indexer.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cardanofoundation.reeve.indexer.model.entity.TransactionEntity;
import org.cardanofoundation.reeve.indexer.model.repository.TransactionRepository;
import org.cardanofoundation.reeve.indexer.model.view.TransactionView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Page<TransactionView> findAllTransactions(Pageable pageable) {
        Page<TransactionEntity> transactionPage = transactionRepository.findAll(pageable);
        // Map the entity page to a DTO page
        return transactionPage.map(TransactionView::fromEntity);
    }
}
