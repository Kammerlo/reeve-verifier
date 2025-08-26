package org.cardanofoundation.reeve.indexer.service;

import java.util.List;
import java.util.Optional;

import org.cardanofoundation.reeve.indexer.model.domain.Organisation;
import org.cardanofoundation.reeve.indexer.model.entity.OrganisationEntity;
import org.cardanofoundation.reeve.indexer.model.repository.OrganisationRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrganisationService {

    private final OrganisationRepository organisationRepository;

    public Optional<OrganisationEntity> findById(String organisationId) {
        return organisationRepository.findById(organisationId);
    }

    public List<Organisation> getAllOrganisations() {
        log.info("Fetching all organisations");
        List<OrganisationEntity> organisationEntities = organisationRepository.findAll();
        return organisationEntities.stream()
                .map(this::mapToDomain)
                .toList();
    }

    private Organisation mapToDomain(OrganisationEntity entity) {
        return Organisation.builder()
                .id(entity.getId())
                .name(entity.getName())
                .countryCode(entity.getCountryCode())
                .currencyId(entity.getCurrencyId())
                .taxIdNumber(entity.getTaxIdNumber())
                .build();
    }
}
