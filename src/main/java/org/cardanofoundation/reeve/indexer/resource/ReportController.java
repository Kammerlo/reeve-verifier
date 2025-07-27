package org.cardanofoundation.reeve.indexer.resource;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.cardanofoundation.reeve.indexer.model.entity.ReportEntity;
import org.cardanofoundation.reeve.indexer.model.view.ReportView;
import org.cardanofoundation.reeve.indexer.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Slf4j
public class ReportController {

    private final ReportService reportService;

    @Operation(summary = "Get all reports", description = "Retrieves a list of all reports currently stored in the system.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List of reports retrieved successfully",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ReportView.class)
                            )),
                    @ApiResponse(responseCode = "500", description = "Internal server error")
            })
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of reports")
    @GetMapping
    public ResponseEntity<List<ReportView>> getAllReports() {
        List<ReportView> reports = reportService.findAll();
        return ResponseEntity.ok(reports);
    }

}
