package org.cardanofoundation.reeve.indexer.resource;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cardanofoundation.reeve.indexer.model.view.TransactionView;
import org.cardanofoundation.reeve.indexer.service.TransactionService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;

    @Operation(summary = "Get all transactions (paginated)",
            description = "Retrieves a paginated list of all transactions. " +
                    "You can customize pagination with `page`, `size`, and `sort` parameters. " +
                    "Example: /api/transactions?page=0&size=10&sort=date,desc",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List of transactions retrieved successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = TransactionView.class)
                            )),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            })
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of transactions")
    @GetMapping
    public ResponseEntity<Page<TransactionView>> getAllTransactions(@ParameterObject Pageable pageable) {
        Page<TransactionView> transactionPage = transactionService.findAllTransactions(pageable);
        return ResponseEntity.ok(transactionPage);
    }
}
