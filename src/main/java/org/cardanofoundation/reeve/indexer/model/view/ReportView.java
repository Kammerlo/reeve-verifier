package org.cardanofoundation.reeve.indexer.model.view;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.cardanofoundation.reeve.indexer.model.entity.ReportEntity;

import java.util.Map;

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

    private Map<String, Object> fields; // Assuming fields is a JSON string, adjust as necessary

    public static ReportView fromEntity(ReportEntity entity, ObjectMapper objectMapper) throws JsonProcessingException {
        return ReportView.builder()
                .id(entity.getId())
                .interval(entity.getInterval().name()) // Assuming Interval is an Enum
                .year(entity.getYear())
                .period(entity.getPeriod())
                .subType(entity.getSubType())
                .fields(objectMapper.readValue(entity.getFields(), Map.class))
                .build();
    }
}
