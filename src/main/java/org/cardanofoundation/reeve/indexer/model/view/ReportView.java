package org.cardanofoundation.reeve.indexer.model.view;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.cardanofoundation.reeve.indexer.model.entity.ReportEntity;

@AllArgsConstructor
@RequiredArgsConstructor
@Builder
@Getter
public class ReportView {

    private Long id;

    private String interval;

    private String year;

    private int period;

    private String subType;

    private String fields; // Assuming fields is a JSON string, adjust as necessary

    public static ReportView fromEntity(ReportEntity entity) {
        return ReportView.builder()
                .id(entity.getId())
                .interval(entity.getInterval().name()) // Assuming Interval is an Enum
                .year(entity.getYear())
                .period(entity.getPeriod())
                .subType(entity.getSubType())
                .fields(entity.getFields())
                .build();
    }
}
