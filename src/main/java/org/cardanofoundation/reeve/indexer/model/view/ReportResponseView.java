package org.cardanofoundation.reeve.indexer.model.view;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ProblemDetail;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReportResponseView {

    private boolean success;

    private Long total;
    private List<ReportView> report;
    private Optional<ProblemDetail> error;

    public static ReportResponseView createSuccess(List<ReportView> reportView) {
        return new ReportResponseView(true, reportView.stream().count(), reportView,
                Optional.empty());
    }

    public static ReportResponseView createFail(ProblemDetail error) {
        return new ReportResponseView(false, 0L, List.of(), Optional.of(error));
    }
}
